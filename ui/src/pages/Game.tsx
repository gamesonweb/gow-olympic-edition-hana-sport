import "./game.css";
import { useState, useEffect, useRef } from "react";

function Game() {
  const [time, setTime] = useState("");
  const [data] = useState({
    position: 1,
    currentLap: 1,
    totalLaps: 3,
  });
  const startTime = Date.now();

  const endRank = useRef<HTMLDivElement>(null);

  const showEndRank = (state: boolean) => {
    if (endRank.current) {
      endRank.current.style.display = state ? "block" : "none";
    }
  };
  //update time every second show 00:00
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

  const convertPosition = (position: number) => {
    switch (position) {
      case 1:
        return "1st";
      case 2:
        return "2nd";
      case 3:
        return "3rd";
      default:
        return `${position}th`;
    }
  };

  return (
    <>
      <div className='g-time'>
        <p>{time}</p>
      </div>
      <div className='g-rank' ref={endRank}>
        <p>{convertPosition(data.position)} Race</p>
      </div>
      <div className='g-lap'>
        <p>
          {data.currentLap}/{data.totalLaps}
        </p>
      </div>
      <div className='g-position'>
        <p>{convertPosition(data.position)}</p>
      </div>
    </>
  );
}

export default Game;
