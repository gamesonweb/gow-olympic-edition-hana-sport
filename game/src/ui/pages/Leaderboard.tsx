import "./leaderboard.css";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import RankingComponent from "../components/RankingComponent";
import React, {useContext, useEffect, useState} from "react";
import {LeaderboardContext, PageContext} from "../../index";
import {PageType} from "../../PageType";

function Leaderboard() {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(rankings[0]);
    const [index, setIndex] = useState(0);
    const {setPage} = useContext(PageContext);
    const back = () => {
        setPage(PageType.MainMenu);
    }

    useEffect(() => {
        fetch("http://localhost:8080/leaderboard?map=1")
            .then(response => response.json())
            .then(data => {
                setRankings(data);
                setLoading(false);
            });
    }, []);
    
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
                        {rankings.length ? (
                                rankings.map((rank: any, index: number) => {
                                    const score = rank.score; // total secs
                                    const minutes = Math.floor(score / 60);
                                    const seconds = Math.floor(score % 60);
                                    const milliseconds = Math.floor((score - Math.floor(score)) * 1000);
                                    rank.time = `${minutes}:${seconds}.${milliseconds}`;

                                    return (
                                        <RankingComponent key={index} rank={rank.rank} name={rank.name} time={rank.time}/>
                                    );
                                })
                        ) : (
                            loading ? (
                                <p className="l-info">Loading...</p>
                            ) : (
                                <p className="l-info">No data :(</p>
                            )
                        )}
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
