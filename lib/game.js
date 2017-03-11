
import gameCoordinator from './game-coordinator'
import helpers from '../src/store/helpers'

class Game {

  constructor(challenger, challengee, board) {
    this.board = board || [];
    this.challenger = challenger;
    this.challengee = challengee;
  }

  makeMove (x, y) {
    console.log('Move made from Game:', x, y)
  }

  hasWinner () {

  }

  sync() {
    sendToUser(challenger, board)
  }

}

export default Game