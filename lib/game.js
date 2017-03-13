import lobby from './lobby'
import helpers from '../src/store/helpers'
import store from '../src/store'
import Emitter from 'wildemitter'
import tictactojicon from './tictactojicon'

const channelPrefix = 'tictactomojiGame'

class Game {

  constructor(opponent) {

    if (typeof(opponent) === 'string') {
      opponent = helpers.findUserById(opponent)
    }

    this.player = store.getters.currentUser;
    this.opponent = opponent
    this.id = this.roomName = `tictactomoji-game-${[this.player.id, this.opponent.id].sort().join('-')}`
    this.initialized = false
    this.accepted = false
  }

  restoreState(currentTurnPlayerId, boardState) {
    this.boardState = boardState || [];
    this.currentTurnPlayerId = currentTurnPlayerId
    this.initialized = true
  }

  currentPlayer() {

  }

  initializeGame() {
    this.boardState = [ [null, null, null], [null, null, null], [null, null, null] ]
    this.currentTurnPlayerId = [this.player.id, this.opponent.id][this.getRandomInt(0,2)]
  }

  makeMove (x, y) {
    this.boardState[x][y] = this.player.id
    this.currentTurnPlayerId = this.opponent.id
    this.sync()
  }

  hasWinner () {
  }

  getRandomInt (min, max) { // inclusive, exclusive
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  sync() {
    this.emit('updated')
  }
}

Emitter.mixin(Game)

export default Game