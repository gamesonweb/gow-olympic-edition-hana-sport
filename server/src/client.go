package kartserver

import (
	"github.com/gorilla/websocket"
	"google.golang.org/protobuf/proto"
	"log"
	"server/pb"
	"sync"
	"time"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 30 * time.Second
	pingPeriod     = pongWait / 3
	maxMessageSize = 2048
)

type Client struct {
	session           *ClientSession
	conn              *websocket.Conn
	send              chan pb.Msg
	mu                sync.Mutex
	disconnected      bool
	recvHandler       []func(c *Client, msg pb.Msg)
	disconnectHandler []func(c *Client)
}

func NewClient(conn *websocket.Conn) *Client {
	return &Client{
		session: &ClientSession{},
		conn:    conn,
		send:    make(chan pb.Msg, 256),
	}
}

func (c *Client) Id() string {
	return c.session.Id
}

func (c *Client) Name() string {
	return c.session.Name
}

func (c *Client) Send(message pb.Msg) {
	c.send <- message
}

func (c *Client) Close() {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.disconnected {
		return
	}
	for _, handler := range c.disconnectHandler {
		handler(c)
	}
	c.disconnected = true
	c.conn.Close()
	c.conn = nil
}

func (c *Client) readPump() {
	defer func() {
		c.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, messageBytes, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		if len(messageBytes) < 1 {
			log.Printf("error: %v", "message too short")
			break
		}
		msgId := messageBytes[0]
		msgData := messageBytes[1:]
		msg := pb.Create(msgId)
		if msg == nil {
			log.Printf("error: %v", "unknown message")
			break
		}
		if err = proto.Unmarshal(msgData, msg); err != nil {
			log.Printf("error: %v", err)
			break
		}
		for _, handler := range c.recvHandler {
			handler(c, msg)
		}
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.BinaryMessage)
			if err != nil {
				return
			}

			messageBytes, _ := proto.Marshal(message)
			messageBytes = append([]byte{message.Id()}, messageBytes...)
			if _, err = w.Write(messageBytes); err != nil {
				log.Printf("error: %v", err)
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func (c *Client) SetSessionData(id string, name string) {
	c.session.Id = id
	c.session.Name = name
}

func (c *Client) Run() {
	go c.writePump()
	go c.readPump()
}

func (c *Client) AddHandler(handler func(c *Client, msg pb.Msg)) {
	c.recvHandler = append(c.recvHandler, handler)
}

func (c *Client) AddDisconnectHandler(handler func(c *Client)) {
	c.disconnectHandler = append(c.disconnectHandler, handler)
}
