package pb

import "google.golang.org/protobuf/proto"

type Msg interface {
	proto.Message
	Id() byte
	New() Msg
}
