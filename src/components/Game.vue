<template>
  <div>
    <h1> {{ $route.params.id }}</h1>

    <table v-if="game && game.accepted">
    <thead>
      <tr>
        <th colspan="3">Turn: {{game.currentTurnPlayerId}}</th>
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
  import Vue from 'vue'
  import Game from '../../lib/game'
  import store from '../store'
  import helpers from '../store/helpers'
  import router from '../../src/router'

  export default {

    head: {
      title () {
        return { inner: this.$route.params.id }
      },
    },

    data() {
      let ids = this.$route.params.id.split('vs')
      return {
        game: helpers.findGameByOpponentId(ids[1])
      }
    },

    methods: {
      makeMove(x, y) {
        this.game.makeMove(x,y)
      },
      // fetchData() {
      //   let ids = this.$route.params.id.split('vs')

      //   Vue.set(this, 'game', helpers.findGameByOpponentId(ids[1]))

      //   if (!this.game) {
      //     console.log(`Game not found: ${ids[1]}`)
      //     router.push({ name: 'Lobby'})
      //   } else {
      //     console.log('Game found:', this.game)
      //     console.log('Board State:', this.game.boardState)
      //   }
      // }
    }
  }
</script>
