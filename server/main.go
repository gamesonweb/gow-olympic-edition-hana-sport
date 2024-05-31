package main

import (
	"flag"
	"github.com/gorilla/websocket"
	"github.com/spf13/viper"
	"log"
	"net/http"
	kartserver "server/src"
	"strings"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}
var configFile = flag.String("f", "config.yaml", "the config file")

func main() {
	flag.Parse()

	var c kartserver.Config
	viper.SetConfigFile(*configFile)
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.AutomaticEnv()
	viper.SetEnvPrefix("CONFIG")

	if err := viper.ReadInConfig(); err != nil {
		log.Fatalln("failed to read config file")
		return
	}
	if err := viper.Unmarshal(&c); err != nil {
		log.Fatalln("failed to unmarshal config")
		return
	}

	kartserver.Context = kartserver.NewServiceContext(&c)

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}
		idString := r.URL.Query().Get("id")
		nameString := r.URL.Query().Get("name")
		if idString == "" || nameString == "" {
			conn.Close()
			return
		}
		log.Println("New connection: ", idString, nameString)

		client := kartserver.NewClient(conn)
		client.SetSessionData(idString, nameString)
		client.AddHandler(kartserver.Context.MatchmakingService.HandleMessage)
		client.AddHandler(kartserver.Context.BattleService.HandleMessage)
		client.AddDisconnectHandler(kartserver.Context.MatchmakingService.OnClientDisconnect)
		client.AddDisconnectHandler(kartserver.Context.BattleService.OnClientDisconnect)

		client.Run()
	})
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
