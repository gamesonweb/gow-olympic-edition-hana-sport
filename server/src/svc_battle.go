package kartserver

import (
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
			b.mu.Lock()
			b.Update()
			b.mu.Unlock()
		}
	}()
	return b
}

func (b *BattleService) CreateBattle(mapConfigId uint32, players []*BattlePlayer) int {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.instanceIdCounter++
	instance := newBattleInstance(b.instanceIdCounter, mapConfigId, players)
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
	defer b.mu.Unlock()
	battle, ok := b.instancesByClientId[client.Id()]
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
		if instance.isAllPlayersFinished() {
			delete(b.instances, id)
			for _, player := range instance.players {
				delete(b.instancesByClientId, player.Id)
			}
		}
	}
}

func newBattleInstance(id int, mapConfigId uint32, players []*BattlePlayer) *BattleInstance {
	return &BattleInstance{
		id:          id,
		mapConfigId: mapConfigId,
		players:     players,
	}
}

type BattleInstance struct {
	id          int
	mapConfigId uint32
	clients     []*Client // slot null if not connected
	mu          sync.Mutex

	players             []*BattlePlayer
	pendingEntityUpdate map[int32]*pb.BattleEntity
}

type BattlePlayer struct {
	pb.BattleInitDataMsg_Player
	CurrentTurn       uint32
	CurrentCheckpoint uint32
	Finished          bool
	FinishTotalTime   float32
}

func (b *BattleInstance) Id() int {
	return b.id
}

func (b *BattleInstance) AddClient(client *Client) {
	b.mu.Lock()
	for i, player := range b.players {
		if player.Id == client.Id() {
			if b.clients[i] != nil {
				oldClient := b.clients[i]
				b.clients[i] = client
				b.mu.Unlock()
				oldClient.Close()
			} else {
				b.clients[i] = client
				b.mu.Unlock()
			}
			return
		}
	}
	b.mu.Unlock()

	players := make([]*pb.BattleInitDataMsg_Player, 0, len(b.players))
	for _, player := range b.players {
		players = append(players, &player.BattleInitDataMsg_Player)
	}
	client.Send(&pb.BattleInitDataMsg{
		SceneConfigId: b.mapConfigId,
		Players:       players,
	})
}

func (b *BattleInstance) RemoveClient(client *Client) {
	b.mu.Lock()
	for i, c := range b.clients {
		if c == client {
			b.clients[i] = nil
			break
		}
	}
	b.mu.Unlock()
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
	for _, client := range b.clients {
		if client != nil {
			client.Send(message)
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
	}
}

func (b *BattleInstance) update() {
	entityList := make([]*pb.BattleEntity, 0, len(b.pendingEntityUpdate))
	for _, entity := range b.pendingEntityUpdate {
		entityList = append(entityList, entity)
	}
	b.broadcast(&pb.BattleServerEntityUpdateMsg{
		Entities: entityList,
	})

	if b.isAllPlayersFinished() {
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
	}
}

func (b *BattleInstance) isAllPlayersFinished() bool {
	for _, player := range b.players {
		if !player.Finished {
			return false
		}
	}
	return true
}
