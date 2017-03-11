import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const userId = window.location.hostname === 'localhost' ? '💩' : '😈'

const store = new Vuex.Store({
  state: {
    games: [],
    boards: [],
    moves: [],
    peers: [ /* { id: 123 } */ ],
    users: {}
  },

  actions: {
  },

  mutations: {
    ADD_PEERS: (state, peers) => {
      state.peers = state.peers.concat(peers)
    },

    ADD_PEER: (state, peer) => {
      state.peers.push(peer)
    },

    ADD_OR_UPDATE_USER: (state, newUser) => {
      const user = state.users[newUser.id]
      if (!user) {
        state.users[newUser.id] = newUser
      }
    },

    CREATE_CURRENT_USER: (state) => {
      const users = state.users
      users[userId] = { id: userId }
      state.users = users
    },

    UPDATE_CURRENT_USER: (state, user) => {
      const users = state.users
      users[userId] = Object.assign(users[userId], user)
      state.users = users
    }

  },

  getters: {
    currentUser (state) {
      return state.users[userId]
    },
    otherUser (state) {
      const ids = Object.keys(state.users)
      const id = ids.find(id => id !== userId)
      return state.users[id]
    }
  }

})

store.commit('CREATE_CURRENT_USER')

export default store
