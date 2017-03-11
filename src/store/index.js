import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const userId = window.location.hostname === '0.0.0.0' ? '💩' : '😈'

function mergeUser (user, newData) {
  if (newData.sessionId) {
    newData.sessionIds = [ newData.sessionId ]
    delete newData.sessionId
  }
  let sessionIds = [ ...user.sessionIds, ...newData.sessionIds ]
  sessionIds = [...new Set(sessionIds)]
  let newUser = Object.assign(user, newData)
  newUser.sessionIds = sessionIds
  return newUser
}

const store = new Vuex.Store({

  state: {
    games: {},
    peers: [ /* { id: 123 } */ ],
    users: {},
    invitations: {}
  },

  actions: {
  },

  mutations: {
    ADD_OR_UPDATE_USER: (state, newUser) => {
      if (!newUser.sessionIds) { newUser.sessionIds = [] }
      const user = state.users[newUser.id]
      if (!user) {
        Vue.set(state.users, newUser.id, newUser)
      } else {
        Vue.set(state.users, newUser.id, mergeUser(user, newUser))
      }
    },

    CREATE_CURRENT_USER: (state) => {
      Vue.set(state.users, userId, { id: userId, sessionIds: [] })
    },

    UPDATE_CURRENT_USER: (state, user) => {
      Vue.set(state.users, userId, Object.assign(state.users[userId], user))
    },

    CREATE_OR_UPDATE_GAME: (state, game) => {
      Vue.set(state.games, game.opponent.id, game)
    },

    ADD_INVITIATION: (state, fromPlayerId, channelName) => {
      Vue.set(state.invitations, fromPlayerId, channelName)
    },

    REMOVE_INVITATION: (state, fromPlayerId) => {
      Vue.delete(state.invitations, fromPlayerId)
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
    },

    userCount (state) {
      return Object.keys(state.users).length
    },
  }

})

store.commit('CREATE_CURRENT_USER')

export default store
