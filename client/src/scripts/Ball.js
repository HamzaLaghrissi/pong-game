import Mobile from './Mobile.js';
import MoveState from './movestate.js';


// default values for a Ball : image and shifts
const BALL_IMAGE_SRC = './images/balle24.png';
const SHIFT_X = 5;
const SHIFT_Y = 2;
const N = 5;
const ABS_SHIFT_XY = 7


/**
 * a Ball is a mobile with a ball as image and that bounces in a Game (inside the game's canvas)
 */
export default class Ball extends Mobile {

  /**  build a ball
   *
   * @param  {number} x       the x coordinate
   * @param  {number} y       the y coordinate
   * @param  {Game} theGame   the Game this ball belongs to
   */
  constructor(x, y, theGame) {
    super(x, y, BALL_IMAGE_SRC , SHIFT_X, SHIFT_Y);
    this.theGame = theGame;
  }

  collisionWith(mobile){
    let p1x, p1y, p2x, p2y;
    p1x = Math.max(this.x, mobile.x);
    p1y = Math.max(this.y, mobile.y);
    p2x = Math.min(this.x+this.width, mobile.x+mobile.width);
    p2y = Math.min(this.y+this.width, mobile.y+mobile.height);
    return (p1x<p2x && p1y<p2y);
  }

  rebound(paddle){
    const segment = Math.floor(paddle.height/(N*2));
    const direction = paddle.x < this.theGame.canvas.width/2 ? 1 : -1;
    const centerY = paddle.y + Math.floor(paddle.height/2);

    let nbSeg = 0;
    let segY = 0;
    let stop = 0;

    if (this.y < centerY){
      nbSeg = -4;
      segY = paddle.y;
      stop = centerY;
    }
    else{
      nbSeg = 0;
      segY = centerY;
      stop = paddle.y + paddle.height;
    }

    for (segY; segY <= stop ; segY+=segment){
      if ((segY <= this.y && this.y < segY + segment) || (segY <= this.y+this.width && this.y+this.width < segY + segment)){
        this.shiftY = nbSeg;
        this.shiftX = direction * (ABS_SHIFT_XY - Math.abs(nbSeg));
        break;
      }
      nbSeg++;
    }
  }

  move() {
    if (this.y <= 0 || (this.y+this.height >= this.theGame.canvas.height)) {
      this.shiftY = - this.shiftY;    // rebond en haut ou en bas
    }
    else if (this.collisionWith(this.theGame.leftPaddle)){
      this.rebound(this.theGame.leftPaddle)
    }
    else if (this.collisionWith(this.theGame.rightPaddle)){
      this.rebound(this.theGame.rightPaddle)
    }
    else if (this.x <= 0){
      if (this.moving != MoveState.STOPPED){
        this.stopMoving();
        this.theGame.updateRightScore();
      }
    }
    else if (this.x + this.width >= this.theGame.canvas.width) {
      if (this.moving != MoveState.STOPPED){
        this.stopMoving();
        this.theGame.updateLeftScore();
      }
    }
    super.move();
  }

  stopMoving(){
    this.moving = MoveState.STOPPED;
    this.shiftX = 0;
    this.shiftY = 0;
  }

}
