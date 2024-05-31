package kartserver

import (
	"log"
	"math/rand"
	"server/pb"
	"sync"
)

type MatchmakingService struct {
	Queue          []*clientInfo
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
	}
}

func (m *MatchmakingService) AddClient(client *Client, characterConfigId uint32) {
	m.RemoveClient(client)
	m.mu.Lock()
	m.Queue = append(m.Queue, &clientInfo{client: client, characterConfigId: characterConfigId})
	m.updateQueue()
	m.mu.Unlock()
}

func (m *MatchmakingService) RemoveClient(client *Client) {
	hasRemoved := false
	m.mu.Lock()
	for i, c := range m.Queue {
		if c.client.Id() == client.Id() {
			m.Queue = append(m.Queue[:i], m.Queue[i+1:]...)
			hasRemoved = true
			break
		}
	}
	if hasRemoved {
		m.updateQueue()
	}
	m.mu.Unlock()
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
		m.AddClient(client, msg.CharacterConfigId)
	case *pb.CompleteMatchmakingMsg:
		m.mu.Lock()
		if len(m.Queue) > 0 {
			m.startMatch()
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

func (m *MatchmakingService) updateQueue() {
	log.Printf("Queue updated: %d", len(m.Queue))

	if len(m.Queue) < m.MaxPlayers {
		for _, entry := range m.Queue {
			entry.client.Send(&pb.MatchmakingStatusMsg{
				PlayersInQueue:  uint32(len(m.Queue)),
				PlayersRequired: uint32(m.MaxPlayers),
			})
		}
	} else {
		m.startMatch()
	}
}

func (m *MatchmakingService) startMatch() {
	log.Println("Starting match: ", len(m.Queue))
	// already locked
	players := make([]*BattlePlayer, 0)
	for i := 0; i < len(m.Queue); i++ {
		players = append(players, &BattlePlayer{
			BattleInitDataMsg_Player: pb.BattleInitDataMsg_Player{
				Id:                m.Queue[i].client.Id(),
				Name:              m.Queue[i].client.Name(),
				CharacterConfigId: m.Queue[i].characterConfigId,
			},
		})
	}
	battleId := Context.BattleService.CreateBattle(m.AvailableMaps[rand.Int31n(int32(len(m.AvailableMaps)))], players)
	for _, client := range m.Queue {
		Context.BattleService.AttachClientToBattle(client.client, battleId)
	}
	m.Queue = m.Queue[:0]
}

type clientInfo struct {
	client            *Client
	characterConfigId uint32
}
