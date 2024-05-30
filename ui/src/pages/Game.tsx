import "./game.css";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import HanaGamesLogo from "../assets/common/HanaGames.png";

function Game() {
    return (
        <>
            <div className="title">
                <h1>Kart Clash</h1>
                <img src={TitleBackground} alt="Title Background"/>
            </div>
            <p>Game</p>
            <img className="hanalogo" src={HanaGamesLogo} alt="Hana Games"/>
        </>
    );

}

export default Game;
