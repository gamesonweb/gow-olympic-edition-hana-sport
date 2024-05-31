import "./matchmaking.css";
import HanaGamesLogo from "../assets/common/HanaGames.png";
import {useContext, useEffect} from "react";
import {PageContext} from "../../index";
import ApiClient from "../../api/client";
import {JoinMatchmakingMsg} from "../../api/pb/game_pb";

function Matchmaking() {
    const page = useContext(PageContext);
    /*useEffect(() => {
        if (!page.data.matchmaking.inMatchmaking) {
            const joinMatchmaking = new JoinMatchmakingMsg();
            joinMatchmaking.setCharacterConfigId(page.data.selection.vehicle);
            ApiClient.instance.send(joinMatchmaking);
            page.data.matchmaking.inMatchmaking = true;
            page.data.matchmaking.currentPlayers = 0;
            page.data.matchmaking.maxPlayers = 0;
            page.setData(page.data);
        }
    }, [page]);*/


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
