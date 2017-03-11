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
    games: [],
    peers: [ /* { id: 123 } */ ],
    users: {}
  },

  actions: {
  },

  mutations: {
    ADD_OR_UPDATE_USER: (state, newUser) => {
      if (!newUser.sessionIds) {
        newUser.sessionIds = []
      }
      const user = state.users[newUser.id]
      if (!user) {
        Vue.set(state.users, newUser.id, newUser)
      } else {
        Vue.set(state.users, newUser.id, mergeUser(user, newUser))
      }
    },

    CREATE_CURRENT_USER: (state) => {
      console.log('CREATE_CURRENT_USER', userId)
      Vue.set(state.users, userId, { id: userId, sessionIds: [] })
    },

    UPDATE_CURRENT_USER: (state, user) => {
      console.log('UPDATE_CURRENT_USER', userId)
      Vue.set(state.users, userId, Object.assign(state.users[userId], user))
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
