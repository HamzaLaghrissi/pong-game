'use strict';

import Game from './Game.js';

const init = () => {
  const theField = document.getElementById("field");
  const theGame = new Game(theField);

  document.getElementById('join').addEventListener("click", () => joinGame(theGame) );
  document.getElementById('start').addEventListener("click", () => startGame(theGame) );

  window.addEventListener('keydown', theGame.keyDownActionHandler.bind(theGame));
  window.addEventListener('keyup', theGame.keyUpActionHandler.bind(theGame));
}

window.addEventListener("load",init);

// true iff game is started
let connected = false
/** start and stop a game
 * @param {Game} theGame - the game to start and stop
 */
const joinGame = theGame => {
    connected = document.getElementById('join').value == 'Leave' ? true : false;
    if (!connected) {
      theGame.connect();
      document.getElementById('join').value = 'Leave';
    }
    else {
      document.getElementById('join').value = 'Join';
      theGame.disconnect();
    }
}

let started = false;
const startGame = theGame => {
  started = document.getElementById('start').value == 'Stop' ? true : false;
  if (!started) {
    theGame.start();
    document.getElementById('start').value = 'Stop';
  }
  else {
    document.getElementById('start').value = 'Restart';
    theGame.stop();
  }
}
