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
import {WebGPUEngine} from '@babylonjs/core';
import ConfigTable from "./logic/config/table";
import {PageType} from "./PageType";
import Map from "./ui/pages/Map";
import ConnectToServer from "./ui/pages/ConnectToServer";

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
        default:
            return <MainMenu/>
    }
}

export const PageContext = createContext({
    page: PageType,
    setPage: (name: PageType) => {
    },
    data: {
        vehicles: [{
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
        },
        maps: [{
            name: 'name',
            image: 'image',
            description: 'description',
        }],
        id: ""
    },
    setData: (data: any) => {
    }
})

const gameData = {
    vehicles: [
        {
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
        finished: false
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
        console.log("Start clicked");
    }, [])

    const onCancel = useCallback(() => {
        console.log("Cancel clicked");
    }, [])

    const [currentPlayers, setCurrentPlayers] = useState(0)
    const [maxPlayers, setMaxPlayers] = useState(5)

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

    return (
        <PageContext.Provider value={{page, setPage, data, setData}}>
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
        const {data, setData} = useContext(PageContext);
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

                        const scene = new WorldScene(engine as any, ConfigTable.scenes[0]);
                        await scene.init();
                        setData(
                            {
                                ...data,
                                game: {
                                    ...data.game,
                                    currentLap: 50
                                }
                            });
                        console.log(data);
                        engine.runRenderLoop(() => {
                            scene.update();
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
