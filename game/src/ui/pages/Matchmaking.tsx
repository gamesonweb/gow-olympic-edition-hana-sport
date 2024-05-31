import "./matchmaking.css";
import HanaGamesLogo from "../assets/common/HanaGames.png";
import {useContext} from "react";
import {PageContext} from "../../index";

function Matchmaking() {
    const page = useContext(PageContext);
    return (
        <>
            <div className='m-background'>
                <div className="m-content">
                    <h1>Matchmaking</h1>
                    <p>Waiting for players...</p>
                    <p>{page.data.matchmaking.currentPlayers}/{page.data.matchmaking.maxPlayers}</p>
                </div>
                <img className="hanalogo" src={HanaGamesLogo} alt="Hana Games"/>
            </div>
        </>
    );

}

export default Matchmaking;
