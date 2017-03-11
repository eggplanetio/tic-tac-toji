<template>
  <div>
    <h1>The Lobby - {{ currentUser.id }}</h1>

    <button @click='challenge'>
      Challenge Peer
    </button>
  </div>
</template>

<script>
import store from '../store'
import { mapState, mapGetters } from 'vuex'

export default {

  methods: {
    challenge () {
      console.log(store)
    }
  },

  computed: {
    ...mapState([ 'users', 'peers' ]),
    ...mapGetters([ 'currentUser' ])
  }
}
</script>
