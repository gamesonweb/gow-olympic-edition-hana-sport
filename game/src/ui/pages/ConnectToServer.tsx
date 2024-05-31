import "./connectToServer.css";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import HanaGamesLogo from "../assets/common/HanaGames.png";
import React, {useContext, useEffect} from "react";
import {PageContext} from "../../index";
import {PageType} from "../../PageType";
import ApiClient from "../../api/client";

function ConnectToServer() {
    const page = useContext(PageContext);
    useEffect(() => {
        if (!ApiClient.instance) {
            ApiClient.create("ws://localhost:8080/ws");
        }
        if (ApiClient.instance.isConnecting()) {
            return;
        }
        if (ApiClient.instance.connected) {
            page.setPage(PageType.MainMenu);
            return;
        }
        ApiClient.instance.setSessionInfo(page.data.id, page.data.selection.username);
        function connect() {
            ApiClient.instance.connectAsync().then(() => {
                page.setPage(PageType.MainMenu);
            }).catch((error) => {
                console.error(error);
                /*if (confirm("Failed to connect to server. Please try again.")) {
                    connect();
                } else {
                    connect();
                }*/
            });
        }
        connect();
    }, []);
    console.log("Connect to server");
    return (
        <>
            <div className="cs-background">
                <div className="title">
                    <h1>Kart Clash</h1>
                    <img src={TitleBackground} alt="Title Background"/>
                </div>
                <div className="cs-content">
                    <p>Connect to Server...</p>
                </div>
                <img className="hanalogo" src={HanaGamesLogo} alt="Hana Games"/>
            </div>
        </>
    );
}

export default ConnectToServer;
