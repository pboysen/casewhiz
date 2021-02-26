<script>
import widgetWrapper from "@/views/widgets/widget-wrapper.vue";
import selectWidget from "@/views/widgets/select-widget.vue";
import textfieldWidget from "@/views/widgets/textfield-widget.vue";
import uploadButton from "@/views/upload-button.vue";
import propsMixin from "@/mixins/props-mixin.js";
import * as csv from "csvtojson";
import { mapGetters } from "vuex";
const startChar = "~";

export default {
  name: "table-widget",
  mixins: [propsMixin],
  props: {
    wid: Number
  },
  data: function() {
    return {
      table: null,
      colspans: null,
      title: "Upload a CSV file",
      accept: ["text/csv"],
      multiple: false
    };
  },
  components: {
    widgetWrapper,
    textfieldWidget,
    selectWidget,
    uploadButton
  },
  computed: {
    ...mapGetters(["currentRole", "currentPhase"])
  },
  methods: {
    getProp(prop) {
      this.$store.getters.getPropValue({
        id: this.wid,
        phase: this.currentPhase,
        type: "table-widget",
        value: prop
      });
    },
    isWidget(value) {
      return String(value).startsWith(startChar);
    },
    subType(value) {
      return value.split(startChar)[1];
    },
    subId(value) {
      return Number(value.split(startChar)[2]);
    },
    col(row, col) {
      return this.colspans[`${row},${col}`];
    },
    registerColspans(table) {
      this.colspans = {};
      for (let r = 1; r < table.length; r++) {
        let c = 0;
        let cspan = 0;
        while (c < table[r].length) {
          let blank = c + 1;
          while (table[r][blank] === "" && blank < table[r].length) blank++;
          cspan = blank - c;
          if (cspan > 1) table[r].splice(c + 1, cspan - 1);
          this.colspans[`${r - 1},${c}`] = cspan;
          c++;
        }
      }
    },
    registerWidgets(table) {
      for (let r = 0; r < table.length; r++) {
        for (let c = 0; c < table[r].length; c++)
          if (String(table[r][c]).startsWith(startChar)) {
            let props = this.parse(table[r][c]);
            let type = props["type"];
            let info = { wid: null, type: type, wrec: null, props: props };
            // build widget record and register widget
            this.$store.commit("registerSubWidget", info);
            table[r][c] = `${startChar}${type}${startChar}${info.wid}`;
          }
      }
    },
    uploadCSV(files) {
      let reader = new FileReader();
      let that = this;
      reader.onload = function() {
        csv({
          noheader: true,
          output: "csv"
        })
          .fromString(reader.result)
          .then(table => {
            that.registerColspans(table);
            that.registerWidgets(table);
            let info = { wid: that.wid, prop: "table", value: table };
            that.table = table;
            that.$store.commit("setProp", info);
          });
      };
      reader.readAsText(files[0]);
    }
  }
};
/* csvtojson output
[["1","2","3"], ["4","5","6"], ["7","8","9"]]
*/
</script>
<template>
  <widget-wrapper widgettype="table-widget" :wid="wid">
    <table v-if="table != null">
      <thead>
        <tr>
          <th v-for="(head, hidx) in table[0]" :key="hidx">
            {{ head }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, ridx) in table.slice(1)" :key="ridx">
          <td
            v-for="(value, cidx) in row"
            :key="cidx"
            :colspan="col(ridx, cidx, value)"
          >
            <component
              v-if="isWidget(value)"
              :is="subType(value)"
              :wid="subId(value)"
            >
            </component>
            <span v-else>{{ value }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="table == null" id="table-widget-file">
      <upload-button
        :title="title"
        :accept="accept"
        :multiple="multiple"
        @upload-files="uploadCSV"
      >
      </upload-button>
    </div>
  </widget-wrapper>
</template>
<style lang="scss" scoped>
.widget[widgettype="table-widget"] {
  overflow: visible;
  max-width: 80%;
}
.widget[widgettype="table-widget"] table {
  table-layout: fixed;
  font-size: $small-font;
  border-collapse: collapse;
  background-color: white;
  user-select: none;
  border: 1px solid $border-color;
  tr:nth-child(odd) {
    background-color: $bg-color;
  }
  tr:nth-child(even) {
    background-color: $highlight-color;
  }
  th {
    word-wrap: break-word;
    padding: 4px;
    background-color: $highlight-color;
    width: 10%;
  }
  td {
    word-wrap: break-word;
    text-align: left;
    border: 1px solid black;
    padding: 2px;
  }
}
.widget[widgettype="table-widget"].student {
  resize: none;
  overflow: none;
  user-select: text;
}
#table-widget-file {
  width: 150px;
  background-color: white;
}
</style>
