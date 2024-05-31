import "./matchmaking.css";
import HanaGamesLogo from "../assets/common/HanaGames.png";
import React, {useContext} from "react";
import {MatchmakingContext, PageContext, State} from "../../index";
import {PageType} from "../../PageType";

function Matchmaking() {
    const {onStart, onCancel, currentPlayers, maxPlayers} = useContext(MatchmakingContext);
    const page = useContext(PageContext);
    const cancel = () => {
        onCancel();
        page.setState(State.Lobby);
        page.setPage(PageType.MainMenu);
    }
    return (
        <>
            <div className='m-background'>
                <div className="m-content">
                    <h1>Matchmaking</h1>
                    <p>Waiting for players...</p>
                    <p>{currentPlayers}/{maxPlayers}</p>

                    <div className='submit'>
                        <button onClick={onStart}>Start now</button>
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
