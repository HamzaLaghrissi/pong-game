import Ball from './Ball.js';
import Paddle from './Paddle.js';
import * as msg from './../scripts/messageConstants.js';

const BALL_WIDTH = 24;

/**
 * a Game animates a ball bouncing in a canvas
 */
export default class Game {

  /**
   * build a Game
   *
   * @param  {Canvas} canvas the canvas of the game
   */
  constructor(canvas) {
    this.raf = null;
    this.canvas = canvas;
    this.leftPaddle = new Paddle(this.canvas.width / 16, this.canvas.height / 2, this)
    this.rightPaddle = new Paddle(this.canvas.width - (this.canvas.width / 16) - this.leftPaddle.width, this.canvas.height / 2, this)
    this.ball = null
    this.leftScore = 0;
    this.rightScore = 0;
    this.socket = null;
    this.launch = false
  }

  displayInfo(id, message){
    document.getElementById(id).innerHTML += '> ' + message + '</br>';
  }

  serverFull(){
    this.stop();
    this.displayInfo('info-box', 'Server is full');
    document.getElementById('join').disabled = true;
  }

  displayHost(){
    document.getElementById('left').innerHTML = 'Host';
    this.displayInfo('info-box', 'You are the first player to join, so you are the Host');
    this.displayInfo('info-box', 'Waiting for a player to join');
    document.getElementById('right').innerHTML = 'Guest';
    this.launch = true
  }
  displayGuest(){
    document.getElementById('left').innerHTML = 'Guest';
    this.displayInfo('info-box', 'You are the second player to join, so you are the Guest');
    this.displayInfo('info-box', 'Waiting for the host to start the game'); 
    this.socket.emit(msg.ENOUGH);
    document.getElementById('right').innerHTML = 'Host';
  }

  /** start this game animation */
  connect() {
    this.socket = io();
    this.socket.on(msg.START, (shiftX, shiftY, x, y) => this.otherStart(shiftX, shiftY, x, y));
    this.socket.on(msg.FULL, () => this.serverFull());
    this.socket.on(msg.HOST, () => this.displayHost());
    this.socket.on(msg.GUEST, () => this.displayGuest());
    this.socket.on(msg.OTHERDISC, () => {
      this.displayInfo('info-box', 'Your opponent has left.. disconnecting')
      this.displayInfo('info-box', 'You have been disconnected')
      document.getElementById('join').value = 'join'
      document.getElementById('start').disabled = true
      this.clearBox()
    })
    this.socket.on(msg.CANSTART, () =>{
      this.displayInfo('info-box', 'Another player has joined, you can start the game now');
      this.displayInfo('info-box', 'Press space to launch the ball');
      document.getElementById('start').disabled = false;
    })
    this.socket.on(msg.SYNCBALL, (shiftX, shiftY, x, y) => this.syncBall(shiftX, shiftY, x, y))
    this.socket.on(msg.UP, (y)=> this.syncMoveUp(y));
    this.socket.on(msg.DOWN, (y) => this.syncMoveDown(y));
    this.socket.on(msg.OTHERLAUNCH, (y) => this.launchBall(y));
    this.socket.on(msg.STOPMOVING, () => this.rightPaddle.stopMoving());
    this.socket.on(msg.STOP, () => window.cancelAnimationFrame(this.raf));
    this.socket.on(msg.SYNCSCORES, (leftScore, rightScore) => this.syncScores(leftScore, rightScore))
  }
  
  syncMoveUp(y){
    this.rightPaddle.y = y
    this.rightPaddle.moveUp()
  }

  syncMoveDown(y){
    this.rightPaddle.y = y
    this.rightPaddle.moveDown()
  }

  otherStart(){
    this.leftPaddle = new Paddle(this.canvas.width / 16, this.canvas.height / 2, this)
    this.rightPaddle = new Paddle(this.canvas.width - (this.canvas.width / 16) - this.leftPaddle.width, this.canvas.height / 2, this)
    this.animate()
  }
  
  launchBall(y){
    this.ball = new Ball(this.rightPaddle.x - BALL_WIDTH , y + (this.rightPaddle.height / 2) - BALL_WIDTH/2, this);  
  }

  syncBall(shiftX, shiftY, x, y){
    this.ball.x = (this.canvas.width - this.ball.width) - x
    this.ball.y = y
    this.ball.shiftX = -shiftX
    this.ball.shiftY = shiftY
  }

  start(){
    if (this.ball != null){
      this.ball = new Ball(this.leftPaddle.x + this.leftPaddle.width, this.leftPaddle.y + (this.leftPaddle.height / 2), this)
      this.socket.emit(msg.SYNCBALL, this.ball.shiftX, this.ball.shiftY, this.ball.x, this.ball.y)
    }
    this.socket.emit(msg.START)
    this.leftPaddle = new Paddle(this.canvas.width / 16, this.canvas.height / 2, this)
    this.rightPaddle = new Paddle(this.canvas.width - (this.canvas.width / 16) - this.leftPaddle.width, this.canvas.height / 2, this)
    this.resetScores();
    this.animate();
  }


  /** stop this game animation */
  stop() {
    window.cancelAnimationFrame(this.raf);
    this.socket.emit(msg.STOP)
  }

  disconnect(){
    this.displayInfo('info-box', 'You have been disconnected')
    document.getElementById('start').disabled = true;
    document.getElementById('start').value = 'Start';
    this.stop()
    this.socket.emit(msg.LEAVE);
    this.resetScores()
    this.clearBox()
  }

  clearBox(){
    const ctxt = this.canvas.getContext("2d");
    ctxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /** animate the game : move and draw */
  animate() {
    this.moveAndDraw();
    this.raf = window.requestAnimationFrame(this.animate.bind(this));
  }
  /** move then draw the bouncing ball */
  moveAndDraw() {
    const ctxt = this.canvas.getContext("2d");
    ctxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // draw and move the ball
    if (this.ball != null){
      this.ball.move();
      this.ball.draw(ctxt);
    }
    // draw and move the leftPaddle
    this.leftPaddle.move();
    this.leftPaddle.draw(ctxt);
    // draw and move the rightPaddle
    this.rightPaddle.move();
    this.rightPaddle.draw(ctxt);
    
    if (this.ball != null){
      if(this.ball.collisionWith(this.leftPaddle)){
        this.ball.rebound(this.leftPaddle)
        this.socket.emit(msg.SYNCBALL, this.ball.shiftX, this.ball.shiftY, this.ball.x, this.ball.y)
      }

      if(this.ball.collisionWith(this.rightPaddle)){
        this.ball.rebound(this.rightPaddle)
        this.socket.emit(msg.SYNCBALL, this.ball.shiftX, this.ball.shiftY, this.ball.x, this.ball.y)
      }
      
      if(this.ball.x == this.canvas.width/2)
        this.socket.emit(msg.SYNCBALL, this.ball.shiftX, this.ball.shiftY, this.ball.x, this.ball.y)
      if(this.ball.x == this.canvas.width/4)
        this.socket.emit(msg.SYNCBALL, this.ball.shiftX, this.ball.shiftY, this.ball.x, this.ball.y)
      if(this.ball.x == this.canvas.width - this.canvas.width/4)
        this.socket.emit(msg.SYNCBALL, this.ball.shiftX, this.ball.shiftY, this.ball.x, this.ball.y)
    }
  }

  keyDownActionHandler(event) {
    switch (event.key) {
      case "ArrowUp":
      case "Up":
        this.leftPaddle.moveUp();
        this.socket.emit(msg.UP, this.leftPaddle.y);
        break;
      case "ArrowDown":
      case "Down":
        this.leftPaddle.moveDown();
        this.socket.emit(msg.DOWN, this.leftPaddle.y);
        break;
      case " ":
          if (this.launch){
            this.ball = new Ball(this.leftPaddle.x + this.leftPaddle.width, this.leftPaddle.y + (this.leftPaddle.height / 2), this)
            this.socket.emit(msg.OTHERLAUNCH, this.ball.shiftX, this.ball.shiftY, this.ball.x, this.ball.y)
            this.socket.emit(msg.SYNCBALL, this.ball.shiftX, this.ball.shiftY, this.ball.x, this.ball.y)
            this.launch = false
          }
        break;
      default: return;
    }
    event.preventDefault();
  }

  keyUpActionHandler(event) {
    switch (event.key) {
      case "ArrowUp":
      case "Up":
      case "ArrowDown":
      case "Down":
        this.leftPaddle.stopMoving();
        this.socket.emit(msg.STOPMOVING, this.leftPaddle.y);
        break;
      case "":
        break;
      default: return;
    }
    event.preventDefault();
  }

  updateLeftScore(){
    this.leftScore+=1;
    this.displayInfo('info-box', 'Yayy.. You just scored!')
    document.getElementById("left-score").innerHTML = this.leftScore;
    this.socket.emit(msg.SYNCSCORES, this.rightScore, this.leftScore)
  }

  updateRightScore(){
    this.rightScore+=1;
    this.displayInfo('info-box', 'Oups.. Your opponent just scored!')
    document.getElementById("right-score").innerHTML = this.rightScore;
    this.launch = true
    this.socket.emit(msg.SYNCSCORES, this.rightScore, this.leftScore)
  }

  resetScores(){
    this.leftScore = 0;
    this.rightScore = 0;
    document.getElementById("left-score").innerHTML = this.leftScore;
    document.getElementById("right-score").innerHTML = this.rightScore;
    this.socket.emit(msg.SYNCSCORES, this.leftScore, this.rightScore)
  }

  syncScores(leftScore, rightScore){
    document.getElementById("left-score").innerHTML = leftScore;
    document.getElementById("right-score").innerHTML = rightScore;
  }

}
