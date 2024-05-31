package kartserver

var Context ServiceContext

type ServiceContext struct {
	MatchmakingService *MatchmakingService
	BattleService      *BattleService
}

func NewServiceContext(conf *Config) ServiceContext {
	return ServiceContext{
		MatchmakingService: NewMatchmakingService(conf.Matchmaking.MaxPlayers, conf.Maps, conf.Characters),
		BattleService:      NewBattleService(conf.Battle.TickInterval),
	}
}
