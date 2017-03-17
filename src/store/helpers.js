import store from './index'
import Errors from '../../lib/errors'
export default {

  findUserById(id) {
    const user = store.state.users[id]
    if (user) {
      return user
    } else {
      throw new Errors.UserNotFound('User Not Found')
    }
  },

  findGameByOpponentId(id) {
    const game = store.state.games[id]
    if (game) {
      return game
    } else {
      throw new Errors.GameNotFound('Game not found')
    }
  }

}
