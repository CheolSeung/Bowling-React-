import { observable, action, makeObservable, computed } from "mobx";

class PlayStore {

  constructor() {
    makeObservable(this);
  }

  // 플레이어 수
  @observable
  _pnum = 1;

  get pnum() {
    return this._pnum;
  }

  // 플레이어 추가
  @action
  addPlayer() {
    this._pnumArr = [];

    if (this._pnum > 3) {
      this._pnum = 4;
      alert("최대 인원은 4명입니다.");
      return;
    }
    
    this._pnum++;
  }

  // 플레이어 삭제
  @action
  delPlayer() {
    if (this._pnum < 2) {
      this._pnum = 1
      alert("최소 인원은 1명입니다.")
      return;
    }

    this._pnum--;
  }


  // 플레이어 순서
  @observable
  _playerTurn = 1;
  
  @computed
  get playerTurn() {
    return this._playerTurn;
  }

  // 플레이어
  @observable
  _player = []

  @computed
  get player() {
    return this._player;
  }

  // 프레임 번호
  @observable
  _frames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  @computed
  get frames() {
    return this._frames;
  }

  // 현재 프레임
  @observable
  _currentFrame = 1;

  @computed
  get currentFrame() {
    return this._currentFrame;
  }

  // 홈버튼 클릭시 리셋
  homeReset() {
    this._pnum = 1;
    this._player = [];
    this._playerTurn = 1;
    this._currentFrame = 1;
  }

  // 리셋버튼 클릭시
  @action
  resetBtn() {
    this._playerTurn = 1;
    this._currentFrame = 1;
    for (let i = 0; i < this._pnum; i++) {
      this._player[i].gamecount = 1;
      this._player[i].leftbox = [];
      this._player[i].leftboxView = [];
      this._player[i].rightbox = [];
      this._player[i].rightboxView = [];
      this._player[i].extrabox = 0;
      this._player[i].extraboxView = '';
      this._player[i].frameScore = [];
      this._player[i].frameScoreview = [];  
      this._player[i].roll = 0;          
    }
  }


  // 프레임 인원수 만큼 나오게 하기위해
  @action
  init() {
    this._player = [];

    for (let i = 0; i < this._pnum; i++) {
      this._player.push({
        id: i,
        gamecount: 1,             // roll 초구 후구 정하려고 쓰는거
        leftbox: [],              // 첫구 배열
        leftboxView: [],          // 첫구 뷰
        rightbox: [],             // 두번째구 배열
        rightboxView: [],         // 두번째구 뷰
        extrabox: 0,              // 10프레임 세번째구
        extraboxView: '',         // 10프레임 세번째구 뷰
        frameScore: [],           // 해당프레임 점수
        frameScoreview: [],       // 해당프레임 점수 뷰
        roll: 0,                  // 초구값 담아놓기위함
      });
    }
  }

  // 플레이어 턴
  @action
  turn() {
    if (this._player.length === this._playerTurn) { 
      this._playerTurn = 1;
      this._currentFrame += 1;
    } else {
      this._playerTurn += 1;
    }
  }

  @action
  rollBtn2() {
    let first_rand;
    let second_rand;
    let third_rand;

    // 1프레임
    if (this.currentFrame == 1) {   
      if (this._player[this._playerTurn - 1].gamecount === 1) {  // 1프레임 초구
        first_rand = Math.floor(Math.random() * 11)               // 초구의 랜덤값은 0~10
        this._player[this._playerTurn - 1].roll = first_rand      // 두번째구에서 10-초구 값이 나와야 하므로 변수에 재할당

        this._player[this._playerTurn - 1].leftbox.push(first_rand);

        if (first_rand == 10) {    // 1프레임 초구가 10이라면 (스트라이크)
          this._player[this._playerTurn - 1].leftboxView.push('X');     
          this._player[this._playerTurn - 1].rightbox.push(0);          
          this._player[this._playerTurn - 1].rightboxView.push('');    
          this._player[this._playerTurn - 1].gamecount = 1;           // 다음프레임 초구로 초기화
          
          this._player[this._playerTurn - 1].frameScore.push(10); 
          this._player[this._playerTurn - 1].frameScoreview.push(''); 
          console.log('1프레임이 초구가 10이라면 (스트라이크), ' + 
          this._player[this._playerTurn - 1].roll, second_rand, "현재프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 1]);
          // 플레이어 턴
          this.turn();

        } else {   // 1프레임 초구가 10이 아니라면
          this._player[this._playerTurn - 1].leftboxView.push(first_rand);
          this._player[this._playerTurn - 1].gamecount += 1;
          
          IS_DEV && console.log(
            '1프레임 초구가 10이 아니라면, ' + 
            this._player[this._playerTurn - 1].roll, second_rand, "현재프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 1],
          );

        }

      } else if(this._player[this._playerTurn - 1].gamecount === 2) {   // 1프레임 두번째구
        second_rand = Math.floor(Math.random() * (11 - this._player[this._playerTurn - 1].roll)) // 두번째구 랜덤값은 10 - 초구

        if(this._player[this._playerTurn - 1].roll + second_rand === 10) {   // 1프레임 스페어
          this._player[this._playerTurn - 1].rightbox.push(second_rand);          
          this._player[this._playerTurn - 1].rightboxView.push('/'); 
          this._player[this._playerTurn - 1].frameScore.push(10); 
          this._player[this._playerTurn - 1].frameScoreview.push(''); 
          console.log('1프레임 스페어, ' + 
          this._player[this._playerTurn - 1].roll, second_rand, "현재프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 1]);
        } else {  // 1프레임 두번째구 스페어 아님
          this._player[this._playerTurn - 1].rightbox.push(second_rand);          
          this._player[this._playerTurn - 1].rightboxView.push(second_rand);
          this._player[this._playerTurn - 1].frameScore.push(this._player[this._playerTurn - 1].roll + second_rand); 
          this._player[this._playerTurn - 1].frameScoreview.push(this._player[this._playerTurn - 1].roll + second_rand);  
          console.log('1프레임 두번째구 스페어 못함, ' + 
          this._player[this._playerTurn - 1].roll, second_rand, "현재프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 1]);
        }
        this._player[this._playerTurn - 1].gamecount = 1;     // 다음프레임 초구로 초기화
        
        // 플레이어 턴
        this.turn()
      }
    }

    // 2~9프레임
    else if(this.currentFrame !== 1 && this.currentFrame < 10) { 
      console.log("현재프레임" + this._currentFrame)
      if(this._player[this._playerTurn - 1].leftboxView[this._currentFrame - 2] == 'X') {  // 전프레임이 스트라이크
        if(this._player[this._playerTurn - 1].leftboxView[this._currentFrame - 3] == 'X') {  // 전,전전프레임 스트라이크(더블)
          if(this._player[this._playerTurn - 1].gamecount == 1) {  // 더블 후 초구
            first_rand = Math.floor(Math.random() * 11);               
            this._player[this._playerTurn - 1].roll = first_rand;
            if(first_rand == 10) {  // 더블 후 초구가 스트라이크
              this._player[this._playerTurn - 1].leftbox.push(10);     
              this._player[this._playerTurn - 1].leftboxView.push('X');     
              this._player[this._playerTurn - 1].rightbox.push(0);          
              this._player[this._playerTurn - 1].rightboxView.push('');    
              this._player[this._playerTurn - 1].gamecount = 1;          
              
              if(this._currentFrame == 3) {
                // 전전프레임 frameScoreview 값 수정
                this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3] = 
                20 + (this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3]); 
                this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 3] = (this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3]);

                this._player[this._playerTurn - 1].frameScore.push(10 + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
                this._player[this._playerTurn - 1].frameScoreview.push('');
                console.log('더블 후 초구가 스트라이크 (1,2프레임 더블일때만 들어옴) ');

              } else {
                // 전전프레임 frameScoreview 값 수정
                this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3] = 
                30 + (this._player[this._playerTurn - 1].frameScore[this.currentFrame - 4]); 
                this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 3] = (this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3]);
                
                this._player[this._playerTurn - 1].frameScore.push(10 + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
                this._player[this._playerTurn - 1].frameScoreview.push('');
                console.log('더블 후 초구가 스트라이크, ' + 
                this._player[this._playerTurn - 1].roll, second_rand, "전프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
              }
              // 플레이어 턴
              this.turn()

            } else { // 더블 후 초구가 스트라이크 아님
              this._player[this._playerTurn - 1].leftbox.push(first_rand);     
              this._player[this._playerTurn - 1].leftboxView.push(first_rand);
              this._player[this._playerTurn - 1].gamecount += 1;

              if(this._currentFrame == 3) {
                // 전전프레임 frameScoreview 값 수정
                const change_score = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3] = 
                (this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3]) + 10 + (this._player[this._playerTurn - 1].leftbox[this.currentFrame - 1]); 
                this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 3] = change_score;

                this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3] + 10;
                this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 2] = '';
                console.log('더블 후 초구가 스트라이크 아님(3프레임 한정), ' + 
                this._player[this._playerTurn - 1].roll, second_rand, "전프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
              } else {
                // 전전프레임 frameScoreview 값 수정
                const change_score = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3] = 
                (this._player[this._playerTurn - 1].frameScore[this.currentFrame - 4]) + 20 + (this._player[this._playerTurn - 1].leftbox[this.currentFrame - 1]); 
                this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 3] = change_score;
  
                this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] = 
                (this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3]) + 10;
                this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 2] = '';
                console.log('더블 후 초구가 스트라이크 아님, ' + 
                this._player[this._playerTurn - 1].roll, second_rand, "전프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
              }
            }

          } else if(this._player[this._playerTurn - 1].gamecount == 2) {  // 더블 후 두번째 구
            second_rand = Math.floor(Math.random() * (11 - this._player[this._playerTurn - 1].roll)) // 두번째구 랜덤값은 10 - 초구
            if(this._player[this._playerTurn - 1].roll + second_rand === 10) {  // 스페어
              this._player[this._playerTurn - 1].rightbox.push(second_rand)
              this._player[this._playerTurn - 1].rightboxView.push('/')
              this._player[this._playerTurn - 1].gamecount = 1;

              // 전전프레임 frameScoreview 값 수정
              const change_score = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] = 
              (this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3]) + 20; 
              this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 2] = change_score; 

              this._player[this._playerTurn - 1].frameScore.push(10 + this._player[this._playerTurn -1].frameScore[this._currentFrame -2]);  
              this._player[this._playerTurn - 1].frameScoreview.push('');
              console.log('더블 후 두번째구 스페어, ' + 
              this._player[this._playerTurn - 1].roll, second_rand, "전프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);

            } else {  // 스페어 아님
              this._player[this._playerTurn - 1].rightbox.push(second_rand);
              this._player[this._playerTurn - 1].rightboxView.push(second_rand);
              this._player[this._playerTurn - 1].gamecount = 1;

              const change_score = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] = 
              (this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]) + 
              (this._player[this._playerTurn -1].leftbox[this.currentFrame - 1]) + (this._player[this._playerTurn -1].rightbox[this.currentFrame - 1]); 
              this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 2] = change_score; 
              
              this._player[this._playerTurn - 1].frameScore.push(this._player[this._playerTurn -1].leftbox[this.currentFrame - 1] + this._player[this._playerTurn -1].rightbox[this.currentFrame - 1] 
                + this._player[this._playerTurn -1].frameScore[this._currentFrame -2]);
              this._player[this._playerTurn - 1].frameScoreview.push(this._player[this._playerTurn -1].leftbox[this.currentFrame - 1] + this._player[this._playerTurn -1].rightbox[this.currentFrame - 1] 
                + this._player[this._playerTurn -1].frameScore[this._currentFrame -2]);
              
                console.log('더블 후 두번째구 스페어 못함, ' + 
              this._player[this._playerTurn - 1].roll, second_rand, "전프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
              console.log("현프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 1]);
            }
            // 플레이어 턴
            this.turn()
          }
        } 
        
        //전프레임만 스트라이크
        else if(this._player[this._playerTurn - 1].leftboxView[this.currentFrame - 2] == 'X' || this._player[this._playerTurn - 1].leftboxView[this.currentFrame - 3] !== 'X') {
          if(this._player[this._playerTurn - 1].gamecount == 1) {  // 전프레임만 스트라이크일 때 초구
            // first_rand = 10;
            first_rand = Math.floor(Math.random() * 11);
            this._player[this._playerTurn - 1].roll = first_rand;

            if(first_rand == 10) { // 전프레임만 스트라이크일때 현프레임 초구 스트라이크
              this._player[this._playerTurn - 1].leftbox.push(10);
              this._player[this._playerTurn - 1].leftboxView.push('X');
              this._player[this._playerTurn - 1].rightbox.push(0);
              this._player[this._playerTurn - 1].rightboxView.push('');
              
              this._player[this._playerTurn - 1].frameScore.push(10 + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
              this._player[this._playerTurn - 1].frameScoreview.push('');
              
              this._player[this._playerTurn - 1].gamecount = 1;
              // 플레이어 턴
              this.turn()
              console.log('전프레임만 스트라이크일때 현프레임 초구 스트라이크, ' + 
              this._player[this._playerTurn - 1].roll, second_rand, "전프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
              
            } else {  // 전프레임만 스트라이크일때 현프레임 초구 스트라이크 못함
              this._player[this._playerTurn - 1].leftbox.push(first_rand);
              this._player[this._playerTurn - 1].leftboxView.push(first_rand);
              this._player[this._playerTurn - 1].gamecount += 1;
              console.log('전프레임만 스트라이크일때 현프레임 초구 스트라이크 못함, ' + 
              this._player[this._playerTurn - 1].roll, second_rand, "전프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
            }
          } 
          else if(this._player[this._playerTurn - 1].gamecount == 2) {  // 전프레임만 스트라이크일 때 두번째 구
            second_rand = Math.floor(Math.random() * (11 - this._player[this._playerTurn - 1].roll))
            if(this._player[this._playerTurn - 1].roll + second_rand == 10) {   // 스페어
              this._player[this._playerTurn - 1].rightbox.push(second_rand);
              this._player[this._playerTurn - 1].rightboxView.push('/');
              this._player[this._playerTurn - 1].gamecount = 1;

              // 전프레임 frameScoreview 값 수정
              const change_score = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] = 
              this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] + this._player[this._playerTurn - 1].roll + second_rand;
              this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 2] = change_score;

              this._player[this.playerTurn - 1].frameScore.push(10 + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
              this._player[this.playerTurn - 1].frameScoreview.push('');
              console.log('전프레임만 스트라이크일 때 두번째 구 스페어, ' + 
              this._player[this._playerTurn - 1].roll, second_rand, "현재프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 1]);
              
            } else {   // 스페어 아님
              this._player[this._playerTurn - 1].rightbox.push(second_rand);
              this._player[this._playerTurn - 1].rightboxView.push(second_rand);
              this._player[this._playerTurn - 1].gamecount = 1;

              if(this._currentFrame == 2) {
                // 전프레임 frameScoreview 값 수정
                const change_score = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] = 
                (this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]) + this._player[this._playerTurn - 1].leftbox[this._currentFrame - 1] + second_rand;
                this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 2] = change_score;

                this._player[this.playerTurn - 1].frameScore.push(this._player[this._playerTurn - 1].roll 
                  + second_rand + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
                this._player[this.playerTurn - 1].frameScoreview.push(this._player[this._playerTurn - 1].roll 
                + second_rand + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
  
                console.log('전프레임만 스트라이크일 때 두번째 구 스페어 못함(2프레임일때 한정), ' + 
                this._player[this._playerTurn - 1].roll, second_rand, "현재프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 1]);
                
              } else {
                // 전프레임 frameScoreview 값 수정
                const change_score = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] = 
                (this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3]) + 10 + this._player[this._playerTurn - 1].leftbox[this._currentFrame - 1] + second_rand;
                this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 2] = change_score;
  
                this._player[this.playerTurn - 1].frameScore.push(this._player[this._playerTurn - 1].roll 
                  + second_rand + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
                this._player[this.playerTurn - 1].frameScoreview.push(this._player[this._playerTurn - 1].roll 
                  + second_rand + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
  
                console.log('전프레임만 스트라이크일 때 두번째 구 스페어 못함, ' + 
                this._player[this._playerTurn - 1].roll, second_rand, "현재프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 1]);
              }
            }
            // 플레이어 턴
            this.turn()
          }
        }
      } 
      
      else if(this._player[this._playerTurn - 1].leftboxView[this._currentFrame - 2] !== 'X') {  // 전프레임 스트라이크 아님
        if(this._player[this._playerTurn - 1].rightboxView[this._currentFrame - 2] == '/') {  // 전프레임 스페어일 때
          if(this._player[this._playerTurn - 1].gamecount == 1) {    // 전프레임 스페어일 때 초구
            first_rand = Math.floor(Math.random() * 11);
            this._player[this._playerTurn - 1].roll = first_rand;

            if(first_rand == 10) {   // 전프레임 스페어일 때 초구 스트라이크
              this._player[this._playerTurn - 1].leftbox.push(10);
              this._player[this._playerTurn - 1].leftboxView.push('X');
              this._player[this._playerTurn - 1].rightbox.push(0);
              this._player[this._playerTurn - 1].rightboxView.push('');
              this._player[this._playerTurn - 1].gamecount = 1;
              
              // 전프레임 frameScoreview 값 수정
              const change_score = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] + 10;
              this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 2] = change_score;
              
              this._player[this._playerTurn - 1].frameScore.push(this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] + 10);
              this._player[this._playerTurn - 1].frameScoreview.push('');
              console.log("전프레임 스페어일 때 현프레임 초구 스트라이크, " + 
                this._player[this._playerTurn - 1].roll, second_rand, "현재프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 1])
              // 플레이어 턴
              this.turn()

            } else {    // 전프레임 스페어일 때 초구 스트라이크 아님
              this._player[this._playerTurn -1].leftbox.push(first_rand);
              this._player[this._playerTurn -1].leftboxView.push(first_rand);
              this._player[this._playerTurn -1].gamecount += 1;

              if(this._currentFrame == 2) {
                // 전프레임 frameScoreview 값 수정
                const change_score = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] = 
                this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] + this._player[this._playerTurn - 1].leftbox[this.currentFrame -1];
                this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 2] = change_score;              
                console.log("전프레임 스페어일 때 초구 스트라이크 아님, " + 
                this._player[this._playerTurn - 1].roll, second_rand, "전프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2])
              } else {
                // 전프레임 frameScoreview 값 수정
                const change_score = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] = 
                this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3] + 10 + this._player[this._playerTurn - 1].leftbox[this.currentFrame - 1];
                this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 2] = change_score;              
                console.log("전프레임 스페어일 때 초구 스트라이크 아님, " + 
                this._player[this._playerTurn - 1].roll, second_rand, "전프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2])
              }
            }
          } else if(this._player[this._playerTurn - 1].gamecount == 2) {    // 전프레임 스페어일 때 두번째 구
            second_rand = Math.floor(Math.random() * (11 - this._player[this._playerTurn - 1].roll))
            if(this._player[this._playerTurn - 1].roll + second_rand == 10) {    // 두번째 구 스페어
              
              this._player[this._playerTurn - 1].rightbox.push(second_rand);
              this._player[this._playerTurn - 1].rightboxView.push('/');
              this._player[this._playerTurn - 1].gamecount = 1;

              this._player[this.playerTurn - 1].frameScore.push(10 + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
              this._player[this.playerTurn - 1].frameScoreview.push('');
              console.log("전프레임 스페어일 때 현프레임 스페어, " + 
              this._player[this._playerTurn - 1].roll, second_rand, "현재프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 1])
            } else {    // 두번째 구 스페어못함
              this._player[this._playerTurn - 1].rightbox.push(second_rand);
              this._player[this._playerTurn - 1].rightboxView.push(second_rand);
              this._player[this._playerTurn - 1].gamecount = 1;

              this._player[this.playerTurn - 1].frameScore.push(this._player[this._playerTurn - 1].roll 
                + second_rand + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
              this._player[this.playerTurn - 1].frameScoreview.push(this._player[this._playerTurn - 1].roll 
                + second_rand + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
              console.log('전프레임 스페어일 때 현프레임 스페어 못함, ' + 
              this._player[this._playerTurn - 1].roll, second_rand, "현재프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 1]);
            }
            // 플레이어 턴
            this.turn();
          }
        } 
        else {  // 전프레임 스페어 아닐 때
          if (this._player[this._playerTurn - 1].gamecount == 1) {   // 전프레임 스페어,스트라이크 아닐 때 초구
            first_rand = Math.floor(Math.random() * 11);
            this._player[this._playerTurn - 1].roll = first_rand;
            if(first_rand == 10) {   // 전프레임 아무것도 아닐 때 초구 스트라이크
              this._player[this._playerTurn - 1].leftbox.push(first_rand);
              this._player[this._playerTurn - 1].leftboxView.push('X');
              this._player[this._playerTurn - 1].rightbox.push(0);
              this._player[this._playerTurn - 1].rightboxView.push('');
              this._player[this._playerTurn - 1].gamecount = 1;

              this._player[this._playerTurn - 1].frameScore.push(10 + this._player[this._playerTurn -1].frameScore[this.currentFrame - 2]);
              this._player[this._playerTurn - 1].frameScoreview.push('');
              console.log("전프레임 아무 것도 아닐 때 초구 스트라이크, " + 
              this._player[this._playerTurn - 1].roll, second_rand, "현재프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 1])
              // 플레이어 턴
              this.turn();
            } else {   // 전프레임 아무 것도 아닐 때 초구 스트라이크 아님 
              this._player[this._playerTurn - 1].leftbox.push(first_rand);
              this._player[this._playerTurn - 1].leftboxView.push(first_rand);
              this._player[this._playerTurn - 1].gamecount += 1;
              console.log("전프레임 아무 것도 아닐 때 초구 스트라이크 아님, " + 
              this._player[this._playerTurn - 1].roll, second_rand, "전프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
            }
          } 
          
          else if(this._player[this._playerTurn - 1].gamecount == 2) {   // 전프레임 스페어,스트라이크 아닐 때 두번째 구
            second_rand = Math.floor(Math.random() * (11 - this._player[this._playerTurn - 1].roll))
            if(this._player[this._playerTurn - 1].roll + second_rand == 10) {   // 전프레임 아무 것도 아닐 때 두번째 구 스페어
              this._player[this._playerTurn - 1].rightbox.push(second_rand);
              this._player[this._playerTurn - 1].rightboxView.push('/');
              this._player[this._playerTurn - 1].gamecount = 1;

              this._player[this.playerTurn - 1].frameScore.push(10 + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
              this._player[this.playerTurn - 1].frameScoreview.push('');
              console.log("전프레임 아무것도 아닐 때 현프레임 스페어, " + 
              this._player[this._playerTurn - 1].roll, second_rand, "현재프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 1]);

            } else {   // 전프레임 아무 것도 아닐 때 두번째 구 스페어 아님
              this._player[this._playerTurn - 1].rightbox.push(second_rand);
              this._player[this._playerTurn - 1].rightboxView.push(second_rand);
              this._player[this._playerTurn - 1].gamecount = 1;

              this._player[this.playerTurn - 1].frameScore.push(this._player[this._playerTurn - 1].roll 
              + second_rand + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
              this._player[this.playerTurn - 1].frameScoreview.push(this._player[this._playerTurn - 1].roll 
              + second_rand + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
              console.log('전프레임 아무것도 아닐 때 현프레임 스페어 못함, ' 
              + this._player[this._playerTurn - 1].roll, second_rand, "현재프레임 점수: " + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 1]);
            }
            // 플레이어 턴
            this.turn();
          }
        }
      }
    

      
    // 10프레임
    } else if(this.currentFrame === 10) {
      if(this._player[this._playerTurn - 1].gamecount == 1) {  // 10프레임 초구
        first_rand = Math.floor(Math.random() * 11);
        this._player[this._playerTurn - 1].roll = first_rand;

         // 전프레임 스트라이크2개
        if(this._player[this._playerTurn - 1].leftboxView[this._currentFrame - 3] == 'X' && this._player[this._playerTurn - 1].leftboxView[this._currentFrame - 2] == 'X') {
          if(first_rand == 10) {  //전에 스트라이크 2개일때 초구 스트라이크
            this._player[this._playerTurn - 1].leftbox.push(10);
            this._player[this._playerTurn - 1].leftboxView.push('X');
            this._player[this._playerTurn - 1].gamecount += 1;
            // 전프레임 값 수정
            this._player[this.playerTurn - 1].frameScore[this._currentFrame - 3] = this._player[this._playerTurn - 1].frameScore[this._currentFrame - 3] + 20;
            this._player[this.playerTurn - 1].frameScoreview[this._currentFrame - 3] = this._player[this._playerTurn - 1].frameScore[this._currentFrame - 3] + 20;
            console.log("전에 스트라이크2개일때 10프레임 초구 스트라이크" + first_rand);
          } else {  //전에 스트라이크 2개일때 초구 스트라이크 아님
            this._player[this._playerTurn - 1].leftbox.push(first_rand);
            this._player[this._playerTurn - 1].leftboxView.push(first_rand);
            this._player[this._playerTurn - 1].gamecount += 1;
            // 전프레임 값 수정
            this._player[this.playerTurn - 1].frameScore[this._currentFrame - 3] = this._player[this._playerTurn - 1].frameScore[this._currentFrame - 4] + 20 + first_rand;
            this._player[this.playerTurn - 1].frameScoreview[this._currentFrame - 3] = this._player[this._playerTurn - 1].frameScore[this._currentFrame - 4] + 20 + first_rand;
            console.log("전에 스트라이크2개일때 10프레임 초구 아님" + first_rand);
          }


        // 전프레임 스트라이크1개
        } else if(this._player[this._playerTurn - 1].leftboxView[this._currentFrame - 3] !== 'X' && this._player[this._playerTurn - 1].leftboxView[this._currentFrame - 2] == 'X') { 
          if(first_rand == 10) {    //전에 스트라이크 1개일때 초구 스트라이크
            this._player[this._playerTurn - 1].leftbox.push(10);
            this._player[this._playerTurn - 1].leftboxView.push('X');
            this._player[this._playerTurn - 1].gamecount += 1;
            console.log("전에 스트라이크 1개일때 10프레임 초구 스트라이크" + first_rand);
          } else {   //전에 스트라이크 1개일때 초구 스트라이크 아님
            this._player[this._playerTurn - 1].leftbox.push(first_rand);
            this._player[this._playerTurn - 1].leftboxView.push(first_rand);
            this._player[this._playerTurn - 1].gamecount += 1;
            console.log("전에 스트라이크 1개일때 10프레임 초구 스트라이크 아님" + first_rand);
          }


        } else if(this._player[this._playerTurn - 1].rightboxView[this._currentFrame - 2] == '/') {  //전프레임 스페어
          if(first_rand == 10) {  //전프레임 스페어일때 초구 스트라이크
            this._player[this._playerTurn - 1].leftbox.push(10);
            this._player[this._playerTurn - 1].leftboxView.push('X');
            this._player[this._playerTurn - 1].gamecount += 1;
            // 전프레임 값 수정
            this._player[this.playerTurn - 1].frameScore[this._currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this._currentFrame - 3] + 20;
            this._player[this.playerTurn - 1].frameScoreview[this._currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this._currentFrame - 3] + 20;
            console.log("전프레임 스페어일 때 10프레임 초구 스트라이크" + first_rand);
          } else {   //전프레임 스페어일때 초구 스트라이크 아님
            this._player[this._playerTurn - 1].leftbox.push(first_rand);
            this._player[this._playerTurn - 1].leftboxView.push(first_rand);
            this._player[this._playerTurn - 1].gamecount += 1;
            // 전프레임 값 수정
            this._player[this.playerTurn - 1].frameScore[this._currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this._currentFrame - 3] + 10 + first_rand;
            this._player[this.playerTurn - 1].frameScoreview[this._currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this._currentFrame - 3] + 10 + first_rand;
            console.log("전프레임 스페어일 때 10프레임 초구 스트라이크 아님" + first_rand);
          }


        } else {  //전프레임 스트라이크,스페어 아님
          if(first_rand == 10) {   // 초구 스트라이크
            this._player[this._playerTurn - 1].leftbox.push(10);
            this._player[this._playerTurn - 1].leftboxView.push('X');
            this._player[this._playerTurn - 1].gamecount += 1;
            console.log("10프레임 초구 스트라이크");
          } else {   // 초구 스트라이크 아님
            this._player[this._playerTurn - 1].leftbox.push(first_rand);
            this._player[this._playerTurn - 1].leftboxView.push(first_rand);
            this._player[this._playerTurn - 1].gamecount += 1;
            console.log("10프레임 초구 랜덤점수");
          }
        }


      // 10프레임 두번째 구 --------------------------------------------------------------------------------------------------------------------------------------------- 
      } else if(this._player[this._playerTurn - 1].gamecount == 2) { 
        if(this._player[this._playerTurn - 1].leftboxView[this._currentFrame - 2] == 'X') {   // 전프레임 스트라이크
          if(this._player[this._playerTurn - 1].roll == 10) { 
            second_rand = Math.floor(Math.random() * 11);
            if(second_rand == 10) {    // 전프레임 스트라이크, 10프레임 초구 스트라이크 일때 두번째구 스트라이크
              this._player[this._playerTurn - 1].rightbox.push(10);
              this._player[this._playerTurn - 1].rightboxView.push('X');
              this._player[this._playerTurn - 1].gamecount += 1;
              // 전프레임 값 수정
              this._player[this.playerTurn - 1].frameScore[this._currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this._currentFrame - 3] + 30;
              this._player[this.playerTurn - 1].frameScoreview[this._currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this._currentFrame - 3] + 30;
              console.log("전프레임 스트라이크, 10프레임 초구 스트라이크 일때 두번째구 스트라이크" + this._player[this._playerTurn - 1].roll, second_rand);
            } else {    // 전프레임 스트라이크, 10프레임 초구 스트라이크 일때 두번째구 스트라이크 아님
              this._player[this._playerTurn - 1].rightbox.push(second_rand);
              this._player[this._playerTurn - 1].rightboxView.push(second_rand);
              this._player[this._playerTurn - 1].gamecount += 1;
              // 전프레임 값 수정
              this._player[this.playerTurn - 1].frameScore[this._currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this._currentFrame - 3] + 20 + second_rand;
              this._player[this.playerTurn - 1].frameScoreview[this._currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this._currentFrame - 3] + 20 + second_rand;
              console.log("전프레임 스트라이크, 10프레임 초구 스트라이크 일때 두번째구 스트라이크 아님" + this._player[this._playerTurn - 1].roll, second_rand);
            }

          } else {  // 전프레임 스트라이크, 10프레임 초구 랜덤점수
            second_rand = Math.floor(Math.random() * (11 - this._player[this._playerTurn - 1].roll));
            if (this._player[this._playerTurn - 1].roll + second_rand == 10) {   // 전프레임 스트라이크, 10프레임 초구 랜덤점수일때 두번째구 스페어
              this._player[this._playerTurn - 1].rightbox.push(second_rand);
              this._player[this._playerTurn - 1].rightboxView.push('/');
              this._player[this._playerTurn - 1].gamecount += 1;
              // 전프레임 값 수정
              this._player[this.playerTurn - 1].frameScore[this._currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this._currentFrame - 3] + 20;
              this._player[this.playerTurn - 1].frameScoreview[this._currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this._currentFrame - 3] + 20;
              console.log("전프레임 스트라이크, 10프레임 초구 랜덤점수일때 두번째구 스페어" + this._player[this._playerTurn - 1].roll, second_rand);

            } else {  // 전프레임 스트라이크, 10프레임 초구 랜덤점수일때 두번째구 스페어 아님
              this._player[this._playerTurn - 1].rightbox.push(second_rand);
              this._player[this._playerTurn - 1].rightboxView.push(second_rand);
              this._player[this._playerTurn - 1].gamecount = 1;
              // 전프레임 값 수정
              const change_score = this._player[this.playerTurn - 1].frameScore[this._currentFrame - 2] = 
              this._player[this._playerTurn - 1].frameScore[this._currentFrame - 3] + 10 + this._player[this._playerTurn - 1].roll + second_rand;
              this._player[this.playerTurn - 1].frameScoreview[this._currentFrame - 2] = change_score;

              this._player[this._playerTurn - 1].frameScore.push(this._player[this._playerTurn - 1].frameScore[this._currentFrame - 2] + this._player[this._playerTurn - 1].roll + second_rand);
              this._player[this._playerTurn - 1].frameScoreview.push(this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1]);                                                                                         
              console.log("전프레임 스트라이크, 10프레임 초구 랜덤점수일때 두번째구 스페어 아님" + this._player[this._playerTurn - 1].roll, second_rand);
              this.turn();
            }
          }


        } else {  //전프레임 아무것도 아닐때 두번째구
          if(this._player[this._playerTurn - 1].leftboxView[this._currentFrame - 1] == 'X') {   // 10프레임 초구가 스트라이크
            second_rand = Math.floor(Math.random() * 11);
            if(second_rand == 10) {  // 10프레임 두번째 구 스트라이크
              this._player[this._playerTurn - 1].rightbox.push(10);
              this._player[this._playerTurn - 1].rightboxView.push('X');
              this._player[this._playerTurn - 1].gamecount += 1;
              console.log("10프레임 두번째구 스트라이크" + this._player[this._playerTurn - 1].leftbox[this._currentFrame - 1], second_rand);
            } else {   // 10프레임 두번째 구 스트라이크 아님
              this._player[this._playerTurn - 1].rightbox.push(second_rand);
              this._player[this._playerTurn - 1].rightboxView.push(second_rand);
              this._player[this._playerTurn - 1].gamecount += 1;
              console.log("10프레임 두번째구 스트라이크 아님" + this._player[this._playerTurn - 1].leftbox[this._currentFrame - 1], second_rand);
            }

          } else {   //10프레임 초구 랜덤점수
            second_rand = Math.floor(Math.random() * (11 - (this._player[this._playerTurn - 1].leftbox[this._currentFrame - 1])));
            if((this._player[this._playerTurn - 1].leftbox[this._currentFrame - 1]) + second_rand == 10) {  // 10프레임 두번째구 스페어
              this._player[this._playerTurn - 1].rightbox.push(second_rand);
              this._player[this._playerTurn - 1].rightboxView.push('/');
              this._player[this._playerTurn - 1].gamecount += 1;
              console.log("10프레임 두번째구 스페어" + this._player[this._playerTurn - 1].roll, second_rand);
            } else {   // 10프레임 두번째구 스페어아님
              this._player[this._playerTurn - 1].rightbox.push(second_rand);
              this._player[this._playerTurn - 1].rightboxView.push(second_rand);
              this._player[this._playerTurn - 1].gamecount = 1;
              
              this._player[this._playerTurn - 1].frameScore.push(this._player[this._playerTurn - 1].frameScore[this._currentFrame - 2] + 
                                                                 this._player[this._playerTurn - 1].leftbox[this._currentFrame - 1] + second_rand);
              this._player[this._playerTurn - 1].frameScoreview.push(this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1]);
              console.log("10프레임 두번째구 스페어아님" + this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1]);
              this.turn(); // 현재 플레이어 게임 종료
            }
          }
        }


      // 10프레임 세번째 구 --------------------------------------------------------------------------------------------------------------------------------------------- 
      } else if(this._player[this._playerTurn - 1].gamecount == 3) {
        console.log("3번째구 들어옴");
        if(this._player[this._playerTurn - 1].leftboxView[this.currentFrame - 1] == 'X') {   // 10프레임 초구 스트라이크
          if(this._player[this._playerTurn - 1].rightboxView[this._currentFrame - 1] == 'X') {  // 10프레임 두번째구도 스트라이크
            third_rand = Math.floor(Math.random() * 11);
            if(third_rand == 10) {  // 10프레임 1,2,3 다 스트라이크
              console.log("10프레임 1,2,3 다 스트라이크");
              this._player[this._playerTurn - 1].extrabox = third_rand;
              this._player[this._playerTurn - 1].extraboxView = 'X';
  
              // 최종점수
              this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1] = 
              this._player[this._playerTurn - 1].frameScore[this._currentFrame - 2] + 20 + third_rand;
              this._player[this._playerTurn - 1].frameScoreview[this._currentFrame - 1] = 
              this._player[this._playerTurn - 1].frameScore[this._currentFrame - 2] + 20 + third_rand;
              
              // 플레이어 턴
              this.turn();

            } else {  // 10프레임 1,2 스트라이크, 3은 랜덤점수
              console.log("10프레임 1,2 스트라이크, 3번째는 스트라이크 아님");
              this._player[this._playerTurn - 1].extrabox = third_rand;
              this._player[this._playerTurn - 1].extraboxView = third_rand;
  
              // 최종점수
              this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1] = 
              this._player[this._playerTurn - 1].frameScore[this._currentFrame - 2] + 20 + third_rand;
              this._player[this._playerTurn - 1].frameScoreview[this._currentFrame - 1] = 
              this._player[this._playerTurn - 1].frameScore[this._currentFrame - 2] + 20 + third_rand;
              
              // 플레이어 턴
              this.turn();
            }

          } else {   // 10프레임 초구 스트라이크, 두번째구 스트라이크 아님
            third_rand = Math.floor(Math.random() * (11 - this._player[this._playerTurn - 1].rightbox[this._currentFrame - 1]));
            if(this._player[this._playerTurn - 1].rightbox[this._currentFrame - 1] + third_rand == 10) {  // 3번째구 스페어
              console.log("10프레임 초구 스트라이크, 두번째 스트라이크 아님, 세번째 스페어");
              this._player[this._playerTurn - 1].extrabox = third_rand;
              this._player[this._playerTurn - 1].extraboxView = '/'

              // 최종점수
              this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1] = 
              this._player[this._playerTurn - 1].frameScore[this._currentFrame - 2] + 20;
              this._player[this._playerTurn - 1].frameScoreview[this._currentFrame - 1] = 
              this._player[this._playerTurn - 1].frameScore[this._currentFrame - 2] + 20;

              // 플레이어 턴
              this.turn();

            } else {  // 3번째구 스페어 아님
              console.log("10프레임 초구 스트라이크, 두번째 스트라이크 아님, 세번째 스페어아님");
              this._player[this._playerTurn - 1].extrabox = third_rand;
              this._player[this._playerTurn - 1].extraboxView = third_rand;

              // 최종점수
              this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1] = this._player[this._playerTurn - 1].frameScore[this._currentFrame - 2] 
              + 10 + this._player[this._playerTurn - 1].rightbox[this._currentFrame - 1] + third_rand;
              this._player[this._playerTurn - 1].frameScoreview[this._currentFrame - 1] = this._player[this._playerTurn - 1].frameScore[this._currentFrame - 2] 
              + 10 + this._player[this._playerTurn - 1].rightbox[this._currentFrame - 1] + third_rand;

              // 플레이어 턴
              this.turn();
            }

          }
        } else {    // 10프레임 초구 스트라이크 아님
          if(this._player[this._playerTurn - 1].rightboxView[this._currentFrame - 1] == '/') {  // 10프레임 두번째구 스페어
            third_rand = Math.floor(Math.random() * 11);

            if (third_rand == 10) {  // 10프레임 3번째구 스트라이크
              console.log("10프레임 초구 스트라이크 아님, 두번째구 스페어, 3번째 스트라이크");
              this._player[this._playerTurn - 1].extrabox = third_rand;
              this._player[this._playerTurn - 1].extraboxView = 'X';
              
              // 최종점수
              this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1] = 
                this._player[this._playerTurn - 1].frameScore[this._currentFrame - 2] + 20;
              this._player[this._playerTurn - 1].frameScoreview[this._currentFrame - 1] = 
                this._player[this._playerTurn - 1].frameScore[this._currentFrame - 2] + 20;
              
              // 플레이어 턴
              this.turn();

            } else {  // 10프레임 3번째구 랜덤점수
              console.log("10프레임 초구 스트라이크 아님, 두번째구 스페어, 3번째 스트라이크 아님");
              this._player[this._playerTurn - 1].extrabox = third_rand;
              this._player[this._playerTurn - 1].extraboxView = third_rand;
              
              // 최종점수
              this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1] = 
                this._player[this._playerTurn - 1].frameScore[this._currentFrame - 2] + 10 + third_rand;
              this._player[this._playerTurn - 1].frameScoreview[this._currentFrame - 1] = 
                this._player[this._playerTurn - 1].frameScore[this._currentFrame - 2] + 10 + third_rand;

              //플레이어 턴
              this.turn();
            }
          }
        }
      }
    }
  }


  // 스트라이크 버튼에서 초구 공통으로 들어가는 부분
  @action
  ball_1st() {
    this._player[this._playerTurn - 1].leftbox.push(10);
    this._player[this._playerTurn - 1].leftboxView.push('X');
    this._player[this._playerTurn - 1].rightbox.push(0);
    this._player[this._playerTurn - 1].rightboxView.push('');
    this._player[this._playerTurn - 1].gamecount = 1;
  }

  
  // 스트라이크 버튼
  @action
  strikeBtn2() {
    let second_rand;
    // 1프레임
    if(this.currentFrame == 1) {  
      if(this._player[this._playerTurn - 1].gamecount === 1) {  // 초구
        
        this.ball_1st(); // 초구에 들어갈 값 함수

        this._player[this._playerTurn - 1].frameScore.push(10);
        this._player[this._playerTurn - 1].frameScoreview.push('');
        console.log("1프레임 초구" + this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1]);
        
        this.turn();
        
      } else if(this._player[this._playerTurn - 1].gamecount === 2) {  // 후구
        // 1프레임 후구 = 1프레임 초구값 뺀 값
        second_rand = 10 - (this._player[this._playerTurn - 1].leftbox[0]);
        
        this._player[this._playerTurn - 1].rightbox.push(second_rand);
        this._player[this._playerTurn - 1].rightboxView.push('/');
        this._player[this._playerTurn - 1].isStrike = false;
        // this._player[this._playerTurn - 1].strike += 1;
        this._player[this._playerTurn - 1].isSpare = true;
        this._player[this._playerTurn - 1].gamecount = 1;
        
        this._player[this._playerTurn - 1].frameScore.push(10);
        this._player[this._playerTurn - 1].frameScoreview.push('');
        console.log("1프레임 후구" + this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1]);

        this.turn();
      }



    // 2~9프레임
    } else if(this.currentFrame !== 1 && this.currentFrame < 10) {   
      if(this._player[this._playerTurn - 1].gamecount === 1) {   // 초구
        // 더블 후 스트라이크
        if(this._player[this._playerTurn - 1].leftboxView[this._currentFrame - 3] == 'X' && this._player[this._playerTurn - 1].leftboxView[this._currentFrame - 2] == 'X') {
          
          this.ball_1st(); // 초구에 들어갈 값 함수
  
          if(this._currentFrame == 3) {
            // 전전프레임 값 수정
            this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3] = 
            20 + (this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3]); 
            this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 3] = (this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3]);
            
            this._player[this._playerTurn - 1].frameScore.push(10 + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
            this._player[this._playerTurn - 1].frameScoreview.push('');
            console.log("2~9프레임 초구 스트라이크버튼(1,2프레임 더블일때만 들어옴)");

          } else {
            // 전전프레임 값 수정
            this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3] = 
            30 + (this._player[this._playerTurn - 1].frameScore[this.currentFrame - 4]); 
            this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 3] = (this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3]);
            console.log(this._player[this.playerTurn - 1].frameScore[this.currentFrame - 3]);
            
            this._player[this._playerTurn - 1].frameScore.push(10 + this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2]);
            this._player[this._playerTurn - 1].frameScoreview.push('');
            console.log("2~9프레임 초구 전프레임 더블" + this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1]);
          }
          
          this.turn();


        // 전프레임 스트라이크
        } else if(this._player[this._playerTurn - 1].leftboxView[this._currentFrame - 2] == 'X') {

          this.ball_1st(); // 초구에 들어갈 값 함수정의
            
          if(this._currentFrame == 2) {
            // 전프레임 값 수정
            // this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] + 10;
  
            this._player[this._playerTurn - 1].frameScore.push(this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] + 10);
            this._player[this._playerTurn - 1].frameScoreview.push('');
            console.log("2프레임에서 1프레임 스트라이크일때만 들어옴(스트라이크버튼)");

          } else {
            // 전프레임 값 수정
            this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] + 10;
              
            this._player[this._playerTurn - 1].frameScore.push(this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] + 10);
            this._player[this._playerTurn - 1].frameScoreview.push('');
            console.log("2~9프레임 초구 전프레임 스트라이크" + this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1]);
          }
          this.turn();
          

        // 전프레임 스페어
        } else if(this._player[this._playerTurn - 1].rightboxView[this._currentFrame - 2] == '/') {

          this.ball_1st(); // 초구에 들어갈 값 함수

          if(this.currentFrame == 2) {
            // 전프레임 값 수정
            this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] + 10;
            this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2];
  
            this._player[this._playerTurn - 1].frameScore.push(this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] + 10);
            this._player[this._playerTurn - 1].frameScoreview.push('');
            console.log("2~9프레임 초구 전프레임 스페어(2프레임한정)" + this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1])
          } else {
            // 전프레임 값 수정
            this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3] + 20;
            this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2];
  
            this._player[this._playerTurn - 1].frameScore.push(this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] + 10);
            this._player[this._playerTurn - 1].frameScoreview.push('');
            console.log("2~9프레임 초구 전프레임 스페어" + this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1])
          }

          this.turn();

        // 전프레임 아무것도 아님
        } else {
          this.ball_1st();  // 초구에 들어갈 값 함수

          this._player[this._playerTurn - 1].frameScore.push(this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] + 10);
          this._player[this._playerTurn - 1].frameScoreview.push('');
          console.log("2~9프레임 초구 전프레임 아무것도아님" + this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1]);

          this.turn();
        }


      } else if(this._player[this._playerTurn - 1].gamecount === 2) {   // 후구
        if(this._player[this._playerTurn - 1].leftboxView[this._currentFrame - 2] == 'X') {  // 전프레임 스트라이크
          second_rand = 10 - (this._player[this._playerTurn - 1].leftbox[0]);
        
          this._player[this._playerTurn - 1].rightbox.push(second_rand);
          this._player[this._playerTurn - 1].rightboxView.push('/');
          this._player[this._playerTurn - 1].gamecount = 1;
          
          if(this._currentFrame == 2) {
            // 전프레임 값 수정
            this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] + 10;
            this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2];
            
            this._player[this._playerTurn - 1].frameScore.push(this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] + 10);
            this._player[this._playerTurn - 1].frameScoreview.push('');
            console.log("2~9프레임 후구 전프레임 스트라이크(2프레임한정)" + this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1]);

          } else {
            // 전프레임 값 수정
            this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3] + 20;
            this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3] + 20;
            
            this._player[this._playerTurn - 1].frameScore.push(this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] + 10);
            this._player[this._playerTurn - 1].frameScoreview.push('');
            console.log("2~9프레임 후구 전프레임 스트라이크" + this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1]);
          }
  
          this.turn();
        } else {  
          second_rand = 10 - (this._player[this._playerTurn - 1].leftbox[0]);
        
          this._player[this._playerTurn - 1].rightbox.push(second_rand);
          this._player[this._playerTurn - 1].rightboxView.push('/');
          this._player[this._playerTurn - 1].gamecount = 1;

          this._player[this._playerTurn - 1].frameScore.push(this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] + 10);
          this._player[this._playerTurn - 1].frameScoreview.push('');
          console.log("2~9프레임 후구 전프레임 아무것도아님" + this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1]);
  
          this.turn();
        }
      }



    // 10프레임
    } else if(this.currentFrame == 10) {  
      if(this._player[this._playerTurn - 1].gamecount === 1) {   // 초구 
        
        // 전프레임 더블
        if(this._player[this._playerTurn - 1].leftboxView[this._currentFrame - 3] == 'X' && this._player[this._playerTurn - 1].leftboxView[this._currentFrame - 2] == 'X') {
          this._player[this._playerTurn - 1].leftbox.push(10);
          this._player[this._playerTurn - 1].leftboxView.push('X');

          // 전전프레임 값 수정
          this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3] = 
          30 + (this._player[this._playerTurn - 1].frameScore[this.currentFrame - 4]); 
          this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 3] = (this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3]);
                    
          this._player[this._playerTurn - 1].frameScoreview.push('');
          console.log("10프레임 초구 전프레임 더블");
          this._player[this._playerTurn - 1].gamecount += 1;

        // 전프레임 스트라이크
        } else if(this._player[this._playerTurn - 1].leftboxView[this._currentFrame - 2] == 'X') {
          this._player[this._playerTurn - 1].leftbox.push(10);
          this._player[this._playerTurn - 1].leftboxView.push('X');
            
          // 전프레임 값 수정
          this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] + 10;
          
          this._player[this._playerTurn - 1].frameScoreview.push('');
          console.log("10프레임 초구 전프레임 스트라이크");
            
          this._player[this._playerTurn - 1].gamecount += 1;

        // 전프레임 스페어
        } else if(this._player[this._playerTurn - 1].rightboxView[this._currentFrame - 2] == '/') { 
          this._player[this._playerTurn - 1].leftbox.push(10);
          this._player[this._playerTurn - 1].leftboxView.push('X');

          // 전프레임 값 수정
          this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] + 10;
          this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2];

          this._player[this._playerTurn - 1].frameScoreview.push('');
          console.log("10프레임 초구 전프레임 스페어")

          this._player[this._playerTurn - 1].gamecount += 1;

        // 전프레임 아무것도 아님
        } else {
          this._player[this._playerTurn - 1].leftbox.push(10);
          this._player[this._playerTurn - 1].leftboxView.push('X');

          this._player[this._playerTurn - 1].frameScoreview.push('');
          console.log("10프레임 초구 전프레임 아무것도아님");

          this._player[this._playerTurn - 1].gamecount += 1;
        }
        
      } else if(this._player[this._playerTurn - 1].gamecount === 2) {   // 후구
        if(this._player[this._playerTurn - 1].leftboxView[this._currentFrame - 2] == 'X') {  // 전프레임 스트라이크
          if(this._player[this._playerTurn - 1].leftboxView[this._currentFrame - 1] == 'X') {  // 10프레임 초구 스트라이크
            this._player[this._playerTurn - 1].rightbox.push(10);
            this._player[this._playerTurn - 1].rightboxView.push('X');

            // 전프레임 값 수정
            this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3] + 30;
            this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2];
            console.log("10프레임 후구 (초구,전프레임 스트라이크)");

            this._player[this._playerTurn - 1].gamecount += 1;

          } else {  // 10프레임 초구 랜덤점수 
            second_rand = 10 - (this._player[this._playerTurn - 1].leftbox[this._currentFrame - 1]);
            this._player[this._playerTurn - 1].rightbox.push(second_rand);
            this._player[this._playerTurn - 1].rightboxView.push('/');

            // 전프레임 값 수정
            this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 3] + 20;
            this._player[this._playerTurn - 1].frameScoreview[this.currentFrame - 2] = this._player[this._playerTurn - 1].frameScore[this.currentFrame - 2];
            console.log("10프레임 후구 (초구 랜덤점수, 전프레임 스트라이크)");

            this._player[this._playerTurn - 1].gamecount += 1;
          }
        } else {  // 전프레임 영향x
          if(this._player[this._playerTurn - 1].leftboxView[this._currentFrame - 1] == 'X') {  // 10프레임 초구 스트라이크
            this._player[this._playerTurn - 1].rightbox.push(10);
            this._player[this._playerTurn - 1].rightboxView.push('X');
            console.log("10프레임 후구 (초구 스트라이크)")

            this._player[this._playerTurn - 1].gamecount += 1;

          } else {  // 10프레임 초구 랜덤점수 
            second_rand = 10 - (this._player[this._playerTurn - 1].leftbox[this._currentFrame - 1]);
            this._player[this._playerTurn - 1].rightbox.push(second_rand);
            this._player[this._playerTurn - 1].rightboxView.push('/');
            console.log("10프레임 후구 (초구 랜덤점수)")

            this._player[this._playerTurn - 1].gamecount += 1;
          }
        }

      } else if(this._player[this._playerTurn - 1].gamecount === 3) {   // 세번째구
        
        // 10프레임 후구 스트라이크거나 스페어
        if(this._player[this._playerTurn - 1].rightboxView[this._currentFrame - 1] == 'X' || this._player[this._playerTurn - 1].rightboxView[this._currentFrame - 1] == '/') {
          this._player[this._playerTurn - 1].extrabox = 10;
          this._player[this._playerTurn - 1].extraboxView = 'X';

          // 최종점수
          this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1] = this._player[this._playerTurn - 1].frameScore[this._currentFrame - 2] + 
          this._player[this._playerTurn - 1].leftbox[this._currentFrame - 1] + this._player[this._playerTurn - 1].rightbox[this._currentFrame - 1] + this._player[this._playerTurn - 1].extrabox;
          
          this._player[this._playerTurn - 1].frameScoreview[this._currentFrame - 1] = this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1];
          this._player[this._playerTurn - 1].gamecount = 1;
          console.log("10프레임 세번째구 X " + this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1]);
          this.turn();
        } else {  
          this._player[this._playerTurn - 1].extrabox = 10 - this._player[this._playerTurn - 1].rightbox[this._currentFrame - 1];
          this._player[this._playerTurn - 1].extraboxView = '/';
          
          // 최종점수
          this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1] = this._player[this._playerTurn - 1].frameScore[this._currentFrame - 2] + 
          this._player[this._playerTurn - 1].leftbox[this._currentFrame - 1] + this._player[this._playerTurn - 1].rightbox[this._currentFrame - 1] + this._player[this._playerTurn - 1].extrabox;
          
          this._player[this._playerTurn - 1].frameScoreview[this._currentFrame - 1] = this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1];
          this._player[this._playerTurn - 1].gamecount = 1;
          console.log("10프레임 세번째구 / " + this._player[this._playerTurn - 1].frameScore[this._currentFrame - 1]);
          this.turn();
        }
      }
    }
  }

}

export default new PlayStore();
