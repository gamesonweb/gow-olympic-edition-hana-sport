#!/bin/zsh
cd pb-def
protoc --go_out=paths=source_relative:../pb *.proto
python3 ../proto-gen-msg-factory.py --proto . --out ../pb/factory.go