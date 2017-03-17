import tictactojicon from './tictactojicon'
import store from '../src/store'
import helpers from '../src/store/helpers'
import router from '../src/router'
import Game from './game'
import Errors from './errors'

class Lobby {

  constructor () {
    this.initListeners()
  }

  initListeners () {
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
    tictactojicon.on('requestSync', (challegee) => {
      const game = this.loadGameAgainstUser(challegee.id)
      tictactojicon.sendToUser(game.opponent, 'updated', {
        userId: game.player.id,
        boardState: game.boardState,
        currentTurnPlayerId: game.currentTurnPlayerId
      })
    })
  }

  challengeAcceptedBy (userId, data) {
    const game = this.loadGameAgainstUser(userId)
    game.restoreState(data.currentTurnPlayerId, data.boardState)
    game.accepted = true
    store.commit('CREATE_OR_UPDATE_GAME', game)
    router.push({ name: 'Game', params: { id: `${game.player.id}vs${game.opponent.id}` }})
    return game
  }

  acceptChallengeFrom (userId, boardState, currentTurnPlayerId) {
    const game = this.loadGameAgainstUser(userId, true)
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

  rejectChallengeFrom (userId) {}

  updateGameState (userId, data) {
    try {
      store.commit('UPDATE_GAME_BOARDSTATE', {
        opponentId: userId,
        currentTurnPlayerId: data.currentTurnPlayerId,
        boardState: data.boardState
      })
    } catch (e) {
      if ( e instanceof Errors.GameNotFound ) {
        const game = this.buildGameAgainstUser(helpers.findUserById(userId))
        game.accepted = true
        game.initialized = true
        game.currentTurnPlayerId = data.currentTurnPlayerId,
        game.boardState = data.boardState
        store.commit('CREATE_OR_UPDATE_GAME', game)
      } else {
        throw e
      }
    }
    
  }

  challengeUser (userId) {
    const game = this.buildGameAgainstUser(userId)
    game.initializeGame()
    store.commit('CREATE_OR_UPDATE_GAME', game)
    tictactojicon.sendToUser(game.opponent, 'challenge', {
      userId: game.player.id,
      boardState: game.boardState,
      currentTurnPlayerId: game.currentTurnPlayerId
    })
    return game
  }

  loadGameAgainstUser (userId, suppressError) {
    suppressError = suppressError === null ? false : suppressError
    if (suppressError) {
      try {
        return helpers.findGameByOpponentId(userId)
      } catch (e) {
        return this.buildGameAgainstUser(userId)
      }
    } else {
      return helpers.findGameByOpponentId(userId) || this.buildGameAgainstUser(userId)
    }
  }

  buildGameAgainstUser (user) {
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
