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

func (l *LeaderboardService) AddScore(mapConfigId uint32, entry []LeaderboardEntry) error {
	// add score
	req := l.redis.B().Zadd().Key("leaderboard-" + strconv.FormatInt(int64(mapConfigId), 10)).Lt().ScoreMember()
	for _, e := range entry {
		req = req.ScoreMember(e.Score, e.Id)
	}
	err := l.redis.Do(context.Background(), req.Build()).Error()
	if err != nil {
		return errors.Wrap(err, "failed to add score")
	}
	// update user id->name mapping
	req2 := l.redis.B().Hset().Key("leaderboard_names").FieldValue()
	for _, e := range entry {
		req2 = req2.FieldValue(e.Id, e.Name)
	}
	err = l.redis.Do(context.Background(), req2.Build()).Error()
	if err != nil {
		return errors.Wrap(err, "failed to update name mapping")
	}
	return err
}

func (l *LeaderboardService) GetTopScores(mapConfigId uint32) ([]LeaderboardEntry, error) {
	entries, err := l.redis.Do(context.Background(), l.redis.B().Zrange().Key("leaderboard-"+strconv.FormatInt(int64(mapConfigId), 10)).Min("(0").Max("+inf").Byscore().Limit(0, int64(l.size)).Withscores().Build()).AsZScores()
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
	Id    string  `json:"id"`
	Name  string  `json:"name"`
	Score float64 `json:"score"`
}
