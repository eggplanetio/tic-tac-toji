import store from './index'

export default {

  findUserById(id) {
    return store.state.users[id]
  },

  findGameByOpponentId(id) {
    return store.state.games[id]
  }

}
