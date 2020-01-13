<script>
import PropsMenu from "@/views/props-menu.vue";
import { mapGetters } from "vuex";
import eventBus from "@/main";

export default {
  name: "PropertyDrawer",
  components: {
    PropsMenu
  },
  mounted() {
    eventBus.$on("widgetBarMoved", e => {
      let drawer = document.getElementById("propertyDrawer");
      drawer.style.top = e.pageY - 120 + "px";
    });
  },
  data: function() {
    return {
      isOpen: false
    };
  },
  computed: {
    ...mapGetters(["selectedWidgetTypes", "phaseTitle", "submitTitle"]),
    ...mapGetters("things", ["getWidgets", "textSizes"]),
    getSize() {
      var wid = this.$store.getters.currentWidget;
      if (!wid) return 20;
      return this.$store.getters.textfieldSize(wid);
    },
    isOptional() {
      if (!wid) return false;
      var wid = this.$store.getters.currentWidget;
      return this.$store.getters.optional(wid);
    }
  },
  methods: {
    toggleTab() {
      this.isOpen = !this.isOpen;
    },
    updatePhaseTitle(e) {
      this.$store.commit("setPhaseTitle", e.target.value);
    },
    updateSubmitTitle(e) {
      this.$store.commit("setSubmitTitle", e.target.value);
    },
    updateSize(e) {
      this.$store.commit("setTextfieldSize", e.target.value);
    },
    updateOptional(e) {
      this.$store.commit("setOptional", e.target.checked);
    },
    isSelectedWidget(type) {
      let value = false;
      this.selectedWidgetTypes.forEach(name => {
        if (name === type) {
          value = true;
          return;
        }
      });
      return value;
    },
    selectWidgets(e) {
      let selected = [];
      let collection = e.originalTarget.selectedOptions;
      for (let i = 0; i < collection.length; i++)
        selected.push(collection[i].label);
      this.$store.commit("setSelectedWidgetTypes", selected);
    }
  }
};
</script>

<template>
  <div class="propertyWrapper">
    <div id="propertyDrawer" :class="['propertyDrawer', { opened: isOpen }]">
      <div class="propertyPanel" id="propertyPanel">
        <PropsMenu title="Phase">
          <label for="Phase_PhaseTitle">
            Phase Title:
            <input
              id="Phase_PhaseTitle"
              type="text"
              :value="phaseTitle"
              @input="updatePhaseTitle"
            />
          </label>
          <label for="Phase_SubmitTitle">
            Submit Title:
            <input
              id="Phase_SubmitTitle"
              type="text"
              :value="submitTitle"
              @input="updateSubmitTitle"
            />
          </label>
        </PropsMenu>
        <PropsMenu title="Textfield">
          <label for="Props_Textfield">
            Size (in characters):
            <select id="Props_Textfield" :value="getSize" @change="updateSize">
              <option
                v-for="(size, index) in textSizes"
                :value="size"
                :key="index"
              >
                {{ size }}
              </option>
            </select>
          </label>
          <label for="textfieldopt">
            <input
              id="textfieldopt"
              type="checkbox"
              :checked="isOptional ? 'checked' : ''"
              @change="updateOptional"
            />
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
                v-for="w in getWidgets"
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
      <div v-on:click="toggleTab" class="tab" id="drawerTab">
        <span :class="{ rotate: isOpen }">
          <img src="@/assets/img/triangle.png" />
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.propertyWrapper {
  position: relative;
  z-index: 2;
}
.propertyDrawer {
  position: absolute;
  width: 170px;
  top: 50px;
  left: -170px;
  padding: 0;
  transition: all 0.5s ease;
}
.tab {
  position: relative;
  left: 170px;
  border: 1px solid grey;
  border-radius: 0 4px 4px 0;
  width: 20px;
  height: 20px;
  cursor: pointer;
  top: 50px;
  background-color: lightblue;
  img {
    padding: 4px;
    transform: rotate(90deg);
    transition-duration: 0.5s;
  }
}
.opened {
  left: -16px;
}
.rotate img {
  transform: rotate(-90deg);
  transition-duration: 0.5s;
}
.propertyPanel {
  position: absolute;
  width: 85%;
  border-radius: 0 8px 8px 0;
  left: 16px;
  top: 0px;
  overflow: auto;
  border: 1px solid black;
  background-color: #eeeefe;
  padding: 4px;
  font-size: 12px;
}
.propertyPanel {
  select {
    border: 1px solid gray;
    border-radius: 0;
  }
}
</style>
