import "./ranking.css";
import TitleBackground from "../assets/mainmenu/TitleBackground.png";

function Ranking() {
  return (
    <>
      <div className='title'>
        <h1>Kart Clash</h1>
        <img src={TitleBackground} alt='Title Background' />
      </div>
      <div className='r-content'>
        <div className='r-title'>
          <p>Ranking</p>
        </div>
        <div className='r-ranks'>
          <div className='r-rank'>
            <div>1st</div>
            <div>Sakura</div>
            <div>00:00</div>
          </div>
          <div className='r-rank'>
            <div>1st</div>
            <div>Sakura</div>
            <div>00:00</div>
          </div>
          <div className='r-rank'>
            <div>1st</div>
            <div>Sakura</div>
            <div>00:00</div>
          </div>
          <div className='r-rank'>
            <div>1st</div>
            <div>Sakura</div>
            <div>00:00</div>
          </div>
          <div className='r-rank'>
            <div>1st</div>
            <div>Sakura</div>
            <div>00:00</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Ranking;
