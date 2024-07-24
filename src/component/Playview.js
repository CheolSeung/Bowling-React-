import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import 'animate.css';


@inject('playStore')
@observer
class Playview extends Component {

  constructor(props) {
		super(props);
  }

    // 반복문 쓰는 방법들

  //   const A = [{ name: '조', age: 50 }];
  //   const B = []; // 성별까지 포함된 사용자들

  //   for (let i = 0; i < A.length; i++) {
  //     const x = A[i];
  //     B.push({
  //       ...x,
  //       sex: '남',
  //     });
  //   }

  //   //

  //   A.forEach((x) => {
  //     B.push({
  //       ...x,
  //       sex: '남',
  //     });
  //   });

  //   //

  //   B = A.map((x) => ({
  //     ...x,
  //     sex: '남',
  //   }));
	// }
  
  render() {
    const { playStore } = this.props;
    const index = this.props.id;  // play.js 프롭스 map함수 안에 인덱스

    return (
      <>
      <div className='frame'>
        <div className={['player', index+1 === playStore.playerTurn ? 'active' : ''].join(' ').trim()}> 
          <span>Player {index+1}</span>
        </div>
        <div className='frame_wrapper'>

          {/* 1 - 9 */}
          {playStore.frames.filter((i) => i !== 10).map((i) => (
            <div key={i} className={['frame_box', playStore.currentFrame === i && index+1 === playStore.playerTurn ? 'active' : ''].join(' ').trim()}>
              <div className='frame_num'>
                {i}Frame
              </div>
              <div className='score_box'>
                <div className='first_score'>
                  {playStore.player[index].leftboxView[i - 1]}
                </div>
                <div className='second_score'>
                  {playStore.player[index].rightboxView[i - 1]}
                </div>
              </div>
              <div className='total_score'>
                {playStore.player[index].frameScoreview[i - 1]}
              </div>
            </div>
          ))}

          {/* 10프레임 */}
          <div className={['frame_box', playStore.currentFrame === 10 && index+1 === playStore.playerTurn ? 'active' : ''].join(' ').trim()}>
            <div className='frame_num'>
              {playStore.frames[9]}Frame
            </div>
            <div className='score_box'>
              <div className='first_score'>
                {playStore.player[index].leftboxView[9]}
              </div>
              <div className='second_score'>
                {playStore.player[index].rightboxView[9]}
              </div>
              <div className='third_score10'>
                {playStore.player[index].extraboxView}
              </div>
            </div>
            <div className='total_score10'>
              {playStore.player[index].frameScoreview[9]}
            </div>
          </div>
        </div>
      </div>
      </>
    )
  }
}

export default Playview;