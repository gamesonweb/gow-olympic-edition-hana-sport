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
    BattleClientPlayerFinishMsg,
    BattleClientReadyMsg, BattleHeartbeatMsg,
    BattleInitDataMsg, BattleServerCheckpointUpdateMsg,
    BattleServerEntityUpdateMsg, BattleState, BattleStateMap, BattleStateUpdateMsg,
    CompleteMatchmakingMsg,
    LeaveMatchmakingMsg,
    MatchmakingStatusMsg
} from "./api/pb/game_pb";
import MovementComponent from "./logic/gameobject/component/movement";
import {GameObjectType} from "./logic/gameobject/gameObject";

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
            return <Game/>
        case PageType.Ranking:
            return <RankingProvider/>
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
        matchmaking: {
            inMatchmaking: false,
            currentPlayers: 0,
            maxPlayers: 0,
        },
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
            countdown: 0
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
    matchmaking: {
        inMatchmaking: false,
        currentPlayers: 0,
        maxPlayers: 5,
    },
    game: {
        position: 1,
        currentLap: 1,
        totalLaps: 3,
        finished: false,
        countdown: 3
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
            <BabylonScene/>
            <React.StrictMode>
                <div id="game">
                    {ChangePage(page)}
                </div>
            </React.StrictMode>
        </PageContext.Provider>
    )
}

export const RankingContext = createContext({
    rankings: [{
        rank: 0,
        name: 'name',
        time: '0:00.000'
    }]
})

export const RankingProvider = () => {
    const [rankings, setRankings] = useState([{
        rank: 0,
        name: 'name',
        time: '0:00.000'
    }])
    return (
        <RankingContext.Provider value={{rankings}}>
            <Ranking/>
        </RankingContext.Provider>
    )
}

const BabylonScene = () => {
        const {data, setData, page, setPage} = useContext(PageContext);
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
                                default:
                                    setPage(PageType.Game);
                                    data.game.countdown = 0;
                                    data.game.finished = false;
                                    setData({
                                        ...data,
                                    })
                                    break;
                            }
                        }

                        ApiClient.instance.addHandler(6, (message: BattleServerEntityUpdateMsg) => {
                            if (currentScene) {
                                const level = currentScene.level;
                                const battle = level.battle;
                                for (const entity of message.getEntitiesList()) {
                                    const gameObject = level.gameObjectManager.getObject(entity.getId());
                                    if (!gameObject) {
                                        console.error('Entity not found', entity.getId());
                                        return;
                                    }
                                    if (gameObject.type !== GameObjectType.Character) {
                                        console.error('Invalid entity type', gameObject.type);
                                        return;
                                    }
                                    const movementComponent = gameObject.findComponent(MovementComponent);
                                    if (!movementComponent) {
                                        console.error('Movement component not found');
                                        return;
                                    }
                                    const pbPosition = entity.getPosition();
                                    const pbRotation = entity.getRotation();
                                    const pbVelocity = entity.getVelocity();
                                    const position = new Vector3(pbPosition.getX(), pbPosition.getY(), pbPosition.getZ());
                                    const rotation = new Vector3(pbRotation.getX(), pbRotation.getY(), pbRotation.getZ());
                                    const velocity = new Vector3(pbVelocity.getX(), pbVelocity.getY(), pbVelocity.getZ());
                                    movementComponent.onServerUpdate(position, rotation, velocity);
                                    console.log('Entity updated', entity.getId(), position, rotation, velocity);
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
                        ApiClient.instance.addHandler(10, (message: BattleServerCheckpointUpdateMsg) => {
                            if (currentScene) {
                                console.log('Player finished', data.id);
                            }
                        });
                        ApiClient.instance.addHandler(11, () => {
                            if (currentScene) {
                                console.log('Battle finished');
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
                            const sceneConfig = ConfigTable.getScene(message.getSceneConfigId());
                            if (!sceneConfig) {
                                console.error('Invalid scene config id', message.getSceneConfigId());
                                return;
                            }
                            if (currentScene) {
                                currentScene.dispose();
                            }
                            currentScene = new WorldScene(engine as any, sceneConfig, message);
                            currentScene.init().then(() => {
                                const playerIndex = currentScene.level.battle.players.findIndex(p => p.id === data.id);
                                if (playerIndex < 0) {
                                    console.error('Player not found', data.id);
                                    return;
                                }
                                let endBattleSent = false;
                                engine.runRenderLoop(() => {
                                    currentScene!.update();
                                    data.game.currentLap = currentScene!.level.battle.getPlayerCurrentTurn(playerIndex) + 1;
                                    data.game.totalLaps = currentScene!.level.metadata.turnCount;
                                    setData({
                                        ...data,
                                    });
                                    if (currentScene!.level.battle.getPlayerCurrentTurn(playerIndex) >= currentScene!.level.metadata.turnCount) {
                                        data.game.finished = true;
                                        setData({
                                            ...data,
                                        });
                                        if (!endBattleSent) {
                                            endBattleSent = true;
                                            ApiClient.instance.send(new BattleClientPlayerFinishMsg());
                                        }
                                    }
                                });

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
)
