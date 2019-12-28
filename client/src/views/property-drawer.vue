<script> 
import PropsMenu from "@/views/props-menu.vue";
import { mapGetters } from "vuex";
export default {
  name: "PropertyDrawer",
  components: {
    PropsMenu
  },
  computed: {
    ...mapGetters([
      "currentPhaseTitle",
      "currentSubmitTitle",
      "currentTextfieldSize",
      "selectedWidgets"
    ])
  },
  data: function() {
    return {
      isOpen: false
    };
  },
  methods: {
    toggleTab() {
      this.isOpen = !this.isOpen;
    },
    setPhaseTitle(title) {
      this.$store.commit("setPhaseTitle", title);
    },
    setSubmitTitle(title) {
      this.$store.commit("setSubmitTitle", title);
    },
    isSelectedWidget(type) {
      this.$store.getters.selectedWidgetTypes.forEach(name => {
        if (name === type) return true;
      });
      return false;
    },
    selectWidgets(e) {
      var selected = [];
      var collection = e.originalTarget.selectedOptions;
      for (let i = 0; i < collection.length; i++)
        selected.push(collection[i].label);
      this.$store.commit("setSelectedWidgetTypes", selected);
    }
  }
};
</script>

<template>
  <div class="propertyWrapper">
    <div :class="['propertyDrawer', { opened: isOpen }]">
      <div v-on:click="toggleTab" class="tab">
        <span :class="{ rotate: isOpen }">
          <img src="@/assets/img/triangle.png" />
        </span>
      </div>
      <div class="propertyPanel">
        <PropsMenu title="Phase">
          <label for="Phase_PhaseTitle">
            Phase Title:
            <input
              id="Phase_PhaseTitle"
              type="text"
              :value="currentPhaseTitle"
              @keyup="setPhaseTitle($event.target.value)"
            />
          </label>
          <label for="Phase_SubmitTitle">
            Submit Title:
            <input
              id="Phase_SubmitTitle"
              type="text"
              :value="currentSubmitTitle"
              @keyup="setSubmitTitle($event.target.value)"
            />
          </label>
        </PropsMenu>
        <PropsMenu title="Textfield">
          <label for="Props_Textfield">
            Size (in characters):
            <input
              id="Props_Textfield"
              type="text"
              style="text-align:right; width: 2em"
              :value="currentTextfieldSize"
            />
          </label>
          <label for="textfieldopt">
            <input id="textfieldopt" type="checkbox" value="textfieldOpt" />
            Optional
          </label>
        </PropsMenu>
        <PropsMenu title="Textarea">
          Select Sources:
          <select id="CarryForwardArea" multiple="multiple" size="4"></select>
          <label for="textareaopt">
            <input id="textareaopt" type="checkbox" value="textareaOpt" />
            Optional
          </label>
        </PropsMenu>
        <PropsMenu title="Select">
          <label for="Props_Select">
            Options<br />
            (separated by ';'):
            <input id="Props_Select" type="text" value="" />
          </label>
          <label for="selectopt">
            <input id="selectopt" type="checkbox" value="textfieldOpt" />
            Optional
          </label>
        </PropsMenu>
        <PropsMenu title="CarryForward">
          <label for="CF_Select">
            <select class="cfSources" multiple="multiple" size="4"></select>
          </label>
          <label for="CF_Order">
            Order:
            <input type="text" id="cfOrder" cols="30" readonly="readonly" />
          </label>
        </PropsMenu>
        <PropsMenu title="Media">
          <label for="Media_URL">
            URL:
            <input id="Media_URL" type="text" value="" />
          </label>
        </PropsMenu>
        <PropsMenu title="Widgets">
          <label for="Props_Select">
            Select:
            <select
              id="Props_Select"
              multiple="multiple"
              size="4"
              @change="selectWidgets"
            >
              <option
                v-for="w in selectedWidgets"
                :value="w.type"
                :key="w.type"
                :selected="isSelectedWidget(w.type)"
              >
                {{ w.type }}
              </option>
            </select>
          </label>
        </PropsMenu>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.propertyWrapper {
  position: relative;
}
.propertyDrawer {
  position: absolute;
  height: 700px;
  width: 170px;
  top: 0px;
  right: -154px;
  padding: 0;
  transition: all 0.5s ease;
}
.tab {
  border-radius: 4px;
  border: 1px solid black;
  width: 24px;
  height: 20px;
  cursor: pointer;
  position: relative;
  left: -4px;
  font-size: 14px;
  top: 25%;
  background-color: lightblue;
  img {
    padding: 4px;
    transform: rotate(-90deg);
    transition-duration: 0.5s;
  }
}
.opened {
  right: 0px;
}
.rotate img {
  transform: rotate(90deg);
  transition-duration: 0.5s;
}
.propertyPanel {
  position: absolute;
  height: 85%;
  width: 85%;
  border-radius: 8px 0px 0 8px;
  left: 16px;
  top: 0px;
  overflow: auto;
  border: 1px solid black;
  background-color: #eeeefe;
  padding: 4px;
  font-size: 12px;
}
</style>
