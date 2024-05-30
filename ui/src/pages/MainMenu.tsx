import "./mainmenu.css";
import HanaGamesLogo from "../assets/common/HanaGames.png";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import { Link } from "react-router-dom";

function MainMenu() {
    return (
        <>
            <div className="title">
                <h1>Kart Clash</h1>
                <img src={TitleBackground} alt="Title Background"/>
            </div>
            <div className="mm-buttons">
                <Link to="/vehicle">Single Player</Link>
                <Link to="/vehicle">Multi Player</Link>
                <Link to="/options">Options</Link>
                <Link to="/credits">Credits</Link>
            </div>
            <img className="hanalogo" src={HanaGamesLogo} alt="Hana Games"/>
        </>
    );
}

export default MainMenu;