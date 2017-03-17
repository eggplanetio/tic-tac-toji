import SimpleWebRTC from 'SimpleWebRTC'
import store from '../src/store'
import helpers from '../src/store/helpers'
import Emitter from 'wildemitter'

const messagePrefix = 'tictactoji#'
const messageRegexp = new RegExp(`^${messagePrefix}`, 'i')
const roomName = 'tictactomoji'

const webrtc = new SimpleWebRTC({
  enableDataChannels: true,
  nick: store.getters.currentUser.id
})

class TicTacTojiEmmiter {

  constructor () {
    this.webrtc = webrtc
  }

  sendToUser (user, messageType, payload) {
    const senderId = store.getters.currentUser.id

    console.log(user, user instanceof String)
    if (typeof(user) === 'string' || user instanceof String) {
      try {
        user = helpers.findUserById(user)
      } catch (e) {
        this.waitForUserAndSend(user, messageType, payload)
        return
      }

    }

    user.sessionIds.forEach((sessionId, i) => {
      let peers = this.webrtc.getPeers(sessionId)
      peers.forEach((peer, j) => {
        peer.send(`${messagePrefix}${messageType}`, { senderId, payload})
      })
    })
  }

  waitForUserAndSend(userId, messageType, payload) {
    this.on(`identified:${userId}`, (user) => {
      this.sendToUser(user, messageType, payload)
    })
  }

}

Emitter.mixin(TicTacTojiEmmiter)
const tictactoji = new TicTacTojiEmmiter()

webrtc.on('connectionReady', sessionId => {
  store.commit('UPDATE_CURRENT_USER', { sessionIds: [ sessionId ] })

  webrtc.joinRoom(roomName, (err, room) => {
    webrtc.sendToAll('identify', store.getters.currentUser)
  })

  webrtc.connection.on('message', data => {
    const userId = store.getters.currentUser.id

    /* some presence management */
    if (data.type === 'identify') {
      store.commit('ADD_OR_UPDATE_USER', data.payload)
      let newUser = helpers.findUserById(data.payload.id)
      tictactoji.emit(`identified:${newUser.id}`, newUser)
      tictactoji.emit(`identified`, newUser)
    }

    if (data.type.match(messageRegexp)) {
      const sender = helpers.findUserById(data.payload.senderId)
      tictactoji.emit(data.type.replace(messageRegexp, ''), sender, data.payload.payload)
    }

    // if (data.type === 'challenged') {
    //   const challengerId = data.payload.id
    //   console.log('challenged', challengerId)
    //   const challenger = helpers.findUserById(challengerId)
    //   this.webrtc.sendToUser(challenger, 'accepted', {
    //     id: userId
    //   })
    //   //router.push({ name: 'Game', params: { id: `${challengerId}vs${userId}` }})
    // }

    // if (data.type == 'accepted') {
    //   const challengeeId = data.payload.id
    //   const userId = store.getters.currentUser.id
    //   //router.push({ name: 'Game', params: { id: `${userId}vs${challengeeId}` }})
    // }
  })

  webrtc.on('createdPeer', function (peer) {
    // store.commit('ADD_PEER', { sessionId: peer.id })
    peer.send('identify', store.getters.currentUser)
  })
})

window.tictactoji = tictactoji

export default tictactoji
