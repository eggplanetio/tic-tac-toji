import store from './index'



export default {

  findUserById(id) {
    console.log('store users', id)
    return store.state.users[id]
  }

}