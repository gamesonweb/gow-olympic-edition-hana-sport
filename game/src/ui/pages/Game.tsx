import "./game.css";
import {useState, useEffect, useRef, useContext} from "react";
import Utils from "../Utils";
import {PageContext} from "../../index";

function Game() {
    const [time, setTime] = useState("");
    const {data} = useContext(PageContext);
    const startTime = Date.now();

    const endRank = useRef<HTMLDivElement>(null);

    const showEndRank = (state: boolean) => {
        if (endRank.current) {
            endRank.current.style.display = state ? "block" : "none";
        }
    };
    useEffect(() => {
        showEndRank(data.game.finished);
    }, [data.game.finished]);
    useEffect(() => {
        showEndRank(false);
        const interval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const seconds = Math.floor(elapsedTime / 1000);
            const minutes = Math.floor(seconds / 60);
            setTime(
                `${minutes.toString().padStart(2, "0")}:${(seconds % 60)
                    .toString()
                    .padStart(2, "0")}`
            );
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className='g-time'>
                <p>{time}</p>
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
            <p className="g-countdown">
                {3 - data.game.countdown}
            </p>
        </>
    );
}

export default Game;
