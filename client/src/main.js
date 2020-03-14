import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import store from "./store";
import router from "./router";

Vue.config.productionTip = false;
Vue.config.devtools = false;
Vue.use(Vuex);

const eventBus = new Vue();
export default eventBus;

let vm = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");

eventBus.$emit("loadDocument", {
  url: "Making the Case.pdf",
  setState: function setCaseState(pdf, url) {
    store.commit("addPhases", pdf.numPages);
    store.commit("setFileName", url);
    vm.$nextTick(() => store.commit("setCurrentPhase", 0));
  }
});
