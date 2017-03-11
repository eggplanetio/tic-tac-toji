import SimpleWebRTC from 'SimpleWebRTC'
import store from '../src/store'
import helpers from '../src/store/helpers'
import router from '../src/router'

const roomName = 'tictactomoji'

class GameCoordinator  {

  constructor() {
    this.webrtc = new SimpleWebRTC({
        enableDataChannels: true,
        nick: store.getters.currentUser.id
      })

    this.setup()
  }

  setup() {

    let webrtc = this.webrtc = new SimpleWebRTC({
        enableDataChannels: true,
        nick: store.getters.currentUser.id
      })

      webrtc.on('connectionReady', sessionId => {
        console.log('Connection Ready, Session ID: ', sessionId)
        store.commit('UPDATE_CURRENT_USER', { sessionIds: [ sessionId ] })

        webrtc.joinRoom(roomName, (err, room) => {
          console.log(err)
          webrtc.sendToAll('identify', store.getters.currentUser)
          console.log("room", room)
        })

        webrtc.connection.on('message', data => {
          const userId = store.getters.currentUser.id
          if (data.type === 'identify') {
            store.commit('ADD_OR_UPDATE_USER', data.payload)
          }

          if (data.type === 'challenged') {
            const challengerId = data.payload.id
            console.log('challenged', challengerId)
            const challenger = helpers.findUserById(challengerId)
            this.sendToUser(challenger, 'accepted', {
              id: userId
            })
            router.push({ name: 'Game', params: { id: `${challengerId}vs${userId}` }})
          }

          if (data.type == 'accepted') {
            const challengeeId = data.payload.id
            const userId = store.getters.currentUser.id
            router.push({ name: 'Game', params: { id: `${userId}vs${challengeeId}` }})
          }

        })

        webrtc.on('createdPeer', function (peer) {
          // store.commit('ADD_PEER', { sessionId: peer.id })
          peer.send('identify', store.getters.currentUser)
        })

      })

  }

  challengeUser(userId) {
    let user = helpers.findUserById(userId)
    this.sendToUser(user, 'challenged', {
      id: store.getters.currentUser.id
    })

    return user
  }

  sendToUser(user, messageType, payload) {
    user.sessionIds.forEach((sessionId, i) => {
      let peers = this.webrtc.getPeers(sessionId)
      peers.forEach((peer, j) => {
        peer.send(messageType, payload)
      })
    })
  }
  

  // window.webrtc= webrtc

}

const gameCoordinator = new GameCoordinator()

export default gameCoordinator
