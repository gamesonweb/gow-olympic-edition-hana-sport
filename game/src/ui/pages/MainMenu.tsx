import "./mainmenu.css";
import HanaGamesLogo from "../assets/common/HanaGames.png";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import {PageContext} from "../../index";
import {useContext} from "react";
import {PageType} from "../../PageType";
import ApiClient from "../../api/client";

function MainMenu() {
    const page = useContext(PageContext);
    if (!ApiClient.instance || !ApiClient.instance.connected) {
        page.setPage(PageType.ConnectToServer);
        return <></>;
    }
    return (
        <>
            <div className='mm-background'>
                <div className='title'>
                    <h1>Kart Clash</h1>
                    <img src={TitleBackground} alt='Title Background'/>
                </div>
                <div className='mm-buttons'>
                    <a onClick={() => page.setPage(PageType.Map)}>Multi Player</a>
                    <a onClick={() => page.setPage(PageType.Credits)}>Credits</a>
                    <a onClick={() => page.setPage(PageType.HowTo)}>How to play</a>
                    <a onClick={() => page.setPage(PageType.Company)}>HANA GAMES</a>
                </div>
                <img className='hanalogo' src={HanaGamesLogo} alt='Hana Games'/>
            </div>
        </>
    );
}

export default MainMenu;
