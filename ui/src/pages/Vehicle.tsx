import "./vehicule.css";
import HanaGamesLogo from "../assets/common/HanaGames.png";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import {useRef, useState} from "react";
import {useNavigate} from 'react-router-dom';

function Vehicle() {
    const [stats] = useState({
        name: "Vehicule 1",
        speed: 100,
        acceleration: 50,
        handling: 20
    });

    const navigate = useNavigate();

    const previousRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const previous = () => {
        console.log("Previous clicked");
    }

    const next = () => {
        console.log("Next clicked");
    }

    const submit = () => {
        console.log("Submit clicked");
    }

    const back = () => {
        console.log("Back clicked");
        navigate(-1);
    }

    return (
        <>
            <div className="title">
                <h1>Kart Clash</h1>
                <img src={TitleBackground} alt="Title Background"/>
            </div>
            <div className="v-choose">
                <div className="instructions-text">
                    <h2>Choose your vehicule</h2>
                </div>
                <div className="v-content">
                    <div className="v-content-preview">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtwGN33WNwsQVrWA8c2cxY-7D4PVJ6UnR7Mg&s"
                            alt="Vehicule 1"/>
                    </div>
                    <div className="v-content-info">
                        <h2>{stats.name}</h2>
                        <div className="v-content-stat">
                            <p>Speed: {stats.speed}</p>
                        </div>
                        <div className="v-content-stat">
                            <p>Acceleration: {stats.acceleration}</p>
                        </div>
                        <div className="v-content-stat">
                            <p>Handling: {stats.handling}</p>
                        </div>
                        <div className="v-content-control">
                            <button ref={previousRef} onClick={previous}>Previous</button>
                            <button ref={nextRef} onClick={next}>Next</button>
                        </div>
                    </div>

                </div>
                <div className="submit">
                    <button onClick={submit}>Start</button>
                    <button className="v-back" onClick={back}>Back</button>
                </div>
            </div>
            <img className="hanalogo" src={HanaGamesLogo} alt="Hana Games"/>
        </>
    );
}

export default Vehicle;