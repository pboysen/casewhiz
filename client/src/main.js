import Vue from "vue";
import App from "./App.vue";
import store from "./store";

Vue.config.productionTip = false;
var data = {
  role: "designer",
  case: {
    url: "",
    document: null,
    userData: null
  }
};

new Vue({
  store,
  data: data,
  render: h => h(App)
}).$mount("#app");
