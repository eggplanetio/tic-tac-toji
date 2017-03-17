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
      this.challengeAcceptedBy(challegee.id, data)
    })
    tictactojicon.on('rejected', (challegee, data) => {
      this.rejectChallengeFrom(challegee.id)
    })
    tictactojicon.on('updated', (challegee, data) => {
      this.updateGameState(challegee.id, data)
    })
  }

  challengeAcceptedBy(user, data) {
    console.log('accepted by', data)
    const game = this.loadGameAgainstUser(user)
    game.restoreState(data.currentTurnPlayerId, data.boardState)
    game.accepted = true
    store.commit('CREATE_OR_UPDATE_GAME', game)
    router.push({ name: 'Game', params: { id: `${game.player.id}vs${game.opponent.id}` }})
    return game
  }

  acceptChallengeFrom(user, boardState, currentTurnPlayerId) {
    const game = this.loadGameAgainstUser(user)
    game.restoreState(currentTurnPlayerId, boardState)
    game.accepted = true
    store.commit('CREATE_OR_UPDATE_GAME', game)
    tictactojicon.sendToUser(game.opponent, 'accepted', {
      userId: store.getters.currentUser.id,
      boardState: game.boardState,
      currentTurnPlayerId: game.currentTurnPlayerId
    })
    router.push({ name: 'Game', params: { id: `${game.player.id}vs${game.opponent.id}` }})
    return game
  }

  rejectChallengeFrom(user) {}

  updateGameState(user, data) {
    console.log('received game state from opponent, do something')
    const game = this.loadGameAgainstUser(user)
    game.restoreState(data.currentTurnPlayerId, data.boardState)
    console.log('new game state', game)
    store.commit('CREATE_OR_UPDATE_GAME', game)
  }

  challengeUser(user) {
    const game = this.buildGameAgainstUser(user)
    console.log(game)
    game.initializeGame()
    store.commit('CREATE_OR_UPDATE_GAME', game)
    console.log(game)
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
    const game = new Game(user)
    game.on('updated', (opponentId) => {
      const refetchedGame = helpers.findGameByOpponentId(opponentId)
      tictactojicon.sendToUser(refetchedGame.opponent, 'updated', {
        userId: refetchedGame.player.id,
        boardState: refetchedGame.boardState,
        currentTurnPlayerId: refetchedGame.currentTurnPlayerId
      })
      store.commit('CREATE_OR_UPDATE_GAME', refetchedGame)
    })
    return game
  }
  
}

const lobby = new Lobby()

export default lobby
