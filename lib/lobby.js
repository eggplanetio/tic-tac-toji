import tictactojicon from './tictactojicon'
import store from '../src/store'
import helpers from '../src/store/helpers'
import router from '../src/router'
import Game from './game'

class Lobby  {

  constructor() {
    this.initListeners()
  }

  initListeners() {
    tictactojicon.on('challenge', (challenger, data) => {
      this.acceptChallengeFrom(challenger.id, data.boardState, data.currentTurnPlayerId)
    })
    tictactojicon.on('accepted', (challegee, data) => {
      this.challengeAcceptedBy(challegee.id)
    })
    tictactojicon.on('rejected', (challegee, data) => {
      this.rejectChallengeFrom(challegee.id)
    })
    tictactojicon.on('updated', (challegee, data) => {
      this.updateGameState(challegee.id)
    })
  }

  challengeAcceptedBy(user) {
    const game = this.loadGameAgainstUser(user)
    game.accepted = true
    router.push({ name: 'Game', params: { id: `${game.player.id}vs${game.opponent.id}` }})
    store.commit('CREATE_OR_UPDATE_GAME', game)
    return game
  }

  acceptChallengeFrom(user, boardState, currentTurnPlayerId) {
    const game = this.loadGameAgainstUser(user)
    game.restoreState(currentTurnPlayerId, boardState)
    game.accepted = true
    store.commit('CREATE_OR_UPDATE_GAME', game)
    tictactojicon.sendToUser(game.opponent, 'accepted', {
      userId: store.getters.currentUser.id
    })
    router.push({ name: 'Game', params: { id: `${game.player.id}vs${game.opponent.id}` }})
    return game
  }

  rejectChallengeFrom(user) {}

  challengeUser(user) {
    const game = this.buildGameAgainstUser(user)
    game.initializeGame()
    store.commit('CREATE_OR_UPDATE_GAME', game)
    tictactojicon.sendToUser(game.opponent, 'challenge', {
      userId: game.player.id,
      boardState: game.boardState,
      currentTurnPlayerId: game.currentTurnPlayerId
    })
    return game
  }

  loadGameAgainstUser(user) {
    return helpers.findGameByOpponentId(user.id) || this.buildGameAgainstUser(user)
  }

  buildGameAgainstUser(user) {
    return new Game(user)
  }
  
}

const lobby = new Lobby()

export default lobby