package kartserver

import (
	"math/rand"
	"server/pb"
	"sync"
)

type MatchmakingService struct {
	Queue         []*Client
	MaxPlayers    int
	AvailableMaps []uint32
	mu            sync.Mutex
}

func NewMatchmakingService(maxPlayers int, mapConfigs []uint32) *MatchmakingService {
	return &MatchmakingService{
		MaxPlayers:    maxPlayers,
		AvailableMaps: mapConfigs,
	}
}

func (m *MatchmakingService) AddClient(client *Client) {
	m.mu.Lock()
	m.Queue = append(m.Queue, client)
	m.mu.Unlock()
	m.updateQueue()
}

func (m *MatchmakingService) RemoveClient(client *Client) {
	hasRemoved := false
	m.mu.Lock()
	for i, c := range m.Queue {
		if c == client {
			m.Queue = append(m.Queue[:i], m.Queue[i+1:]...)
			hasRemoved = true
			break
		}
	}
	m.mu.Unlock()
	if hasRemoved {
		m.updateQueue()
	}
}

func (m *MatchmakingService) HandleMessage(client *Client, msg pb.Msg) {
	switch msg.(type) {
	case *pb.JoinMatchmakingMsg:
		m.AddClient(client)
	}
}

func (m *MatchmakingService) OnClientDisconnect(client *Client) {
	m.RemoveClient(client)
}

func (m *MatchmakingService) updateQueue() {
	m.mu.Lock()
	defer m.mu.Unlock()

	if len(m.Queue) < m.MaxPlayers {
		for _, client := range m.Queue {
			client.Send(&pb.MatchmakingStatusMsg{
				PlayersInQueue:  uint32(len(m.Queue)),
				PlayersRequired: uint32(m.MaxPlayers),
			})
		}
	} else {
		m.startMatch()
	}
}

func (m *MatchmakingService) startMatch() {
	// already locked
	players := make([]*BattlePlayer, 0)
	for i := 0; i < m.MaxPlayers; i++ {
		players = append(players, &BattlePlayer{
			BattleInitDataMsg_Player: pb.BattleInitDataMsg_Player{
				Id:   m.Queue[i].Id(),
				Name: m.Queue[i].Name(),
			},
		})
	}
	battleId := Context.BattleService.CreateBattle(m.AvailableMaps[rand.Int31n(int32(len(m.AvailableMaps)))], players)
	for _, client := range m.Queue {
		Context.BattleService.AttachClientToBattle(client, battleId)
	}
}
