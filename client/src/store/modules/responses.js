import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const getDefaultState = () => {
  return responses.state;
};

const responses = {
  namespaced: true,
  caseid: "weather",
  phases: [
    {
      wid: "1",
      locked: false,
      responses: []
    }
  ],
  mutations: {
    resetState(state) {
      Object.assign(state, getDefaultState());
    }
  },
  actions: {
    resetState({ commit }) {
      commit("resetState");
    }
  }
};
export default responses;
