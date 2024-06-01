import "./leaderboard.css";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import RankingComponent from "../components/RankingComponent";
import React, {useContext, useState} from "react";
import {LeaderboardContext, PageContext} from "../../index";
import {PageType} from "../../PageType";

function Leaderboard() {
    const {rankings} = useContext(LeaderboardContext);
    const [data, setData] = useState(rankings[0]);
    const [index, setIndex] = useState(0);
    const {setPage} = useContext(PageContext);
    const back = () => {
        setPage(PageType.MainMenu);
    }

    const previous = () => {
        console.log("Previous clicked");
        const newIndex = (index - 1 + rankings.length) % rankings.length;
        setIndex(newIndex);
        setData(rankings[newIndex]);
    };

    const next = () => {
        console.log("Next clicked");
        const newIndex = (index + 1) % rankings.length;
        setIndex(newIndex);
        setData(rankings[newIndex]);
    };

    return (
        <>
            <div className='l-background'>
                <div className='title'>
                    <h1>Kart Clash</h1>
                    <img src={TitleBackground} alt='Title Background'/>
                </div>
                <div className='l-content'>
                    <div className='l-title'>
                        <p>Leaderboard</p>
                    </div>
                    <div className='l-ranks'>
                        {
                            data.ranks.map((rank: any, index: number) => {
                                return (
                                    <RankingComponent key={index} rank={rank.rank} name={rank.name} time={rank.time}/>
                                );
                            })
                        }
                    </div>
                    <div className="l-nav">
                        <button onClick={previous}>
                            Previous
                        </button>
                        <p>{data.mapName}</p>
                        <button onClick={next}>
                            Next
                        </button>
                    </div>
                    <div className='submit'>
                        <button className='l-back' onClick={back}>
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Leaderboard;
