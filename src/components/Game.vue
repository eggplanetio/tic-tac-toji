<template>
  <div>
    <h1> {{ $route.params.id }}</h1>

    <table v-if="game && game.accepted">
    <thead>
      <tr>
        <th colspan="3">Current Player: {{game.currentTurnPlayerId}}</th>
      </tr>
    </thead>

      <tr v-for="(row, i) in game.boardState">
        <td v-for="(col, j) in row">
          <button v-if="!col" @click="makeMove(i,j)">{{i}},{{j}}</button>
          <button v-else>{{col}}</button>
        </td>
        </td>
      </tr>

    </table>

  </div>
</template>

<script>
  import Game from '../../lib/game'
  import store from '../store'
  import helpers from '../store/helpers'
  import router from '../../src/router'


  export default {

    data() {
      return {
        game: null
      }
    },

    watch: {
    // call again the method if the route changes
    '$route': 'fetchData',
    'game': 'fetchData'
    },

    created () {
      this.fetchData()
    },

    methods: {
      makeMove(x, y) {
        this.game.makeMove(x,y)
        this.fetchData()
      },
      fetchData() {
        let ids = this.$route.params.id.split('vs')
        this.game = helpers.findGameByOpponentId(ids[1])
        if (!this.game) {
          console.log(`Game not found: ${ids[1]}`)
          router.push({ name: 'Lobby'})
        } else {
          console.log('Game found:', this.game)
          console.log('Board State:', this.game.boardState)
        }
      }
    },
    head: {
      title () {
        return { inner: this.$route.params.id }
      },
    }
  }
</script>