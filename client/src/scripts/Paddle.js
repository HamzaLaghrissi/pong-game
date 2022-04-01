import Mobile from './Mobile.js';
import MoveState from './movestate.js';


// default values for a Paddle : image and shifts
const PADDLE_IMAGE_SRC = './images/paddle.png';
const SHIFT_X = 0;
const SHIFT_Y = 5;

export default class Paddle extends Mobile {

    /**  build a paddle
     *
     * @param  {number} x       the x coordinate
     * @param  {number} y       the y coordinate
     * @param  {Game} theGame   the Game this ball belongs to
     */
    constructor(x, y, theGame) {
      super(x, y, PADDLE_IMAGE_SRC , SHIFT_X, SHIFT_Y);
      this.theGame = theGame;
    }
    
    moveUp() {
        this.shiftY = - SHIFT_Y
        this.moving = MoveState.UP;
    }

    moveDown() {
        this.shiftY = SHIFT_Y
        this.moving = MoveState.DOWN;
    }
    
    move (){
    if (this.moving === MoveState.UP)
        this.y = Math.max(0,this.y + this.shiftY);
    if (this.moving === MoveState.DOWN)
        this.y = Math.min(this.theGame.canvas.height - this.height, this.y + this.shiftY);
    }
}