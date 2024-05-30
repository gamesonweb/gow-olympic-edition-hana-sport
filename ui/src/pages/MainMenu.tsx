import "./mainmenu.css";
import HanaGamesLogo from "../assets/common/HanaGames.png";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import {PageContext} from "../main.tsx";
import {useContext} from "react";

function MainMenu() {
    const page = useContext(PageContext);
    const singlePlayer = () => {
        console.log("Single Player");
        page.data.selection.mode = "singleplayer";
        page.setPage("Vehicle");
    }
    
    const multiPlayer = () => {
        console.log("Multi Player");
        page.data.selection.mode = "multiplayer";
        page.setPage("Vehicle");
    }
    return (
        <>
            <div className='mm-background'>
                <div className='title'>
                    <h1>Kart Clash</h1>
                    <img src={TitleBackground} alt='Title Background'/>
                </div>
                <div className='mm-buttons'>
                    <a onClick={singlePlayer}>Single Player</a>
                    <a onClick={multiPlayer}>Multi Player</a>
                    <a onClick={() => page.setPage("Credits")}>Credits</a>
                    <a onClick={() => page.setPage("HowTo")}>How to play</a>
                    <a onClick={() => page.setPage("Company")}>HANA GAMES</a>
                </div>
                <img className='hanalogo' src={HanaGamesLogo} alt='Hana Games'/>
            </div>
        </>
    );
}

export default MainMenu;
