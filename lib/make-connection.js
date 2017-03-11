import SimpleWebRTC from 'SimpleWebRTC'
import store from '../src/store'

const roomName = 'tictactomoji'

function start () {
  const webrtc = new SimpleWebRTC({
    enableDataChannels: true
  })

  webrtc.on('connectionReady', sessionId => {
    console.log('Connection Ready, Session ID: ', sessionId)
    store.commit('UPDATE_CURRENT_USER', { sessionId })

    webrtc.joinRoom(roomName, (err, room) => {
      console.log(err)
      webrtc.sendToAll('identify', store.getters.currentUser)
    })

    webrtc.connection.on('message', data => {
      if (data.type === 'identify') {
        store.commit('ADD_OR_UPDATE_USER', data.payload)
      }

      if (data.type === 'challenged') {

      }
    })

    webrtc.on('createdPeer', function (peer) {
      console.log(peer)
      store.commit('ADD_PEER', { sessionId: peer.id })
      webrtc.sendToAll('identify', store.getters.currentUser)
    })
  })
}

export default { start }
