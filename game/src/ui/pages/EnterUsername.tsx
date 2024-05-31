import "./enterusername.css";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import HanaGamesLogo from "../assets/common/HanaGames.png";
import {useContext} from "react";
import {PageContext} from "../../index";
import {PageType} from "../../PageType";

function EnterUsername() {
    const page = useContext(PageContext);
    const submit = (e: any) => {
        e.preventDefault();
        console.log("Submit clicked with value: " + e.target.username.value);
        page.data.selection.username = e.target.username.value;
        if (page.data.id === "") {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let id = "";
            for (let i = 0; i < 16; i++) {
                id += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            page.data.id = id;
            console.log("Generated ID: " + page.data.id);
        }
        page.setPage(PageType.Keyboard);
    }
    return (
        <>
            <div className="eu-background">
                <div className="title">
                    <h1>Kart Clash</h1>
                    <img src={TitleBackground} alt="Title Background"/>
                </div>
                <form className="instructions" onSubmit={submit}>
                    <div className="instructions-text">
                        <h2>Enter Username</h2>
                    </div>
                    <div className="eu-input">
                        <input name="username" type="text" placeholder="Enter Username" required minLength={3}
                               maxLength={16}/>
                    </div>
                    <div className="submit">
                        <button type="submit">Submit</button>
                    </div>
                </form>
                <img className="hanalogo" src={HanaGamesLogo} alt="Hana Games"/>
            </div>
        </>
    );

}

export default EnterUsername;
