const maxLength = 60; 
const state = {
  logs: localStorage.getItem('logs') ? JSON.parse(localStorage.getItem('logs')) : []
}

const mutations = {
  ADD_ERROR_LOG: (state, log) => {
    state.logs.unshift(log);
    if (state.logs.length > maxLength) {
      state.logs.length = maxLength;
    }
    localStorage.setItem('logs', JSON.stringify(state.logs));
  },
  CLEAR_ERROR_LOG: (state) => {
    state.logs.splice(0)
    localStorage.removeItem('logs');
  }
}

const actions = {
  addErrorLog({ commit }, log) {
    commit('ADD_ERROR_LOG', log);
  },
  clearErrorLog({ commit }) {
    commit('CLEAR_ERROR_LOG')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
