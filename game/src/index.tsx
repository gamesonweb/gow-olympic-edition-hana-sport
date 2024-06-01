import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainMenu from "./ui/pages/MainMenu";
import EnterUsername from "./ui/pages/EnterUsername";
import Vehicle from "./ui/pages/Vehicle";
import Keyboard from "./ui/pages/Keyboard";
import Matchmaking from "./ui/pages/Matchmaking";
import Controller from "./ui/pages/Controller";
import Game from "./ui/pages/Game";
import Ranking from "./ui/pages/Ranking";
import HowTo from "./ui/pages/HowTo";
import Credits from "./ui/pages/Credits";
import Company from "./ui/pages/Company";
import "@babylonjs/loaders/glTF";
import "@babylonjs/inspector";

import {Engine} from "@babylonjs/core/Engines/engine";
import WorldScene from "./scenes/world";
import {Vector3, WebGPUEngine} from '@babylonjs/core';
import ConfigTable from "./logic/config/table";
import {PageType} from "./PageType";
import Map from "./ui/pages/Map";
import ConnectToServer from "./ui/pages/ConnectToServer";
import Waiting from "./ui/pages/Waiting";
import ApiClient from "./api/client";
import {
    BattleClientEntityUpdateMsg,
    BattleClientPlayerFinishMsg,
    BattleClientReadyMsg, BattleEntity, BattleFinishMsg, BattleHeartbeatMsg,
    BattleInitDataMsg, BattleServerCheckpointUpdateMsg,
    BattleServerEntityUpdateMsg, BattleServerPlayerFinishMsg, BattleState, BattleStateUpdateMsg,
    CompleteMatchmakingMsg,
    LeaveMatchmakingMsg,
    MatchmakingStatusMsg,
    Vector3 as PbVector3
} from "./api/pb/game_pb";
import MovementComponent from "./logic/gameobject/component/movement";
import {GameObjectType} from "./logic/gameobject/gameObject";
import Character from "./logic/gameobject/character";

const ChangePage = (pageType: PageType) => {
    switch (pageType) {
        case PageType.MainMenu:
            return <MainMenu/>
        case PageType.EnterUsername:
            return <EnterUsername/>
        case PageType.Vehicle:
            return <Vehicle/>
        case PageType.Keyboard:
            return <Keyboard/>
        case PageType.Matchmaking:
            return <MatchmakingProvider/>
        case PageType.Controller:
            return <Controller/>
        case PageType.Game:
            return <GameProvider/>
        case PageType.Ranking:
            return <Ranking/>
        case PageType.HowTo:
            return <HowTo/>
        case PageType.Credits:
            return <Credits/>
        case PageType.Company:
            return <Company/>
        case PageType.Map:
            return <Map/>
        case PageType.ConnectToServer:
            return <ConnectToServer/>
        case PageType.Waiting:
            return <Waiting/>
        default:
            return <MainMenu/>
    }
}

export enum State {
    Lobby,
    Matchmaking,
    Game
}

export const PageContext = createContext({
    page: PageType,
    setPage: (name: PageType) => {
    },
    data: {
        vehicles: [{
            id: 0,
            name: 'name',
            image: 'image',
            speed: 0,
            acceleration: 0,
            brake: 0,
        }],
        selection: {
            vehicle: 0,
            username: '',
            keyboard: '',
            map: 0,
        }, game: {
            position: 0,
            currentLap: 0,
            totalLaps: 0,
            finished: true,
            countdown: 0,
            time: '0:00.000'
        },
        maps: [{
            name: 'name',
            image: 'image',
            description: 'description',
        }],
        id: ""
    },
    setData: (data: any) => {
    },
    state: State.Lobby,
    setState: (state: State) => {
    }
})

const gameData = {
    vehicles: [
        {
            id: 1,
            name: 'Boggy',
            image: './assets/vehicles/Vehicle0.png',
            speed: 5,
            acceleration: 2.5,
            brake: 2,
        }
    ],
    game: {
        position: 1,
        currentLap: 1,
        totalLaps: 3,
        finished: false,
        countdown: 3,
        time: '0:00.000'
    },
    selection: {
        vehicle: 0,
        username: "",
        keyboard: "",
        map: 0,
    },
    maps: [
        {
            name: 'Messy room',
            image: './assets/maps/Map0.png',
            description: 'In the "Messy Room" map, players explore a cluttered teenager\'s bedroom, navigating clothes on the floor, piles of books, and faded posters on the walls to uncover hidden treasures and avoid traps.',
        }
    ],
    id: ""
}

const loadSelection = () => {
    const selection = localStorage.getItem('selection')
    if (selection) {
        return JSON.parse(selection)
    } else {
        return gameData.selection
    }
}

export const MatchmakingContext = createContext({
    onCancel: () => {
    },
    onStart: () => {
    },
    currentPlayers: 0,
    maxPlayers: 0
})

export const MatchmakingProvider = () => {
    const onStart = useCallback(() => {
        ApiClient.instance.send(new CompleteMatchmakingMsg())
    }, [])

    const onCancel = useCallback(() => {
        ApiClient.instance.send(new LeaveMatchmakingMsg())
    }, [])

    const [currentPlayers, setCurrentPlayers] = useState(0)
    const [maxPlayers, setMaxPlayers] = useState(5)

    ApiClient.instance.addHandler(2, (message: MatchmakingStatusMsg) => {
        setCurrentPlayers(message.getPlayersInQueue())
        setMaxPlayers(message.getPlayersRequired())
    })

    return (
        <MatchmakingContext.Provider value={{onCancel, onStart, currentPlayers, maxPlayers}}>
            <Matchmaking/>
        </MatchmakingContext.Provider>
    )
}

export const PageProvider = () => {
    gameData.selection = loadSelection()
    gameData.id = localStorage.getItem('id') || gameData.id
    let pageName: any;
    if (gameData.selection.username !== "" && gameData.selection.keyboard !== "" && gameData.id !== "") {
        pageName = PageType.ConnectToServer
    } else {
        pageName = PageType.EnterUsername
    }
    const [data, setData] = useState(gameData)
    const [page, setPage] = useState(pageName)
    const [state, setState] = useState(State.Lobby)

    useEffect(() => {
        if (data.selection.username === "") {
            return;
        }
        if (data.selection.keyboard === "") {
            return;
        }
        if (data.id === "") {
            return;
        }
        localStorage.setItem('selection', JSON.stringify(data.selection))
        localStorage.setItem('id', data.id)
    }, [data.selection.username, data.selection.keyboard, data.id])


    ApiClient.instance.onConnectionError = () => {
        setPage(PageType.ConnectToServer)
    };

    return (
        <PageContext.Provider value={{page, setPage, data, setData, state, setState}}>
            <RankingProvider>
                <BabylonScene/>
                <React.StrictMode>
                    <div id="game">
                        {ChangePage(page)}
                    </div>
                </React.StrictMode>
            </RankingProvider>
        </PageContext.Provider>
    )
}

export const RankingContext = createContext({
    rankings: [],
    setRankings: (rankings: any) => {
    }
})
const timeToString = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    const millis = Math.floor((time - Math.floor(time)) * 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`
}

export const RankingProvider = ({children}: any) => {
    const [rankings, setRankings] = useState([{
        rank: 0,
        id: 'id',
        name: 'name',
        time: '0:00.000',
        timeRaw: 0
    }])

    return (
        <RankingContext.Provider value={{rankings, setRankings}}>
            {children}
        </RankingContext.Provider>
    )
}

export const GameContext = createContext({
    onRespawn: () => {
    }
})

export const GameProvider = () => {
    const onRespawn = useCallback(() => {
        console.log('Respawn')
    }, []);

    return (
        <GameContext.Provider value={{onRespawn}}>
            <Game/>
        </GameContext.Provider>
    )
}

const BabylonScene = () => {
        const {data, setData, page, setPage} = useContext(PageContext);
        const {rankings, setRankings} = useContext(RankingContext);
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const engineRef = useRef<any>(null);

        useEffect(() => {
                const initBabylon = async () => {
                    try {
                        if (!canvasRef.current) return;

                        const view = canvasRef.current;

                        let engine: Engine | WebGPUEngine;

                        const webGPUSupported = await WebGPUEngine.IsSupportedAsync;
                        if (webGPUSupported) {
                            engine = new WebGPUEngine(view);
                            await engine.initAsync();
                        } else {
                            engine = new Engine(view, true);
                        }

                        engineRef.current = engine;

                        let currentScene: WorldScene | null = null;
                        let currentTime = 0;
                        let currentBattleState = 0;
                        let finishTime = null;

                        const setBattleState = (state: number) => {
                            currentBattleState = state;
                            switch (state) {
                                case BattleState.WAITING_FOR_PLAYERS:
                                    setPage(PageType.Waiting);
                                    break;
                                case BattleState.COUNTDOWN:
                                    setPage(PageType.Game);
                                    data.game.countdown = Math.max(Math.ceil(3 - currentTime), 1);
                                    data.game.finished = false;
                                    setData({
                                        ...data,
                                    })
                                    break;
                                case BattleState.RACING:
                                    setPage(finishTime ? PageType.Ranking : PageType.Game);
                                    data.game.countdown = 0;
                                    data.game.time = timeToString(finishTime || currentTime);
                                    setData({
                                        ...data,
                                    })
                                    break;
                                case BattleState.FINISHED:
                                    setPage(PageType.Game);
                                    data.game.countdown = 0;
                                    data.game.finished = true;
                                    data.game.time = timeToString(finishTime || currentTime);
                                    setData({
                                        ...data,
                                    })
                                    break;
                                default:
                                    setPage(PageType.Game);
                                    data.game.countdown = 0;
                                    data.game.finished = false;
                                    data.game.time = timeToString(finishTime || currentTime);
                                    setData({
                                        ...data,
                                    })
                                    break;
                            }
                        }

                        ApiClient.instance.addHandler(6, (message: BattleServerEntityUpdateMsg) => {
                            if (currentScene) {
                                const level = currentScene.level;
                                for (const entity of message.getEntitiesList()) {
                                    const gameObject = level.gameObjectManager.getObject(entity.getId());
                                    if (!gameObject) {
                                        console.error('Entity not found', entity.getId());
                                        continue;
                                    }
                                    if (gameObject.type !== GameObjectType.Character) {
                                        console.error('Invalid entity type', gameObject.type);
                                        continue;
                                    }
                                    const character = gameObject as Character;
                                    if (character.player.id === data.id) {
                                        continue;
                                    }

                                    const movementComponent = gameObject.findComponent(MovementComponent);
                                    if (!movementComponent) {
                                        console.error('Movement component not found');
                                        continue;
                                    }
                                    const pbPosition = entity.getPosition();
                                    const pbRotation = entity.getRotation();
                                    const pbVelocity = entity.getVelocity();
                                    const position = new Vector3(pbPosition.getX(), pbPosition.getY(), pbPosition.getZ());
                                    const rotation = new Vector3(pbRotation.getX(), pbRotation.getY(), pbRotation.getZ());
                                    const velocity = new Vector3(pbVelocity.getX(), pbVelocity.getY(), pbVelocity.getZ());
                                    movementComponent.onServerUpdate(position, rotation, velocity);
                                }
                            }
                        });
                        ApiClient.instance.addHandler(8, (message: BattleServerCheckpointUpdateMsg) => {
                            if (currentScene) {
                                const level = currentScene.level;
                                const battle = level.battle;
                                const playerIndex = battle.players.findIndex(p => p.id === data.id);
                                if (playerIndex < 0) {
                                    console.error('Player not found', data.id);
                                    return;
                                }
                                battle.serverSetPlayerCurrentTurn(playerIndex, message.getTurn(), message.getCheckpointIndex());
                            }
                        });
                        ApiClient.instance.addHandler(10, (message: BattleServerPlayerFinishMsg) => {
                            if (currentScene) {
                                console.log('Player finished', data.id);
                                const character = currentScene.level.battle.getPlayerCharacterById(message.getPlayerId());
                                if (character) {
                                    currentScene.level.gameObjectManager.removeObject(character);

                                    const rankingIndex = rankings.findIndex(r => r.id === message.getPlayerId());
                                    if (rankingIndex >= 0) {
                                        rankings[rankingIndex] = {
                                            rank: rankings[rankingIndex].rank,
                                            id: rankings[rankingIndex].id,
                                            name: rankings[rankingIndex].name,
                                            time: timeToString(message.getTotalTime()),
                                            timeRaw: message.getTotalTime()
                                        }
                                        // rebuild rankings
                                        const newRankings = rankings.sort((a, b) => a.timeRaw - b.timeRaw).map((ranking, index) => {
                                            return {
                                                rank: index + 1,
                                                id: ranking.id,
                                                name: ranking.name,
                                                time: ranking.time,
                                                timeRaw: ranking.timeRaw
                                            }
                                        });
                                        rankings.splice(0, rankings.length, ...newRankings);

                                        setRankings(rankings);
                                    } else {
                                        console.error('Ranking not found', message.getPlayerId(), rankings);
                                    }
                                    if (message.getPlayerId() === data.id) {
                                        finishTime = message.getTotalTime();
                                        setPage(PageType.Ranking);
                                    }
                                }
                            }
                        });
                        ApiClient.instance.addHandler(11, (message: BattleFinishMsg) => {
                            if (currentScene) {
                                const newRankings = message.getPlayersList().sort(x => x.getTotalTime()).map((ranking, index) => {
                                    const totalSecs = ranking.getTotalTime();
                                    return {
                                        rank: index + 1,
                                        id: ranking.getId(),
                                        name: ranking.getName(),
                                        time: timeToString(totalSecs),
                                        timeRaw: totalSecs
                                    }
                                });
                                rankings.splice(0, rankings.length, ...newRankings);

                                setRankings(rankings);
                                setPage(PageType.Ranking);
                            }
                        });
                        ApiClient.instance.addHandler(12, (message: BattleHeartbeatMsg) => {
                            if (currentScene) {
                                currentTime = message.getTimeSinceStart();
                                setBattleState(currentBattleState);
                            }
                        });
                        ApiClient.instance.addHandler(14, (message: BattleStateUpdateMsg) => {
                            if (currentScene) {
                                currentTime = 0;
                                setBattleState(message.getState());
                            }
                        });

                        ApiClient.instance.addHandler(4, (message: BattleInitDataMsg) => {
                            finishTime = null;
                            currentBattleState = BattleState.WAITING_FOR_PLAYERS;
                            currentTime = 0;

                            const sceneConfig = ConfigTable.getScene(message.getSceneConfigId());
                            if (!sceneConfig) {
                                console.error('Invalid scene config id', message.getSceneConfigId());
                                return;
                            }
                            if (currentScene) {
                                currentScene.dispose();
                            }
                            const newRankings = message.getPlayersList().map((ranking, index) => {
                                return {
                                    rank: index + 1,
                                    id: ranking.getId(),
                                    name: ranking.getName(),
                                    time: 'Waiting...',
                                    timeRaw: 999999999999
                                }
                            });
                            rankings.splice(0, rankings.length, ...newRankings);

                            currentScene = new WorldScene(engine as any, sceneConfig, message);
                            currentScene.init().then(() => {
                                const playerIndex = currentScene.level.battle.players.findIndex(p => p.id === data.id);
                                if (playerIndex < 0) {
                                    console.error('Player not found', data.id);
                                    return;
                                }
                                let endBattleSent = false;
                                let timeSinceLastEntityUpdate = 0;
                                const renderLoop = () => {
                                    currentScene!.update();
                                    currentTime += engine.getDeltaTime() / 1000;
                                    data.game.currentLap = currentScene!.level.battle.getPlayerCurrentTurn(playerIndex) + 1;
                                    data.game.totalLaps = currentScene!.level.metadata.turnCount;
                                    setData({
                                        ...data,
                                    });
                                    if (currentScene!.level.battle.getPlayerCurrentTurn(playerIndex) >= currentScene!.level.metadata.turnCount && currentBattleState === BattleState.RACING) {
                                        data.game.finished = true;
                                        setData({
                                            ...data,
                                        });
                                        if (!endBattleSent) {
                                            endBattleSent = true;
                                            const finishMsg = new BattleClientPlayerFinishMsg();
                                            finishMsg.setTotalTime(currentTime);
                                            ApiClient.instance.send(finishMsg);
                                        }
                                    }

                                    const objects = currentScene!.level.gameObjectManager.objects;
                                    for (const [id, object] of objects) {
                                        const movementComponent = object.findComponent(MovementComponent);
                                        if (movementComponent) {
                                            movementComponent.enabled = currentBattleState === BattleState.RACING && finishTime === null;
                                        }
                                    }

                                    timeSinceLastEntityUpdate += engine.getDeltaTime();
                                    if (timeSinceLastEntityUpdate >= 50) {
                                        timeSinceLastEntityUpdate -= 50;

                                        const ownCharacter = currentScene!.level.battle.getPlayerCharacterById(data.id);
                                        if (ownCharacter) {
                                            const movementComponent = ownCharacter.findComponent(MovementComponent);
                                            if (movementComponent) {
                                                const vector3ToPbVector3 = (v: Vector3) => {
                                                    const pbVector3 = new PbVector3();
                                                    pbVector3.setX(v.x);
                                                    pbVector3.setY(v.y);
                                                    pbVector3.setZ(v.z);
                                                    return pbVector3;
                                                }
                                                const entityUpdate = new BattleClientEntityUpdateMsg();
                                                const entity = new BattleEntity();
                                                entity.setId(ownCharacter.id);
                                                entity.setPosition(vector3ToPbVector3(ownCharacter.position));
                                                entity.setRotation(vector3ToPbVector3(ownCharacter.rotation));
                                                entity.setVelocity(vector3ToPbVector3(movementComponent.velocity));
                                                entityUpdate.setEntity(entity);
                                                ApiClient.instance.send(entityUpdate);
                                            }
                                        }
                                    }
                                };
                                engine.runRenderLoop(renderLoop);
                                currentScene.onDisposeObservable.add(() => {
                                    engine.stopRenderLoop(renderLoop);
                                })

                                ApiClient.instance.send(new BattleClientReadyMsg());
                            });
                        });
                    } catch (e) {
                        console.error(e);
                    }
                };

                initBabylon();

                return () => {
                    if (engineRef.current) {
                        engineRef.current.dispose();
                        engineRef.current = null;
                    }
                };
            }, []
        )
        ;
        return (
            <canvas ref={canvasRef} style={{width: '100%', height: '100%'}}/>
        );
    }
;

ReactDOM.createRoot(document.getElementById('root')!).render(
    <>
        <PageProvider/>
    </>
    ,
);