<template>
  <div>
    <h1> {{ $route.params.id }}</h1>

    <table v-if="game && game.initialized && game.accepted">
    <thead>
      <tr>
        <th colspan="3" v-if="yourTurn">Your turn – {{game.currentTurnPlayerId}}</th>
        <th colspan="3" v-else>Their turn – {{game.currentTurnPlayerId}}</th>
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
  import Errors from '../../lib/errors'
  import tictactojicon from '../../lib/tictactojicon'

  import { mapGetters } from 'vuex'

  export default {

    head: {
      title () {
        return { inner: this.$route.params.id }
      },
    },

    data() {
      let id = this.$route.params.id.split('vs')[1]
      return {
        game: this.loadGame(id)
      }
    },

    computed: {
      ...mapGetters([ 'currentUser' ]),

      yourTurn() {
        return this.game.currentTurnPlayerId === this.currentUser.id;
      }
    },

    methods: {

      loadGame(id) {
        try {
          return helpers.findGameByOpponentId(id)
        } catch (e) {
          console.log('exception', e)
          if (e instanceof Errors.GameNotFound) {
            tictactojicon.sendToUser(id, 'requestSync')
          } else {
            throw e
          }
        }
      },

      makeMove(x, y) {
        if (this.yourTurn) {
          this.game.makeMove(x,y)
        } else {
          alert("It isn't your turn.")
        }
      },
    }
  }
</script>
