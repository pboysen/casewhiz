<script>
import propsMenu from "@/components/props-menu.vue";
import { mapGetters } from "vuex";

export default {
  name: "PropertyDrawer",
  components: {
    propsMenu
  },
  data: function() {
    return {
      isOpen: false
    };
  },
  computed: {
    ...mapGetters([
      "currentWidget",
      "currentPhase",
      "noListWidgets",
      "possibleSources",
      "selectedWidgetTypes",
      "phaseTitle",
      "submitTitle"
    ]),
    ...mapGetters("factory", ["textSizes"]),
    getStyle() {
      return "top: " + this.$store.getters.getDrawerEvent.top + "px;";
    }
  },
  methods: {
    toggleTab() {
      this.isOpen = !this.isOpen;
    },
    getProp(type, prop) {
      let info = {
        wid: this.currentWidget,
        phase: this.currentPhase,
        type: type,
        prop: prop
      };
      return this.$store.getters.getPropValue(info);
    },
    setProp(prop, value) {
      let info = {
        wid: this.currentWidget,
        phase: this.currentPhase,
        prop: prop,
        value: value
      };
      this.$store.commit("setProp", info);
    },
    setPhaseTitle(e) {
      this.$store.commit("setPhaseTitle", e.target.value);
    },
    setSubmitTitle(e) {
      this.$store.commit("setSubmitTitle", e.target.value);
    },
    selectSources(select, prop) {
      let selectedSources = [];
      let sources = [...select.options];
      sources
        .filter(option => option.selected)
        .map(option => {
          let values = option.value.split(",");
          selectedSources.push({
            phase: values[0],
            wid: values[1]
          });
        });
      this.setProp(prop, selectedSources);
    },
    isSelectedSource(type, src) {
      let sources = this.getProp(type, "sources");
      let value = false;
      sources.forEach(s => {
        if (s.wid == src.wid) value = true;
      });
      return value;
    },
    srcValue(src) {
      return `${src.phase},${src.wid}`;
    },
    isSelectedWidget(type) {
      let value = false;
      this.selectedWidgetTypes.forEach(name => {
        if (name === type) value = true;
      });
      return value;
    },
    selectAnswers(e) {
      let selected = [];
      let collection = e.originalTarget.selectedOptions;
      for (let i = 0; i < collection.length; i++)
        selected.push(collection[i].label);
      this.$store.commit("setSelectedWidgetTypes", selected);
    },
    formatSource: src => `P${src.phase + 1}: ${src.wid}. ${src.type}`
  }
};
</script>

<template>
  <div
    id="propertyDrawer"
    :class="['propertyDrawer', { opened: isOpen }]"
    :style="getStyle"
  >
    <div id="propertyPanel">
      <props-menu title="Phase" type="phase">
        <label for="Phase_PhaseTitle">
          Phase Title:
          <br />
          <input
            id="Phase_PhaseTitle"
            type="text"
            :value="phaseTitle"
            @input="setPhaseTitle"
          />
        </label>
        <label for="Phase_SubmitTitle">
          Submit Title:
          <br />
          <input
            id="Phase_SubmitTitle"
            type="text"
            :value="submitTitle"
            @input="setSubmitTitle"
          />
        </label>
      </props-menu>
      <props-menu title="Widget Selection" type="widget">
        <label for="Props_Select">
          Select:
          <br />
          <select
            id="Props_Select"
            multiple="multiple"
            size="3"
            @change="selectAnswers"
          >
            <option
              v-for="w in noListWidgets"
              :value="w.type"
              :key="w.type"
              :selected="isSelectedWidget(w.type)"
            >
              {{ w.type }}
            </option>
          </select>
        </label>
      </props-menu>
      <props-menu title="Textfield" type="textfield-widget">
        <label for="textfield">
          Size (in characters):
          <br />
          <select
            id="textfield"
            :value="getProp('textfield-widget', 'textSize')"
            @change="setProp('textSize', $event.target.value)"
          >
            <option
              v-for="(size, index) in textSizes"
              :value="size"
              :key="index"
            >
              {{ size }}
            </option>
          </select>
        </label>
        <label for="textfield-opt">
          <input
            id="textfield-opt"
            type="checkbox"
            :checked="getProp('textfield-widget', 'optional')"
            @change="setProp('optional', $event.target.checked)"
          />
          Optional
        </label>
        <div class="options">
          <label for="textfield-widgets">
            Answers
            <br />
            <input
              id="textfield-widgets"
              type="text"
              placeholder="dog,cat,parakeet"
              :value="getProp('textfield-widget', 'textOptions')"
              @input="setProp('textOptions', $event.target.value)"
            />
          </label>
          <label for="CFtextfield">
            Widget Sources:
            <br />
            <select
              id="CFtextfield"
              multiple
              size="3"
              @change="selectSources($event.target, 'sources')"
            >
              <option
                v-for="src in possibleSources"
                :value="srcValue(src)"
                :key="src.wid"
                :selected="isSelectedSource('textfield-widget', src)"
              >
                {{ formatSource(src) }}
              </option>
            </select>
          </label>
        </div>
      </props-menu>
      <props-menu title="Textarea" type="textarea-widget">
        <label for="CFtextarea">
          Widget Sources:
          <br />
          <select
            id="CFtextarea"
            multiple
            size="3"
            @change="selectSources($event.target, 'sources')"
          >
            <option
              v-for="src in possibleSources"
              :value="srcValue(src)"
              :key="src.wid"
              :selected="isSelectedSource('textarea-widget', src)"
            >
              {{ formatSource(src) }}
            </option>
          </select>
        </label>
        <label for="textarea-opt">
          <input
            id="textarea-opt"
            type="checkbox"
            :checked="getProp('textarea-widget', 'optional')"
            @change="setProp('optional', $event.target.checked)"
          />
          Optional
        </label>
      </props-menu>
      <props-menu title="Select" type="select-widget">
        <label for="Props_Select">
          Options:
          <br />
          <input
            id="Props_Select"
            type="text"
            :value="getProp('select-widget', 'selectOptions')"
            @input="setProp('selectOptions', $event.target.value)"
            placeholder="dog,cat,parakeet"
          />
        </label>
        <label for="selectsize">
          Size(visible rows):
          <br />
          <input
            id="selectsize"
            type="text"
            :value="getProp('select-widget', 'selectSize')"
            placeholder="4"
            @input="setProp('selectSize', $event.target.value)"
          />
        </label>
        <label for="selectcorrect">
          Correct Answer:
          <br />
          <input
            id="selectcorrect"
            type="text"
            :value="getProp('select-widget', 'correct')"
            placeholder="cat"
            @input="setProp('correct', $event.target.value)"
          />
        </label>
        <label for="selectopt">
          <input
            id="selectopt"
            type="checkbox"
            :checked="getProp('select-widget', 'optional')"
            @change="setProp('optional', $event.target.checked)"
          />
          Optional
        </label>
      </props-menu>
      <props-menu title="CarryForward" type="carry-forward">
        <label for="CF_Src">
          Widget Sources:
          <br />
          <select
            id="CF_Src"
            multiple="multiple"
            size="3"
            @change="selectSources($event.target, 'sources')"
          >
            <option
              v-for="src in possibleSources"
              :value="srcValue(src)"
              :key="src.wid"
              :selected="isSelectedSource('carry-forward', src)"
            >
              {{ formatSource(src) }}
            </option>
          </select>
        </label>
      </props-menu>
      <props-menu title="MediaWidget" type="media-widget">
        <label for="Media_URL">
          URL:
          <br />
          <input
            id="Media_SRC"
            type="text"
            :value="getProp('media-widget', 'mediaSrc')"
            placeholder="https://www.arizona.edu"
            @input="setProp('mediaSrc', $event.target.value)"
          />
        </label>
      </props-menu>
    </div>
    <div v-on:click="toggleTab" id="drawerTab">
      <span :class="{ rotate: isOpen }">
        <img src="@/assets/img/triangle.png" />
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#propertyDrawer {
  position: absolute;
  width: 170px;
  top: 50px;
  left: -178px;
  padding: 0;
  transition: all 0.5s;
}
#propertyPanel {
  background-color: $bg-color;
}
#drawerTab {
  position: absolute;
  left: 170px;
  border-top: 1px solid $border-color;
  border-right: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  border-radius: 0 4px 4px 0;
  width: 20px;
  height: 20px;
  cursor: pointer;
  top: 50px;
  background-color: $highlight-color;
}
#drawerTab img {
  left: 170px;
  padding: 4px;
  transform: rotate(90deg);
  transition-duration: 0.5s;
}
#propertyDrawer.opened {
  left: -24px;
}
#drawerTab .rotate img {
  transform: rotate(-90deg);
  transition-duration: 0.75s;
}
#propertyPanel {
  position: absolute;
  width: 85%;
  border-radius: 0 8px 8px 0;
  left: 16px;
  top: 0px;
  overflow: auto;
  border: 1px solid $border-color;
  padding: 4px;
  font-size: 12px;
}
#propertyPanel input[type="text"] {
  width: 100px;
}
#propertyPanel select {
  border: 1px solid $border-color;
  width: 130px;
  border-radius: 0;
  overflow: none;
}
.options {
  background-color: green;
  border: 1px dotted black;
}
</style>
