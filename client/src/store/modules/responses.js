import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const getDefaultState = () => {
  return responses.state;
};

const responses = {
    namespaced: true,
    caseid: "weather",
    answers: {},
    locked: {}
  },
  getters: {
    getAnswer: state => wid => answers[wid],
    isLocked: state => pid => locked[pid],
  },
  mutations: {
    setAnswer(wid, answer) {
      answers[wid] = answer;
    },
    unlockPhase(pid) {
      locked[pid] = false;
    },
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
