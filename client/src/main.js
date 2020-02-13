import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import store from "./store";
import router from "./router";

Vue.config.productionTip = true;
Vue.config.devtools = true;
Vue.use(Vuex);

const eventBus = new Vue();
export default eventBus;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
