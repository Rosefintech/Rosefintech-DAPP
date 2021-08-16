
const state = {
  userFalco: {},
  fundFalco: {},
}

const mutations = {
  SET_USER_FALCO: (state, data) => {
    state.userFalco = data;
    console.log('userFalco', data)
  },
  SET_FUND_FALCO: (state, data) => {
    state.fundFalco = data;
    console.log('fundFalco', data)
  },
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
