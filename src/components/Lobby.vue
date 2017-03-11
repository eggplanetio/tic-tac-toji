<template>
  <div>
    <h1>The Lobby - {{ currentUser.id }}</h1>
    
    <ul v-for="user in users">
      {{ user.id }}
    </ul>

    <button @click='challenge'>
      Challenge Peer
    </button>
  </div>
</template>

<script>
import store from '../store'
import gameCoordinator from '../../lib/game-coordinator'

import { mapState, mapGetters } from 'vuex'

export default {
  methods: {
    challenge () {
      const userId = store.getters.currentUser.id;
      const otherId = store.getters.otherUser.id;
      gameCoordinator.challengeUser(otherId)
    }
  },

  computed: {
    ...mapState([ 'users', 'peers' ]),
    ...mapGetters([ 'currentUser', 'userCount' ])
  },

  head: {
    title () {
      return { inner: `Lobby (${this.userCount} players)` }
    },
  }
}
</script>
