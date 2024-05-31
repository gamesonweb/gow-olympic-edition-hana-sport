import React from 'react';
import "./map.css";
import HanaGamesLogo from "../assets/common/HanaGames.png";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import {useContext, useRef, useState} from "react";
import {PageContext} from "../../index";
import {PageType} from "../../PageType";

function Map() {
    const page = useContext(PageContext);
    const [stats, setStats] = useState(page.data.maps[0]);
    const [index, setIndex] = useState(0);

    const previousRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const previous = () => {
        console.log("Previous clicked");
        const newIndex = (index - 1 + page.data.maps.length) % page.data.maps.length;
        setIndex(newIndex);
        setStats(page.data.maps[newIndex]);
    };

    const next = () => {
        console.log("Next clicked");
        const newIndex = (index + 1) % page.data.maps.length;
        setIndex(newIndex);
        setStats(page.data.maps[newIndex]);
    };

    const submit = () => {
        let data = page.data;
        data.selection.map = index;
        page.setData(data);
        console.log("Map selected: " + index);
        page.setPage(PageType.Vehicle);
    };

    const back = () => {
        console.log("Back clicked");
        page.setPage(PageType.MainMenu);
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
                        <h2>Choose a map</h2>
                    </div>
                    <div className='v-content'>
                        <div className='v-content-preview'>
                            <img
                                src={stats.image}
                                alt='Map 1'
                            />
                        </div>
                        <div className='v-content-info'>
                            <h2>{stats.name}</h2>
                            <div className='v-content-stat'>
                                <p>{stats.description}</p>
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
                        <button onClick={submit}>Next</button>
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

export default Map;
