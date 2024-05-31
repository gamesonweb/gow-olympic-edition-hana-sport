import "./matchmaking.css";
import HanaGamesLogo from "../assets/common/HanaGames.png";
import React, {useContext} from "react";
import {PageContext} from "../../index";
import {PageType} from "../../PageType";

function Matchmaking() {
    const page = useContext(PageContext);
    const start = () => {
        console.log("Start clicked");
    }

    const cancel = () => {
        console.log("Cancel clicked");
        page.setPage(PageType.MainMenu);
    }
    return (
        <>
            <div className='m-background'>
                <div className="m-content">
                    <h1>Matchmaking</h1>
                    <p>Waiting for players...</p>
                    <p>{page.data.matchmaking.currentPlayers}/{page.data.matchmaking.maxPlayers}</p>

                    <div className='submit'>
                        <button onClick={start}>Start now</button>
                        <button className='m-back' onClick={cancel}>
                            Cancel
                        </button>
                    </div>
                </div>
                <img className="hanalogo" src={HanaGamesLogo} alt="Hana Games"/>
            </div>
        </>
    );

}

export default Matchmaking;
