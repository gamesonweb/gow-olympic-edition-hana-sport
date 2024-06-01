package kartserver

import "time"

type Config struct {
	Characters  []uint32 `mapstructure:"characters"`
	Maps        []uint32 `mapstructure:"maps"`
	Matchmaking struct {
		MaxPlayers int `mapstructure:"maxPlayers"`
	} `mapstructure:"matchmaking"`
	Battle struct {
		TickInterval time.Duration `mapstructure:"tickInterval"`
	} `mapstructure:"battle"`
	Leaderboard struct {
		RedisEndpoint string `mapstructure:"redisEndpoint"`
		Size          int    `mapstructure:"size"`
	} `mapstructure:"leaderboard"`
}
