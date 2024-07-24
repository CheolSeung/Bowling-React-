import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import {Link} from "react-router-dom";
import "../css/Play.css";
import Playview from './Playview';
import 'animate.css';


@inject('playStore')
@observer
class Play extends Component {

	constructor(props) {
		super(props);

		const { playStore } = props;
		playStore.init();
	}

	render() {
		const { playStore } = this.props;

		return (
			<>
				<div>
					<div className='pvideo_div'>
						<video className='pvideo' muted autoPlay loop>
							<source src="../video/play_bg.mp4" type='video/mp4' />
						</video>
					</div>

					{/* Reset 버튼 */}
					<div className='reset'>
						<button onClick={() => playStore.resetBtn()}>
							Reset Game
						</button>
					</div>

					{/* 프레임 */}
					<div className="container">
						<div className="animate__animated animate__zoomIn">
							{playStore.player.map((player, i) => <Playview key={player.id} id={i}/> )}
						</div>
					</div>
					{/* 기능 */}
					<div className='func'>
						<button className="roll" onClick={() => playStore.rollBtn2()}>ROLL</button>
						<button className="strike_roll" onClick={() => playStore.strikeBtn2()}>STRIKE</button>
						<Link to='/'><button className="go_home">HOME</button></Link>
					</div>
				</div>
			</>
		)
	}
}

export default Play;
