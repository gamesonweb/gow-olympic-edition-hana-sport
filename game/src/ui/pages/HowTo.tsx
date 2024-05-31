import "./howto.css";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import HanaGamesLogo from "../assets/common/HanaGames.png";
import {PageContext} from "../../index";
import {useContext} from "react";

function HowTo() {
    const page = useContext(PageContext);
    const back = () => {
        console.log("Back");
        page.setPage("MainMenu");
    }
    return (
        <>
            <div className="ht-background">
                <div className="title">
                    <h1>Kart Clash</h1>
                    <img src={TitleBackground} alt="Title Background"/>
                </div>
                <div className="ht-content">
                    <div className="ht-instruction">
                        <h2>How to play</h2>
                        <p>Use the arrow keys to move your kart.</p>
                        <p>Press the space bar to use power-ups.</p>
                        <p>Collect coins to buy power-ups.</p>
                    </div>
                    <div className='submit'>
                        <button className='ht-back' onClick={back}>
                            Back
                        </button>
                    </div>
                </div>
                <img className="hanalogo" src={HanaGamesLogo} alt="Hana Games"/>
            </div>
        </>
    );
}

export default HowTo;
