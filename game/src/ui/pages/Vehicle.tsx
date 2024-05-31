import React, {useContext, useRef, useState} from 'react';
import "./vehicle.css";
import HanaGamesLogo from "../assets/common/HanaGames.png";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import {PageContext, State} from "../../index";
import {PageType} from "../../PageType";
import ApiClient from "../../api/client";
import {JoinMatchmakingMsg} from "../../api/pb/game_pb";

function Vehicle() {
    const page = useContext(PageContext);
    const [stats, setStats] = useState(page.data.vehicles[0]);
    const [index, setIndex] = useState(0);

    const previousRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const previous = () => {
        console.log("Previous clicked");
        const newIndex = (index - 1 + page.data.vehicles.length) % page.data.vehicles.length;
        setIndex(newIndex);
        setStats(page.data.vehicles[newIndex]);
    };

    const next = () => {
        console.log("Next clicked");
        const newIndex = (index + 1) % page.data.vehicles.length;
        setIndex(newIndex);
        setStats(page.data.vehicles[newIndex]);
    };

    const submit = () => {
        console.log("Submit clicked");
        let data = page.data;
        data.selection.vehicle = index;
        page.setState(State.Matchmaking);
        page.setData(data);
        console.log("Vehicle selected: " + index);
        const joinMatchmakingMsg = new JoinMatchmakingMsg();
        joinMatchmakingMsg.setCharacterConfigId(page.data.vehicles[index].id);
        ApiClient.instance.send(joinMatchmakingMsg);
        page.setPage(PageType.Matchmaking);
    };

    const back = () => {
        console.log("Back clicked");
        page.setPage(PageType.Map);
    };

    return (
        <>
            <div className='v-background'>
                <div className='title'>
                    <h1>Kart Clash</h1>
                    <img src={TitleBackground} alt='Title Background'/>
                </div>
                <div className='v-choose'>
                    <div className='instructions-text'>
                        <h2>Choose your vehicule</h2>
                    </div>
                    <div className='v-content'>
                        <div className='v-content-preview'>
                            <img
                                src={stats.image}
                                alt='Vehicule 1'
                            />
                        </div>
                        <div className='v-content-info'>
                            <h2>{stats.name}</h2>
                            <div className='v-content-stat'>
                                <p>Speed: {stats.speed}</p>
                            </div>
                            <div className='v-content-stat'>
                                <p>Acceleration: {stats.acceleration}</p>
                            </div>
                            <div className='v-content-stat'>
                                <p>Brake: {stats.brake}</p>
                            </div>
                            <div className='v-content-control'>
                                <button ref={previousRef} onClick={previous}>
                                    Previous
                                </button>
                                <button ref={nextRef} onClick={next}>
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='submit'>
                        <button onClick={submit}>Start</button>
                        <button className='v-back' onClick={back}>
                            Back
                        </button>
                    </div>
                </div>
                <img className='hanalogo' src={HanaGamesLogo} alt='Hana Games'/>
            </div>
        </>
    );
}

export default Vehicle;
