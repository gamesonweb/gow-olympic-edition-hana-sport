import "./keyboard.css";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import HanaGamesLogo from "../assets/common/HanaGames.png";
import AZERTY from "../assets/keyboard/AZERTY.png";
import QWERTY from "../assets/keyboard/QWERTY.png";

function Keyboard() {
    const submit = (e: any) => {
        e.preventDefault();
        console.log("Submit clicked with value: " + e.target.username.value);
    }

    const chooseAZERTY = () => {
        console.log("AZERTY clicked");
    }

    const chooseQWERTY = () => {
        console.log("QWERTY clicked");
    }
    
    return (
        <>
            <div className="title">
                <h1>Kart Clash</h1>
                <img src={TitleBackground} alt="Title Background"/>
            </div>
            <form className="instructions" onSubmit={submit}>
                <div className="instructions-text">
                    <h2>Choose a keyboard</h2>
                </div>
                <div className="k-choose">
                    <div onClick={chooseAZERTY}>
                        <img src={AZERTY} onSubmit={submit} alt="Keyboard 1"/>
                        <p>AZERTY</p>
                    </div>
                    <div onClick={chooseQWERTY}>
                        <img src={QWERTY} onSubmit={submit} alt="Keyboard 2"/>
                        <p>QWERTY</p>
                    </div>
                </div>
            </form>
            <img className="hanalogo" src={HanaGamesLogo} alt="Hana Games"/>
        </>
    );

}

export default Keyboard;
