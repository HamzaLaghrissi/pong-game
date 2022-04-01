const UP = Symbol('UP');
const DOWN = Symbol('DOWN');
const STOPPED = Symbol('STOPPED');

export default class State {
  static get UP() { return UP; }
  static get DOWN() { return DOWN; }
  static get STOPPED() { return STOPPED; }
  }
