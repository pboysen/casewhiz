import Vue from "vue";
import Vuex from "vuex";
import store from "./store";
import router from "./router";
import App from "./App.vue";

Vue.config.productionTip = false;
Vue.config.devtools = true;
Vue.use(Vuex);

window.addEventListener("error", function(evt) {
  /*
  console.log(
    "Caught[via 'error' event]:  '" +
      evt.message +
      "' from " +
      evt.filename +
      ":" +
      evt.lineno
  );
  */
  evt.preventDefault();
});

window.addEventListener("unhandledrejection", function(e) {
  console.error(e);
});

const eventbus = new Vue();
export default eventbus;

let vm = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");

let root = document.getElementById("zmmtg-root");
if (root) root.parentNode.removeChild(root);
root = document.getElementById("aria-notify-area");
if (root) root.parentNode.removeChild(root);

eventbus.$emit("loadDocument", {
  url: "Making the Case.pdf",
  setState: function setCaseState(pdf) {
    store.commit("addPhases", pdf.numPages);
    store.commit("setURL", "Making the Case.pdf");
    vm.$nextTick(() => store.commit("setCurrentPhase", 0));
  }
});
