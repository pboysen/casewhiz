import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";

Vue.config.productionTip = false;
const EventBus = new Vue();
export default EventBus;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
 
