import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import {Link} from "react-router-dom";
import "../css/Home.css";
import 'animate.css';

@inject('playStore')
@observer
class Home extends Component {
    constructor(props) {
        super(props);

        const { playStore } = props;
        playStore.homeReset();
    }

    render() {
        
        const { playStore } = this.props;

        return (
            <div className='home_bg'>
                <div className='video_div'>
                    <video className='video' muted autoPlay loop>
                        <source src="../video/home_bg.mp4" type='video/mp4' />
                    </video>
                </div>

                <div className='title'>
                    <h1 className='animate__animated animate__heartBeat animate__repeat-2'>
                        BOWLING GAME
                    </h1>
                    <p>
                        Choose the number of players
                    </p>
                </div>



                {/* MAIN CONTENT */}
                <div className='player_num'>
                    <button className='plus' onClick={() => playStore.addPlayer()}> + </button>
                    <span>{playStore._pnum}</span>
                    <button className='minus' onClick={() => playStore.delPlayer()}> - </button>
                </div>



                <div className='play_div'>
                    <Link to='/play'><button>
                        Play
                    </button></Link>
                </div>
            </div>
        )
    }
}

export default Home;