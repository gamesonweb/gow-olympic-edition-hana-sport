import React, {useEffect} from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
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

import { Engine } from "@babylonjs/core/Engines/engine"
import WorldScene from "./scenes/world";
import {WebGPUEngine} from '@babylonjs/core';
import ConfigTable from "./logic/config/table";

const ChangePage = (name: string) => {
  switch (name) {
    case 'MainMenu':
      return <MainMenu/>
    case 'EnterUsername':
      return <EnterUsername/>
    case 'Vehicle':
      return <Vehicle/>
    case 'Keyboard':
      return <Keyboard/>
    case 'Matchmaking':
      return <Matchmaking/>
    case 'Controller':
      return <Controller/>
    case 'Game':
      return <Game/>
    case 'Ranking':
      return <Ranking/>
    case 'HowTo':
      return <HowTo/>
    case 'Credits':
      return <Credits/>
    case 'Company':
      return <Company/>
    default:
      return <MainMenu/>
  }
}

export const PageContext = React.createContext({
  page: 'MainMenu',
  setPage: (name: string) => {
  },
  data: {
    vehicles: [{
      name: 'name',
      speed: 0,
      acceleration: 0,
      handling: 0,
    }],
    rankings: [{
      rank: 0,
      name: 'name',
      time: '0:00.000'
    }],
    matchmaking: {
      currentPlayers: 0,
      maxPlayers: 0,
    },
    selection: {
      vehicle: 0,
      username: '',
      keyboard: '',
      mode: '',
    }, game: {
      position: 0,
      currentLap: 0,
      totalLaps: 0,
      finished: true,
    }
  },
  setData: (data: any) => {
  }
})


const gameData = {
  vehicles: [
    {
      name: 'Vehicle 1',
      speed: 100,
      acceleration: 50,
      handling: 20,
    },
    {
      name: 'Vehicle 2',
      speed: 50,
      acceleration: 100,
      handling: 50,
    },
    {
      name: 'Vehicle 3',
      speed: 20,
      acceleration: 20,
      handling: 100,
    },
  ],
  rankings: [
    {
      rank: 1,
      name: 'Player 1',
      time: '1:23.456'
    },
    {
      rank: 2,
      name: 'Player 2',
      time: '1:23.456'
    },
    {
      rank: 3,
      name: 'Player 3',
      time: '1:23.456'
    },
    {
      rank: 4,
      name: 'Player 4',
      time: '1:23.456'
    },
    {
      rank: 5,
      name: 'Player 5',
      time: '1:23.456'
    }
  ],
  matchmaking: {
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
    vehicle: -1,
    username: "",
    keyboard: "",
    mode: "",
  },
}

const loadSelection = () => {
  const selection = localStorage.getItem('selection')
  if (selection) {
    return JSON.parse(selection)
  } else {
    return gameData.selection
  }
}

export const PageProvider = () => {
  gameData.selection = loadSelection()
  let pageName = "";
  if (gameData.selection.username !== "") {
    pageName = "Game"
  } else {
    pageName = "EnterUsername"
  }
  const [data, setData] = React.useState(gameData)
  const [page, setPage] = React.useState(pageName)

  useEffect(() => {
    if (data.selection.username === "") {
      return;
    }
    if (data.selection.keyboard === "") {
      return;
    }
    localStorage.setItem('selection', JSON.stringify(data.selection))
  }, [data.selection.username, data.selection.keyboard])

  return (
      <PageContext.Provider value={{page, setPage, data, setData}}>
        {ChangePage(page)}
      </PageContext.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <PageProvider/>
    </React.StrictMode>,
)

async function init() {
  const view = document.getElementById("view") as HTMLCanvasElement;
  const webGPUSupported = await WebGPUEngine.IsSupportedAsync;
  let engine;
  if (webGPUSupported) {
    engine = new WebGPUEngine(view);
    await engine.initAsync();
  } else {
    engine = new Engine(view, true);
  }

  const scene = new WorldScene(engine, ConfigTable.scenes[0]);
  scene.init().then(() => {
    engine.runRenderLoop(() => {
      const currentScene = engine.scenes[0];
      if (currentScene) {
        currentScene.update();
      }
    });
  });
}
init();