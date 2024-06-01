import "./ranking.css";
import Utils from "../Utils";

function RankingComponent(props: any) {
    return (
        <div className='r-rank'>
            <div>{Utils.convertPosition(props.rank)}</div>
            <div>{props.name}</div>
            <div>{props.time}</div>
        </div>
    )
}

export default RankingComponent;