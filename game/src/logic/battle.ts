import Level from "./level/level";
import BattlePlayer from "./battlePlayer";
import Character from "./gameobject/character";
import ConfigTable from "./config/table";
import MovementComponent from "./gameobject/component/movement";
import {Checkpoint} from "./gameobject/checkpoint";
import {Vector3} from "@babylonjs/core";

export class Battle {
    private readonly _level: Level;
    private readonly _players: BattlePlayer[] = [];
    private readonly _playerCharacter: Character[] = [];
    private readonly _playerCurrentTurn: number[] = [];
    private readonly _playerCurrentTurnCheckpointIndex: number[] = [];

    constructor(level: Level) {
        this._level = level;
    }

    public setPlayers(players: BattlePlayer[]): void {
        this._players.length = 0;
        this._players.push(...players);
        this._playerCurrentTurn.length = players.length;
        this._playerCurrentTurn.fill(0);
        this._playerCurrentTurnCheckpointIndex.length = players.length;
        this._playerCurrentTurnCheckpointIndex.fill(0);

        const gameObjectManager = this._level.gameObjectManager;
        const spawnPointIds = this._level.metadata.spawnPoints;
        for (let i = 0; i < this._players.length; i++) {
            const spawnPoint = gameObjectManager.getObject(spawnPointIds[i]);
            if (!spawnPoint) {
                console.error("Spawn point ID " + spawnPointIds[i] + " not found");
                continue;
            }
            const player = this._players[i];
            const character = new Character(ConfigTable.getCharacter(player.characterConfig), this._level, i);
            character.position = spawnPoint.position.clone();
            character.rotation = spawnPoint.rotation.clone();
            gameObjectManager.addObject(character);
            character.getComponent(MovementComponent).resyncPhysics();
            this._playerCharacter.push(character);
            console.log("Player " + player.name + " spawned at " + character.position + " with rotation " + character.rotation + " (spawn point " + spawnPoint.id + ")");
        }
    }

    public get players(): BattlePlayer[] {
        return this._players;
    }

    public getPlayerCharacterById(playerId: string): Character {
        return this._playerCharacter.find((character) => character.player.id == playerId);
    }

    public onCheckpointReached(playerIndex: number, checkpointId: number): void {
        const currentCheckpointIndex = this._playerCurrentTurnCheckpointIndex[playerIndex];
        if (checkpointId === this._level.metadata.checkpoints[currentCheckpointIndex]) {
            return;
        }
        let validatedCheckpointIndex = -1;
        for (let i = 0; i < this._playerCurrentTurnCheckpointIndex.length; i++) {
            const nextCheckpointIndex = (currentCheckpointIndex + 1) % this._level.metadata.checkpoints.length;
            const nextCheckpointId = this._level.metadata.checkpoints[nextCheckpointIndex];
            const checkpointObject = this._level.gameObjectManager.getObject(nextCheckpointId) as Checkpoint;
            if (!checkpointObject) {
                console.error("Checkpoint ID " + nextCheckpointId + " not found");
                return;
            }
            if (checkpointId !== nextCheckpointId && !checkpointObject.canBeSkipped) {
                break;
            }
            if (checkpointId === nextCheckpointId) {
                validatedCheckpointIndex = nextCheckpointIndex;
                break;
            }
        }
        if (validatedCheckpointIndex === -1) {
            console.error("Player " + playerIndex + " missed a checkpoint");
            return;
        }
        if (validatedCheckpointIndex < currentCheckpointIndex) {
            this._playerCurrentTurn[playerIndex]++;
        }
        this._playerCurrentTurnCheckpointIndex[playerIndex] = validatedCheckpointIndex;
        console.log("Player " + playerIndex + " reached checkpoint " + checkpointId + " (validated index " + validatedCheckpointIndex + ")");
    }

    public update(t: number): void {
        let i = 0;
        for (const character of this._playerCharacter) {
            const currentCheckpoint = this._level.gameObjectManager.getObject(this._level.metadata.checkpoints[this._playerCurrentTurnCheckpointIndex[i]]) as Checkpoint;
            const nextCheckpoint = this._level.gameObjectManager.getObject(this._level.metadata.checkpoints[(this._playerCurrentTurnCheckpointIndex[i] + 1) % this._level.metadata.checkpoints.length]) as Checkpoint;
            const checkpointRay = [
                currentCheckpoint.position,
                nextCheckpoint.position
            ];
            // get distance of the character from the line formed by the two checkpoints
            const characterPosition = character.position;
            const characterDistanceToCheckpoint = this._distanceFromLine(characterPosition, checkpointRay[0], checkpointRay[1]);
            if (characterDistanceToCheckpoint.length() > 5) {
                character.position = currentCheckpoint.position;
                character.rotation = currentCheckpoint.rotation;
                character.getComponent(MovementComponent).resyncPhysics();
            }
            i++;
        }
    }

    private _distanceFromLine(point: Vector3, lineStart: Vector3, lineEnd: Vector3): Vector3 {
        const line = lineEnd.subtract(lineStart);
        const lineLength = line.length();
        const lineDirection = line.normalize();
        const pointToLineStart = point.subtract(lineStart);
        const pointToLineEnd = point.subtract(lineEnd);
        const dotStart = Vector3.Dot(pointToLineStart, lineDirection);
        const dotEnd = Vector3.Dot(pointToLineEnd, lineDirection);
        if (dotStart < 0) {
            return pointToLineStart;
        }
        if (dotEnd > 0) {
            return pointToLineEnd;
        }
        const pointToLine = pointToLineStart.subtract(lineDirection.scale(dotStart));
        return pointToLineStart.subtract(lineDirection.scale(dotStart));
    }
}

