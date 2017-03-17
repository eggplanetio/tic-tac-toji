import helpers from '../src/store/helpers'
import store from '../src/store'
import Emitter from 'wildemitter'

class Game {

  constructor (opponent) {
    if (typeof (opponent) === 'string') {
      opponent = helpers.findUserById(opponent)
    }

    this.player = store.getters.currentUser
    this.opponent = opponent
    this.id = this.roomName = `tictactomoji-game-${[this.player.id, this.opponent.id].sort().join('-')}`
    this.initialized = false
    this.accepted = false
  }

  restoreState (currentTurnPlayerId, boardState) {
    this.boardState = boardState || [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]
    this.currentTurnPlayerId = currentTurnPlayerId
    this.initialized = true
  }

  initializeGame () {
    this.boardState = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]

    const randInt = this.getRandomInt(2)
    this.currentTurnPlayerId = [this.player.id, this.opponent.id][randInt]
  }

  makeMove (x, y) {
    store.commit('MAKE_MOVE_FOR_GAME', {
      x,
      y,
      id: this.player.id,
      opponentId: this.opponent.id
    })

    this.sync()
  }

  hasWinner () {
    return false
  }

  getRandomInt (length) { // inclusive, exclusive
    return Math.round(Math.random() * (length - 1))
  }

  sync () {
    this.emit('updated', this.opponent.id)
  }
}

Emitter.mixin(Game)

export default Game
