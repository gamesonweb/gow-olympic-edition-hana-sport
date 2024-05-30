import "./howto.css";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import HanaGamesLogo from "../assets/common/HanaGames.png";

function HowTo() {
    return (
        <>
            <div className="title">
                <h1>Kart Clash</h1>
                <img src={TitleBackground} alt="Title Background"/>
            </div>
            <p>How To</p>
            <img className="hanalogo" src={HanaGamesLogo} alt="Hana Games"/>
        </>
    );
}

export default HowTo;
