import "./game.css";
import {useState, useEffect, useRef, useContext} from "react";
import Utils from "../Utils";
import {PageContext} from "../../index";

function Game() {
    const {data} = useContext(PageContext);

    const endRank = useRef<HTMLDivElement>(null);
    const countdownRef = useRef<HTMLParagraphElement>(null);

    const showEndRank = (state: boolean) => {
        if (endRank.current) {
            endRank.current.style.display = state ? "block" : "none";
        }
    };

    useEffect(() => {
        console.log(data.game.finished);
        showEndRank(data.game.finished);
    }, [data.game.finished]);

    useEffect(() => {
        if (data.game.countdown <= 0) {
            countdownRef.current.style.display = "none";
        }
        else {
            countdownRef.current.style.display = "block";
        }
    }, [data.game.countdown]);

    return (
        <>
            <div className='g-time'>
                <p>{data.game.time}</p>
            </div>
            <div className='g-rank' ref={endRank}>
                <p>{Utils.convertPosition(data.game.position)} Race</p>
            </div>
            <div className='g-lap'>
                <p>
                    {data.game.currentLap}/{data.game.totalLaps}
                </p>
            </div>
            <div className='g-position'>
                <p>{Utils.convertPosition(data.game.position)}</p>
            </div>
            <p ref={countdownRef} className="g-countdown">
                {data.game.countdown}
            </p>
        </>
    );
}

export default Game;
