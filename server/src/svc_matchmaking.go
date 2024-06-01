package kartserver

import (
	"log"
	"server/pb"
	"sync"
)

type MatchmakingService struct {
	Queue          map[uint32]*queue
	MaxPlayers     int
	AvailableMaps  []uint32
	AvailableChars []uint32
	mu             sync.Mutex
}

func NewMatchmakingService(maxPlayers int, mapConfigs []uint32, charConfigs []uint32) *MatchmakingService {
	return &MatchmakingService{
		MaxPlayers:     maxPlayers,
		AvailableMaps:  mapConfigs,
		AvailableChars: charConfigs,
		Queue:          make(map[uint32]*queue),
	}
}

func (m *MatchmakingService) AddClient(client *Client, characterConfigId uint32, mapConfigId uint32) {
	m.RemoveClient(client)
	m.mu.Lock()
	defer m.mu.Unlock()
	mapQueue, ok := m.Queue[mapConfigId]
	if !ok {
		mapQueue = newQueue(mapConfigId, m.MaxPlayers)
		m.Queue[mapConfigId] = mapQueue
	}
	mapQueue.Add(client, characterConfigId)
	mapQueue.Update()
}

func (m *MatchmakingService) RemoveClient(client *Client) {
	m.mu.Lock()
	defer m.mu.Unlock()
	for _, q := range m.Queue {
		if q.Remove(client) {
			q.Update()
			break
		}
	}
}

func (m *MatchmakingService) HandleMessage(client *Client, msg pb.Msg) {
	switch msg := msg.(type) {
	case *pb.JoinMatchmakingMsg:
		charIndex := -1
		for i, char := range m.AvailableChars {
			if char == msg.CharacterConfigId {
				charIndex = i
				break
			}
		}
		if charIndex == -1 {
			log.Println("Character not available: ", msg.CharacterConfigId)
			return
		}
		mapIndex := -1
		for i, mapId := range m.AvailableMaps {
			if mapId == msg.MapConfigId {
				mapIndex = i
				break
			}
		}
		if mapIndex == -1 {
			log.Println("Map not available: ", msg.MapConfigId)
			return
		}
		m.AddClient(client, msg.CharacterConfigId, msg.MapConfigId)
	case *pb.CompleteMatchmakingMsg:
		m.mu.Lock()
		for _, q := range m.Queue {
			if q.HasClient(client) {
				q.StartMatch()
				m.mu.Unlock()
				return
			}
		}
		m.mu.Unlock()
	case *pb.LeaveMatchmakingMsg:
		m.RemoveClient(client)
	default:
		// ignore
	}
}

func (m *MatchmakingService) OnClientDisconnect(client *Client) {
	m.RemoveClient(client)
}

type clientInfo struct {
	client            *Client
	characterConfigId uint32
}

type queue struct {
	players     []*clientInfo
	mapConfigId uint32
	capacity    int
}

func newQueue(mapConfigId uint32, capacity int) *queue {
	return &queue{
		players:     make([]*clientInfo, 0),
		mapConfigId: mapConfigId,
		capacity:    capacity,
	}
}

func (q *queue) Add(client *Client, characterConfigId uint32) {
	q.players = append(q.players, &clientInfo{client: client, characterConfigId: characterConfigId})
}

func (q *queue) Remove(client *Client) bool {
	for i, c := range q.players {
		if c.client.Id() == client.Id() {
			q.players = append(q.players[:i], q.players[i+1:]...)
			return true
		}
	}
	return false
}

func (q *queue) HasClient(client *Client) bool {
	for _, c := range q.players {
		if c.client.Id() == client.Id() {
			return true
		}
	}
	return false
}

func (q *queue) StartMatch() {
	log.Println("Starting match: ", len(q.players))
	// already locked
	players := make([]*BattlePlayer, 0)
	for i := 0; i < len(q.players); i++ {
		players = append(players, &BattlePlayer{
			BattleInitDataMsg_Player: pb.BattleInitDataMsg_Player{
				Id:                q.players[i].client.Id(),
				Name:              q.players[i].client.Name(),
				CharacterConfigId: q.players[i].characterConfigId,
			},
		})
	}
	battleId := Context.BattleService.CreateBattle(q.mapConfigId, players)
	for _, client := range q.players {
		Context.BattleService.AttachClientToBattle(client.client, battleId)
	}
	q.players = make([]*clientInfo, 0)
}

func (q *queue) UpdateStatus() {
	for _, entry := range q.players {
		entry.client.Send(&pb.MatchmakingStatusMsg{
			PlayersInQueue:  uint32(len(q.players)),
			PlayersRequired: uint32(q.capacity),
		})
	}
}

func (q *queue) IsFull() bool {
	return len(q.players) >= q.capacity
}

func (q *queue) Update() {
	if q.IsFull() {
		q.StartMatch()
	} else {
		q.UpdateStatus()
	}
}
