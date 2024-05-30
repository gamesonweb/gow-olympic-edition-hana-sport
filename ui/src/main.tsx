import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainMenu from "./pages/MainMenu.tsx";
import Options from "./pages/Options.tsx";
import EnterUsername from "./pages/EnterUsername.tsx";
import Vehicle from "./pages/Vehicle.tsx";
import Keyboard from "./pages/Keyboard.tsx";
import Matchmaking from "./pages/Matchmaking.tsx";
import Controller from "./pages/Controller.tsx";
import Game from "./pages/Game.tsx";
import Ranking from "./pages/Ranking.tsx";
import HowTo from "./pages/HowTo.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<MainMenu/>}/>
                <Route path="/options" element={<Options/>}/>
                <Route path="/enterusername" element={<EnterUsername/>}/>
                <Route path="/vehicle" element={<Vehicle/>}/>
                <Route path="/keyboard" element={<Keyboard/>}/>
                <Route path="/matchmaking" element={<Matchmaking/>}/>
                <Route path="/controller" element={<Controller/>}/>
                <Route path="/game" element={<Game/>}/>
                <Route path="/ranking" element={<Ranking/>}/>
                <Route path="/howto" element={<HowTo/>}/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
