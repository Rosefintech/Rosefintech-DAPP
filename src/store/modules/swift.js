
const state = {
  userSwift: {},

}
const mutations = {
  SET_USER_SWIFT: (state, data) => {
    state.userSwift = data;
  },
}
const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
