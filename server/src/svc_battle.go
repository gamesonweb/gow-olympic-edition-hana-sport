package kartserver

import (
	"log"
	"server/pb"
	"sync"
	"time"
)

type BattleService struct {
	instances           map[int]*BattleInstance
	instanceIdCounter   int
	instancesByClientId map[string]*BattleInstance
	mu                  sync.Mutex
}

func NewBattleService(tickInterval time.Duration) *BattleService {
	b := &BattleService{
		instances:           make(map[int]*BattleInstance),
		instancesByClientId: make(map[string]*BattleInstance),
	}
	go func() {
		ticker := time.NewTicker(tickInterval)
		for range ticker.C {
			b.Update()
		}
	}()
	return b
}

func (b *BattleService) CreateBattle(mapConfigId uint32, players []*BattlePlayer) int {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.instanceIdCounter++
	instance := newBattleInstance(b.instanceIdCounter, mapConfigId, players)
	instance.setState(pb.BattleState_WAITING_FOR_PLAYERS)
	b.instances[instance.id] = instance
	return instance.id
}

func (b *BattleService) AttachClientToBattle(client *Client, battleId int) {
	b.mu.Lock()
	defer b.mu.Unlock()
	battle := b.instances[battleId]
	battle.AddClient(client)
	b.instancesByClientId[client.Id()] = battle
}

func (b *BattleService) HandleMessage(client *Client, msg pb.Msg) {
	b.mu.Lock()
	defer b.mu.Unlock()
	battle, ok := b.instancesByClientId[client.Id()]
	if !ok {
		return
	}
	battle.Handle(client, msg)
}

func (b *BattleService) OnClientDisconnect(client *Client) {
	b.mu.Lock()
	battle, ok := b.instancesByClientId[client.Id()]
	b.mu.Unlock()

	if !ok {
		return
	}
	battle.RemoveClient(client)
}

func (b *BattleService) Update() {
	b.mu.Lock()
	defer b.mu.Unlock()
	for _, instance := range b.instances {
		instance.Update()
	}
	// remove finished instances
	for id, instance := range b.instances {
		if instance.state == pb.BattleState_FINISHED {
			delete(b.instances, id)
			for _, player := range instance.players {
				delete(b.instancesByClientId, player.Id)
			}
		}
	}
}

func newBattleInstance(id int, mapConfigId uint32, players []*BattlePlayer) *BattleInstance {
	return &BattleInstance{
		id:                  id,
		mapConfigId:         mapConfigId,
		players:             players,
		pendingEntityUpdate: make(map[int32]*pb.BattleEntity),
	}
}

type BattleInstance struct {
	id          int
	mapConfigId uint32
	mu          sync.Mutex

	state          pb.BattleState
	stateStartTime time.Time

	players             []*BattlePlayer
	pendingEntityUpdate map[int32]*pb.BattleEntity
}

type BattlePlayer struct {
	pb.BattleInitDataMsg_Player
	CurrentTurn       uint32
	CurrentCheckpoint uint32
	Finished          bool
	FinishTotalTime   float32
	Client            *Client
	SceneLoaded       bool
}

func (b *BattleInstance) Id() int {
	return b.id
}

func (b *BattleInstance) AddClient(client *Client) {
	b.mu.Lock()
	added := false
	for _, player := range b.players {
		if player.Id == client.Id() {
			player.Client = client
			added = true
			break
		}
	}
	b.mu.Unlock()

	if !added {
		log.Println("Player not found in battle instance")
		return
	}

	players := make([]*pb.BattleInitDataMsg_Player, 0, len(b.players))
	for _, player := range b.players {
		players = append(players, &player.BattleInitDataMsg_Player)
	}
	client.Send(&pb.BattleInitDataMsg{
		SceneConfigId:  b.mapConfigId,
		Players:        players,
		State:          b.state,
		TimeSinceStart: b.getStateDuration().Seconds(),
	})
}

func (b *BattleInstance) RemoveClient(client *Client) {
	b.mu.Lock()
	defer b.mu.Unlock()
	for i, c := range b.players {
		if c.Client == client {
			b.players[i].Client = nil
			break
		}
	}
}

func (b *BattleInstance) Update() {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.update()
}

func (b *BattleInstance) Handle(c *Client, msg pb.Msg) {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.handle(c, msg)
}

func (b *BattleInstance) getPlayerById(id string) *BattlePlayer {
	for _, player := range b.players {
		if player.Id == id {
			return player
		}
	}
	return nil
}

func (b *BattleInstance) broadcast(message pb.Msg) {
	for _, player := range b.players {
		if player.Client != nil {
			player.Client.Send(message)
		}
	}
}

func (b *BattleInstance) handle(c *Client, msg pb.Msg) {
	switch msg := msg.(type) {
	case *pb.BattleClientEntityUpdateMsg:
		b.pendingEntityUpdate[msg.Entity.Id] = msg.Entity
	case *pb.BattleClientCheckpointUpdateMsg:
		player := b.getPlayerById(c.Id())
		player.CurrentCheckpoint = msg.CheckpointIndex
		player.CurrentTurn = msg.Turn
		b.broadcast(&pb.BattleServerCheckpointUpdateMsg{
			PlayerId:        c.Id(),
			CheckpointIndex: msg.CheckpointIndex,
		})
	case *pb.BattleClientPlayerFinishMsg:
		player := b.getPlayerById(c.Id())
		player.Finished = true
		player.FinishTotalTime = msg.TotalTime
		b.broadcast(&pb.BattleServerPlayerFinishMsg{
			PlayerId:  c.Id(),
			TotalTime: msg.TotalTime,
		})
	case *pb.BattleClientReadyMsg:
		player := b.getPlayerById(c.Id())
		player.SceneLoaded = true
	default:
		// ignore
	}
}

func (b *BattleInstance) update() {
	b.broadcast(&pb.BattleHeartbeatMsg{
		TimeSinceStart: b.getStateDuration().Seconds(),
	})
	if len(b.pendingEntityUpdate) != 0 {
		entityList := make([]*pb.BattleEntity, 0, len(b.pendingEntityUpdate))
		for _, entity := range b.pendingEntityUpdate {
			entityList = append(entityList, entity)
		}
		b.broadcast(&pb.BattleServerEntityUpdateMsg{
			Entities: entityList,
		})
		b.pendingEntityUpdate = make(map[int32]*pb.BattleEntity)
	}
	b.updateState()
}

func (b *BattleInstance) setState(state pb.BattleState) {
	b.state = state
	b.stateStartTime = time.Now()
	b.broadcast(&pb.BattleStateUpdateMsg{
		State: state,
	})
}

func (b *BattleInstance) getStateDuration() time.Duration {
	return time.Since(b.stateStartTime)
}

const (
	WAITING_FOR_PLAYERS_DURATION = 10 * time.Second
	COUNTDOWN_DURATION           = 3 * time.Second
)

func (b *BattleInstance) updateState() {
	switch b.state {
	case pb.BattleState_WAITING_FOR_PLAYERS:
		isWaiting := false
		hasPlayersWithSceneLoaded := false
		for _, player := range b.players {
			if player.Client != nil && player.SceneLoaded {
				hasPlayersWithSceneLoaded = true
			}
			if player.Client != nil && !player.SceneLoaded {
				isWaiting = true
			}
		}
		if hasPlayersWithSceneLoaded {
			if !isWaiting || b.getStateDuration() > WAITING_FOR_PLAYERS_DURATION {
				b.setState(pb.BattleState_COUNTDOWN)
			}
		} else {
			if b.getStateDuration() > WAITING_FOR_PLAYERS_DURATION*3 {
				b.setState(pb.BattleState_COUNTDOWN)
			}
		}
	case pb.BattleState_COUNTDOWN:
		if b.getStateDuration() > COUNTDOWN_DURATION {
			b.setState(pb.BattleState_RACING)
		}
	case pb.BattleState_RACING:
		if b.isAllPlayersFinished() {
			b.setState(pb.BattleState_FINISHED)

			playerFinishResult := make([]*pb.BattleFinishMsg_Player, 0, len(b.players))
			for _, player := range b.players {
				playerFinishResult = append(playerFinishResult, &pb.BattleFinishMsg_Player{
					Id:        player.Id,
					Name:      player.Name,
					TotalTime: player.FinishTotalTime,
				})
			}
			b.broadcast(&pb.BattleFinishMsg{
				Players: playerFinishResult,
			})
			go func() {
				for _, player := range b.players {
					if err := Context.LeaderboardService.AddScore(b.mapConfigId, LeaderboardEntry{
						Id:    player.Id,
						Name:  player.Name,
						Score: float64(player.FinishTotalTime),
					}); err != nil {
						log.Println("Failed to add score to leaderboard: ", err)
					}
				}
			}()
		}
	}
}

func (b *BattleInstance) isAllPlayersFinished() bool {
	for _, player := range b.players {
		if !player.Finished && player.Client != nil && player.SceneLoaded {
			return false
		}
	}
	return true
}
