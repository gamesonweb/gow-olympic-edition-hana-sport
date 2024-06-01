package kartserver

import (
	"context"
	"github.com/pkg/errors"
	"github.com/redis/rueidis"
	"strconv"
)

type LeaderboardService struct {
	redis rueidis.Client
	size  int
}

func NewLeaderboardService(redisEndpoint string, size int) *LeaderboardService {
	client, err := rueidis.NewClient(rueidis.ClientOption{InitAddress: []string{redisEndpoint}})
	if err != nil {
		panic(err)
	}
	return &LeaderboardService{
		redis: client,
		size:  size,
	}
}

func (l *LeaderboardService) AddScore(mapConfigId uint32, entry LeaderboardEntry) error {
	err := l.redis.Do(context.Background(), l.redis.B().Zadd().Key("leaderboard-"+strconv.FormatInt(int64(mapConfigId), 10)).Gt().ScoreMember().ScoreMember(float64(entry.Score), entry.Id).Build()).Error()
	if err != nil {
		return errors.Wrap(err, "failed to add score")
	}
	// update user id->name mapping
	err = l.redis.Do(context.Background(), l.redis.B().Hset().Key("leaderboard_names").FieldValue().FieldValue(entry.Id, entry.Name).Build()).Error()
	if err != nil {
		return errors.Wrap(err, "failed to update name mapping")
	}
	return err
}

func (l *LeaderboardService) GetTopScores(mapConfigId uint32) ([]LeaderboardEntry, error) {
	entries, err := l.redis.Do(context.Background(), l.redis.B().Zrevrange().Key("leaderboard-"+strconv.FormatInt(int64(mapConfigId), 10)).Start(0).Stop(0).Withscores().Build()).AsZScores()
	if err != nil {
		return nil, errors.Wrap(err, "failed to get top scores")
	}
	userIds := make([]string, 0, len(entries))
	result := make([]LeaderboardEntry, 0, len(entries))
	for _, entry := range entries {
		result = append(result, LeaderboardEntry{
			Id:    entry.Member,
			Score: entry.Score,
		})
		userIds = append(userIds, entry.Member)
	}
	if len(userIds) != 0 {
		// retrieve user names
		names, err := l.redis.Do(context.Background(), l.redis.B().Hmget().Key("leaderboard_names").Field(userIds...).Build()).AsStrSlice()
		if err != nil {
			return nil, errors.Wrap(err, "failed to get user names")
		}
		for i, name := range names {
			result[i].Name = name
		}
	}
	return result, nil
}

type LeaderboardEntry struct {
	Id    string
	Name  string
	Score float64
}
