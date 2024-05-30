import "./ranking.css";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import RankingComponent from "../components/RankingComponent.tsx";
import {useContext} from "react";
import {PageContext} from "../main.tsx";

function Ranking() {
    const page = useContext(PageContext);
    return (
        <>
            <div className='title'>
                <h1>Kart Clash</h1>
                <img src={TitleBackground} alt='Title Background'/>
            </div>
            <div className='r-content'>
                <div className='r-title'>
                    <p>Ranking</p>
                </div>
                <div className='r-ranks'>
                    {
                        page.data.rankings.map((rank: any, index: number) => {
                            return (
                                <RankingComponent key={index} rank={rank.rank} name={rank.name} time={rank.time}/>
                            );
                        })
                    }
                </div>
                <div className='submit'>
                    <a onClick={() => page.setPage("MainMenu")}>Main Menu</a>
                </div>
            </div>
        </>
    );
}

export default Ranking;
