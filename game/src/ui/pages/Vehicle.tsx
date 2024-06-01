import React, {useContext, useEffect, useRef, useState} from 'react';
import "./vehicle.css";
import HanaGamesLogo from "../assets/common/HanaGames.png";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import {PageContext, State} from "../../index";
import {PageType} from "../../PageType";
import ApiClient from "../../api/client";
import {JoinMatchmakingMsg} from "../../api/pb/game_pb";
import {Engine} from "@babylonjs/core/Engines/engine";
import {Scene} from "@babylonjs/core/scene";
import {ArcRotateCamera, AutoRotationBehavior, Matrix, SceneLoader, Vector3} from "@babylonjs/core";

function Vehicle() {
    const page = useContext(PageContext);
    const [stats, setStats] = useState(page.data.vehicles[0]);
    const [index, setIndex] = useState(0);

    const previousRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const previous = () => {
        console.log("Previous clicked");
        const newIndex = (index - 1 + page.data.vehicles.length) % page.data.vehicles.length;
        setIndex(newIndex);
        setStats(page.data.vehicles[newIndex]);
    };

    const next = () => {
        console.log("Next clicked");
        const newIndex = (index + 1) % page.data.vehicles.length;
        setIndex(newIndex);
        setStats(page.data.vehicles[newIndex]);
    };

    const submit = () => {
        console.log("Submit clicked");
        let data = page.data;
        data.selection.vehicle = index;
        console.log("Vehicle selected: " + index);
        console.log("Map selected: " + data.selection.map);
        console.log("Data", data);
        const joinMatchmakingMsg = new JoinMatchmakingMsg();
        joinMatchmakingMsg.setCharacterConfigId(page.data.vehicles[index].id);
        joinMatchmakingMsg.setMapConfigId(page.data.maps[data.selection.map].id);
        ApiClient.instance.send(joinMatchmakingMsg);
        page.setData(data);
        page.setState(State.Matchmaking);
        page.setPage(PageType.Matchmaking);

    };

    const back = () => {
        console.log("Back clicked");
        page.setPage(PageType.Map);
    };
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const engine = new Engine(canvasRef.current, true);
        const scene = new Scene(engine);

        const model = page.data.vehicles[index].model;

        scene.createDefaultEnvironment();
        scene.createDefaultSkybox();
        scene.createDefaultLight(true);

        const arcRotateCamera = new ArcRotateCamera("Camera", -Math.PI / 4, Math.PI / 3, 5, new Vector3(0, 0, 0), scene);

        // load glb model
        SceneLoader.ImportMeshAsync(null, "assets/" + model, null, scene).then((result) => {
            const root = result.meshes[0];
            root.scaling = new Vector3(1, 1, 1);
            root.position = new Vector3(0, 0, 0);

            arcRotateCamera.setTarget(root.getBoundingInfo().boundingBox.center.clone().add(new Vector3(0, 0.25, 0)));
            arcRotateCamera.attachControl(canvasRef.current, true);

            // rotate the model
            scene.registerBeforeRender(() => {
                const deltaTime = engine.getDeltaTime() / 1000;
                const rotation = root.rotation;
                rotation.y += 1.5 * deltaTime * Math.PI / 4;
                root.rotation = rotation;
            });
        });

        engine.runRenderLoop(() => {
            scene.render();
        });
        return () => {
            scene.dispose();
            engine.dispose();
        };
    }, [index, page.data.vehicles]);

    return (
        <>
            <div className='v-background'>
                <div className='title'>
                    <h1>Kart Clash</h1>
                    <img src={TitleBackground} alt='Title Background'/>
                </div>
                <div className='v-choose'>
                    <div className='instructions-text'>
                        <h2>Choose your vehicule</h2>
                    </div>
                    <div className='v-content'>
                        <div className='v-content-preview'>
                            <canvas ref={canvasRef} />
                        </div>
                        <div className='v-content-info'>
                            <h2>{stats.name}</h2>
                            <div className='v-content-stat'>
                                <p>Speed: {stats.speed}</p>
                            </div>
                            <div className='v-content-stat'>
                                <p>Acceleration: {stats.acceleration}</p>
                            </div>
                            <div className='v-content-stat'>
                                <p>Brake: {stats.brake}</p>
                            </div>
                            <div className='v-content-control'>
                                <button ref={previousRef} onClick={previous}>
                                    Previous
                                </button>
                                <button ref={nextRef} onClick={next}>
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='submit'>
                        <button onClick={submit}>Start</button>
                        <button className='v-back' onClick={back}>
                            Back
                        </button>
                    </div>
                </div>
                <img className='hanalogo' src={HanaGamesLogo} alt='Hana Games'/>
            </div>
        </>
    );
}

export default Vehicle;
