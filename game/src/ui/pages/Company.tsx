import "./company.css";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import HanaGamesLogo from "../assets/common/HanaGames.png";
import S0 from "../assets/company/S0.png";
import S1 from "../assets/company/S1.png";
import {PageContext} from "../../index";
import {useContext} from "react";
import {PageType} from "../../PageType";

function Company() {
    const page = useContext(PageContext);
    const back = () => {
        console.log("Back");
        page.setPage(PageType.MainMenu);
    }
    return (
        <>
            <div className="cp-background">
                <div className="title">
                    <h1>Hana Games</h1>
                    <img src={TitleBackground} alt="Title Background"/>
                </div>
                <div className="cp-content">
                    <div className="cp-scroll">
                        <div className="cp-instruction">
                            <h2>Hana Games</h2>
                            <p>We are an independent French game studio currently developing Gang Stars.</p>
                        </div>
                        <div className="cp-preview">
                            <img src={S0} alt="Screenshot 0"/>
                            <img src={S1} alt="Screenshot 1"/>
                        </div>
                    </div>
                    <div className='submit'>
                        <button className='cp-back' onClick={back}>
                            Back
                        </button>
                    </div>
                </div>
                <img className="hanalogo" src={HanaGamesLogo} alt="Hana Games"/>
            </div>
        </>
    );
}

export default Company;
