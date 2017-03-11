<template>
  <div>
    <h1> {{ $route.params.id }}</h1>

    <table>
      <tr>
        <td><button @click="makeMove(1,1)">1,1</button></td>
        <td><button @click="makeMove(1,2)">1,2</button></td> 
        <td><button @click="makeMove(1,3)">1,3</button></td>
      </tr>

      <tr>
        <td><button @click="makeMove(2,1)">2,1</button></td>
        <td><button @click="makeMove(2,2)">2,2</button></td> 
        <td><button @click="makeMove(2,3)">2,3</button></td>
      </tr>

      <tr>
        <td><button @click="makeMove(3,1)">3,1</button></td>
        <td><button @click="makeMove(3,2)">3,2</button></td> 
        <td><button @click="makeMove(3,3)">3,3</button></td>
      </tr>
    </table>

  </div>
</template>

<script>
  import Game from '../../lib/game'
  import store from '../store'

  export default {
    created () {
      // try to find a game between these 2
      // if not find, create one.

      // this.game = new Game('1', '2')
      // store.commit('ADD_GAME', game)
    },

    methods: {
      makeMove(x, y) {
        console.log(x, y)
      }
    },
    head: {
      title () {
        return { inner: this.$route.params.id }
      },
    }
  }
</script>