import "./credits.css";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import HanaGamesLogo from "../assets/common/HanaGames.png";
import {PageContext} from "../../index";
import {useContext} from "react";

function Credits() {
    const page = useContext(PageContext);
    const back = () => {
        console.log("Back");
        page.setPage("MainMenu");
    }
    return (
        <>
            <div className='c-background'>
                <div className="title">
                    <h1>Kart Clash</h1>
                    <img src={TitleBackground} alt="Title Background"/>
                </div>
                <div className="c-content">
                    <div>
                        <h2>Credits</h2>
                        <p>Mike Chiappe - Developer</p>
                        <p>Sébastien Aglaé - Developer</p>
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

export default Credits;
