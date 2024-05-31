import "./ranking.css";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";
import RankingComponent from "../components/RankingComponent";
import {useContext} from "react";
import {PageContext, RankingContext} from "../../index";
import {PageType} from "../../PageType";

function Ranking() {
    const {rankings} = useContext(RankingContext);
    const {setPage} = useContext(PageContext);

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
                        rankings.map((rank: any, index: number) => {
                            return (
                                <RankingComponent key={index} rank={rank.rank} name={rank.name} time={rank.time}/>
                            );
                        })
                    }
                </div>
                <div className='submit'>
                    <a onClick={() => setPage(PageType.MainMenu)}>Main Menu</a>
                </div>
            </div>
        </>
    );
}

export default Ranking;
