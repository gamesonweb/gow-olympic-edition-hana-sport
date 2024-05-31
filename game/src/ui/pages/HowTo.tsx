import "./howto.css";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import HanaGamesLogo from "../assets/common/HanaGames.png";
import {PageContext} from "../../index";
import {useContext} from "react";
import {PageType} from "../../PageType";

function HowTo() {
    const page = useContext(PageContext);
    const back = () => {
        console.log("Back");
        page.setPage(PageType.MainMenu);
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
                        <p>Use Z or W to accelerate. Use S to brake.</p>
                        <p>Use Q or A to turn left. Use D to turn right.</p>
                        <p>Do as many laps as needed and be the first to cross the finish line!</p>
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
