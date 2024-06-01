import "./leaderboard.css";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import RankingComponent from "../components/RankingComponent";
import React, {useContext} from "react";
import {LeaderboardContext, PageContext} from "../../index";
import {PageType} from "../../PageType";

function Leaderboard() {
    const {rankings} = useContext(LeaderboardContext);
    const {setPage} = useContext(PageContext);
    const back = () => {
        setPage(PageType.MainMenu);
    }

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
                            rankings.map((rank: any, index: number) => {
                                return (
                                    <RankingComponent key={index} rank={rank.rank} name={rank.name} time={rank.time}/>
                                );
                            })
                        }
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
