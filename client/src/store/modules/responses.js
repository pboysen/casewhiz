import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    caseid: "weather",
    activePhase: 0,
    answers: {}
  };
};

const responses = {
  namespaced: true,
  state: getDefaultState(),
  getters: {
    getAnswer: state => wid => {
      if (wid in state.answers) return state.answers[wid];
      else return "";
    },
    hasAnswer: state => wid => wid in state.answers,
    isCompletedPhase: state => pid => pid < state.activePhase,
    isActivePhase: state => pid => pid == state.activePhase,
    isFuturePhase: state => pid => pid > state.activePhase,
    combineAnswers: state => sources => {
      let content = "";
      sources.forEach(wid => {
        if (wid in state.answers) content += state.answers[wid] + "\n";
      });
      return content;
    }
  },
  mutations: {
    saveAnswer(state, info) {
      Vue.set(state.answers, info.wid, info.value);
    },
    unlockNextPhase(state) {
      state.activePhase++;
    },
    resetState(state, newState) {
      Object.assign(state, newState);
    },
    setDefaultState(state) {
      Object.assign(state, getDefaultState());
    }
  }
};
export default responses;
