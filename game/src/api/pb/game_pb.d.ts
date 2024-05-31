// package: kart
// file: game.proto

import * as jspb from "google-protobuf";
import * as common_pb from "./common_pb";

export class JoinMatchmakingMsg extends jspb.Message {
  getCharacterConfigId(): number;
  setCharacterConfigId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JoinMatchmakingMsg.AsObject;
  static toObject(includeInstance: boolean, msg: JoinMatchmakingMsg): JoinMatchmakingMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JoinMatchmakingMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JoinMatchmakingMsg;
  static deserializeBinaryFromReader(message: JoinMatchmakingMsg, reader: jspb.BinaryReader): JoinMatchmakingMsg;
}

export namespace JoinMatchmakingMsg {
  export type AsObject = {
    characterConfigId: number,
  }
}

export class MatchmakingStatusMsg extends jspb.Message {
  getPlayersInQueue(): number;
  setPlayersInQueue(value: number): void;

  getPlayersRequired(): number;
  setPlayersRequired(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MatchmakingStatusMsg.AsObject;
  static toObject(includeInstance: boolean, msg: MatchmakingStatusMsg): MatchmakingStatusMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MatchmakingStatusMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MatchmakingStatusMsg;
  static deserializeBinaryFromReader(message: MatchmakingStatusMsg, reader: jspb.BinaryReader): MatchmakingStatusMsg;
}

export namespace MatchmakingStatusMsg {
  export type AsObject = {
    playersInQueue: number,
    playersRequired: number,
  }
}

export class CompleteMatchmakingMsg extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CompleteMatchmakingMsg.AsObject;
  static toObject(includeInstance: boolean, msg: CompleteMatchmakingMsg): CompleteMatchmakingMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CompleteMatchmakingMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CompleteMatchmakingMsg;
  static deserializeBinaryFromReader(message: CompleteMatchmakingMsg, reader: jspb.BinaryReader): CompleteMatchmakingMsg;
}

export namespace CompleteMatchmakingMsg {
  export type AsObject = {
  }
}

export class BattleInitDataMsg extends jspb.Message {
  getSceneConfigId(): number;
  setSceneConfigId(value: number): void;

  clearPlayersList(): void;
  getPlayersList(): Array<BattleInitDataMsg.Player>;
  setPlayersList(value: Array<BattleInitDataMsg.Player>): void;
  addPlayers(value?: BattleInitDataMsg.Player, index?: number): BattleInitDataMsg.Player;

  getState(): BattleStateMap[keyof BattleStateMap];
  setState(value: BattleStateMap[keyof BattleStateMap]): void;

  getTimeSinceStart(): number;
  setTimeSinceStart(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BattleInitDataMsg.AsObject;
  static toObject(includeInstance: boolean, msg: BattleInitDataMsg): BattleInitDataMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BattleInitDataMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BattleInitDataMsg;
  static deserializeBinaryFromReader(message: BattleInitDataMsg, reader: jspb.BinaryReader): BattleInitDataMsg;
}

export namespace BattleInitDataMsg {
  export type AsObject = {
    sceneConfigId: number,
    playersList: Array<BattleInitDataMsg.Player.AsObject>,
    state: BattleStateMap[keyof BattleStateMap],
    timeSinceStart: number,
  }

  export class Player extends jspb.Message {
    getId(): string;
    setId(value: string): void;

    getName(): string;
    setName(value: string): void;

    getCharacterConfigId(): number;
    setCharacterConfigId(value: number): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Player.AsObject;
    static toObject(includeInstance: boolean, msg: Player): Player.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Player, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Player;
    static deserializeBinaryFromReader(message: Player, reader: jspb.BinaryReader): Player;
  }

  export namespace Player {
    export type AsObject = {
      id: string,
      name: string,
      characterConfigId: number,
    }
  }
}

export class Vector3 extends jspb.Message {
  getX(): number;
  setX(value: number): void;

  getY(): number;
  setY(value: number): void;

  getZ(): number;
  setZ(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Vector3.AsObject;
  static toObject(includeInstance: boolean, msg: Vector3): Vector3.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Vector3, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Vector3;
  static deserializeBinaryFromReader(message: Vector3, reader: jspb.BinaryReader): Vector3;
}

export namespace Vector3 {
  export type AsObject = {
    x: number,
    y: number,
    z: number,
  }
}

export class BattleEntity extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  hasPosition(): boolean;
  clearPosition(): void;
  getPosition(): Vector3 | undefined;
  setPosition(value?: Vector3): void;

  hasRotation(): boolean;
  clearRotation(): void;
  getRotation(): Vector3 | undefined;
  setRotation(value?: Vector3): void;

  hasVelocity(): boolean;
  clearVelocity(): void;
  getVelocity(): Vector3 | undefined;
  setVelocity(value?: Vector3): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BattleEntity.AsObject;
  static toObject(includeInstance: boolean, msg: BattleEntity): BattleEntity.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BattleEntity, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BattleEntity;
  static deserializeBinaryFromReader(message: BattleEntity, reader: jspb.BinaryReader): BattleEntity;
}

export namespace BattleEntity {
  export type AsObject = {
    id: number,
    position?: Vector3.AsObject,
    rotation?: Vector3.AsObject,
    velocity?: Vector3.AsObject,
  }
}

export class BattleClientEntityUpdateMsg extends jspb.Message {
  hasEntity(): boolean;
  clearEntity(): void;
  getEntity(): BattleEntity | undefined;
  setEntity(value?: BattleEntity): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BattleClientEntityUpdateMsg.AsObject;
  static toObject(includeInstance: boolean, msg: BattleClientEntityUpdateMsg): BattleClientEntityUpdateMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BattleClientEntityUpdateMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BattleClientEntityUpdateMsg;
  static deserializeBinaryFromReader(message: BattleClientEntityUpdateMsg, reader: jspb.BinaryReader): BattleClientEntityUpdateMsg;
}

export namespace BattleClientEntityUpdateMsg {
  export type AsObject = {
    entity?: BattleEntity.AsObject,
  }
}

export class BattleServerEntityUpdateMsg extends jspb.Message {
  clearEntitiesList(): void;
  getEntitiesList(): Array<BattleEntity>;
  setEntitiesList(value: Array<BattleEntity>): void;
  addEntities(value?: BattleEntity, index?: number): BattleEntity;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BattleServerEntityUpdateMsg.AsObject;
  static toObject(includeInstance: boolean, msg: BattleServerEntityUpdateMsg): BattleServerEntityUpdateMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BattleServerEntityUpdateMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BattleServerEntityUpdateMsg;
  static deserializeBinaryFromReader(message: BattleServerEntityUpdateMsg, reader: jspb.BinaryReader): BattleServerEntityUpdateMsg;
}

export namespace BattleServerEntityUpdateMsg {
  export type AsObject = {
    entitiesList: Array<BattleEntity.AsObject>,
  }
}

export class BattleClientCheckpointUpdateMsg extends jspb.Message {
  getCheckpointIndex(): number;
  setCheckpointIndex(value: number): void;

  getTurn(): number;
  setTurn(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BattleClientCheckpointUpdateMsg.AsObject;
  static toObject(includeInstance: boolean, msg: BattleClientCheckpointUpdateMsg): BattleClientCheckpointUpdateMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BattleClientCheckpointUpdateMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BattleClientCheckpointUpdateMsg;
  static deserializeBinaryFromReader(message: BattleClientCheckpointUpdateMsg, reader: jspb.BinaryReader): BattleClientCheckpointUpdateMsg;
}

export namespace BattleClientCheckpointUpdateMsg {
  export type AsObject = {
    checkpointIndex: number,
    turn: number,
  }
}

export class BattleServerCheckpointUpdateMsg extends jspb.Message {
  getPlayerId(): string;
  setPlayerId(value: string): void;

  getCheckpointIndex(): number;
  setCheckpointIndex(value: number): void;

  getTurn(): number;
  setTurn(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BattleServerCheckpointUpdateMsg.AsObject;
  static toObject(includeInstance: boolean, msg: BattleServerCheckpointUpdateMsg): BattleServerCheckpointUpdateMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BattleServerCheckpointUpdateMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BattleServerCheckpointUpdateMsg;
  static deserializeBinaryFromReader(message: BattleServerCheckpointUpdateMsg, reader: jspb.BinaryReader): BattleServerCheckpointUpdateMsg;
}

export namespace BattleServerCheckpointUpdateMsg {
  export type AsObject = {
    playerId: string,
    checkpointIndex: number,
    turn: number,
  }
}

export class BattleClientPlayerFinishMsg extends jspb.Message {
  getTotalTime(): number;
  setTotalTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BattleClientPlayerFinishMsg.AsObject;
  static toObject(includeInstance: boolean, msg: BattleClientPlayerFinishMsg): BattleClientPlayerFinishMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BattleClientPlayerFinishMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BattleClientPlayerFinishMsg;
  static deserializeBinaryFromReader(message: BattleClientPlayerFinishMsg, reader: jspb.BinaryReader): BattleClientPlayerFinishMsg;
}

export namespace BattleClientPlayerFinishMsg {
  export type AsObject = {
    totalTime: number,
  }
}

export class BattleServerPlayerFinishMsg extends jspb.Message {
  getPlayerId(): string;
  setPlayerId(value: string): void;

  getTotalTime(): number;
  setTotalTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BattleServerPlayerFinishMsg.AsObject;
  static toObject(includeInstance: boolean, msg: BattleServerPlayerFinishMsg): BattleServerPlayerFinishMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BattleServerPlayerFinishMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BattleServerPlayerFinishMsg;
  static deserializeBinaryFromReader(message: BattleServerPlayerFinishMsg, reader: jspb.BinaryReader): BattleServerPlayerFinishMsg;
}

export namespace BattleServerPlayerFinishMsg {
  export type AsObject = {
    playerId: string,
    totalTime: number,
  }
}

export class BattleFinishMsg extends jspb.Message {
  clearPlayersList(): void;
  getPlayersList(): Array<BattleFinishMsg.Player>;
  setPlayersList(value: Array<BattleFinishMsg.Player>): void;
  addPlayers(value?: BattleFinishMsg.Player, index?: number): BattleFinishMsg.Player;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BattleFinishMsg.AsObject;
  static toObject(includeInstance: boolean, msg: BattleFinishMsg): BattleFinishMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BattleFinishMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BattleFinishMsg;
  static deserializeBinaryFromReader(message: BattleFinishMsg, reader: jspb.BinaryReader): BattleFinishMsg;
}

export namespace BattleFinishMsg {
  export type AsObject = {
    playersList: Array<BattleFinishMsg.Player.AsObject>,
  }

  export class Player extends jspb.Message {
    getId(): string;
    setId(value: string): void;

    getName(): string;
    setName(value: string): void;

    getTotalTime(): number;
    setTotalTime(value: number): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Player.AsObject;
    static toObject(includeInstance: boolean, msg: Player): Player.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Player, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Player;
    static deserializeBinaryFromReader(message: Player, reader: jspb.BinaryReader): Player;
  }

  export namespace Player {
    export type AsObject = {
      id: string,
      name: string,
      totalTime: number,
    }
  }
}

export class BattleHeartbeatMsg extends jspb.Message {
  getTimeSinceStart(): number;
  setTimeSinceStart(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BattleHeartbeatMsg.AsObject;
  static toObject(includeInstance: boolean, msg: BattleHeartbeatMsg): BattleHeartbeatMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BattleHeartbeatMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BattleHeartbeatMsg;
  static deserializeBinaryFromReader(message: BattleHeartbeatMsg, reader: jspb.BinaryReader): BattleHeartbeatMsg;
}

export namespace BattleHeartbeatMsg {
  export type AsObject = {
    timeSinceStart: number,
  }
}

export class BattleClientReadyMsg extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BattleClientReadyMsg.AsObject;
  static toObject(includeInstance: boolean, msg: BattleClientReadyMsg): BattleClientReadyMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BattleClientReadyMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BattleClientReadyMsg;
  static deserializeBinaryFromReader(message: BattleClientReadyMsg, reader: jspb.BinaryReader): BattleClientReadyMsg;
}

export namespace BattleClientReadyMsg {
  export type AsObject = {
  }
}

export class BattleStateUpdateMsg extends jspb.Message {
  getState(): BattleStateMap[keyof BattleStateMap];
  setState(value: BattleStateMap[keyof BattleStateMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BattleStateUpdateMsg.AsObject;
  static toObject(includeInstance: boolean, msg: BattleStateUpdateMsg): BattleStateUpdateMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BattleStateUpdateMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BattleStateUpdateMsg;
  static deserializeBinaryFromReader(message: BattleStateUpdateMsg, reader: jspb.BinaryReader): BattleStateUpdateMsg;
}

export namespace BattleStateUpdateMsg {
  export type AsObject = {
    state: BattleStateMap[keyof BattleStateMap],
  }
}

export class LeaveMatchmakingMsg extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LeaveMatchmakingMsg.AsObject;
  static toObject(includeInstance: boolean, msg: LeaveMatchmakingMsg): LeaveMatchmakingMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LeaveMatchmakingMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LeaveMatchmakingMsg;
  static deserializeBinaryFromReader(message: LeaveMatchmakingMsg, reader: jspb.BinaryReader): LeaveMatchmakingMsg;
}

export namespace LeaveMatchmakingMsg {
  export type AsObject = {
  }
}

export interface BattleStateMap {
  WAITING_FOR_PLAYERS: 0;
  COUNTDOWN: 1;
  RACING: 2;
  FINISHED: 3;
}

export const BattleState: BattleStateMap;

