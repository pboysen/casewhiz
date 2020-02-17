<script>
import WidgetWrapper from "@/views/widgets/widget-wrapper.vue";
export default {
  name: "Checklist",
  data: function() {
    return {
      wid: this.$options.wdata.wid,
      event: this.$options.wdata.event
    };
  },
  components: {
    WidgetWrapper
  },
  computed: {
    checks() {
      let radios = [];
      let bullet = event.target;
      let node = bullet;
      let index = 1;
      while (node.offsetLeft >= bullet.offsetLeft) {
        if (node.offsetLeft == bullet.offsetLeft) {
          if (bullet.textContent != node.textContent) break;
          let top = node.offsetTop - bullet.offsetTop + 5;
          radios.push({
            key: index++,
            value: `cl${this.wid}-${index}`,
            style: `left: 15px; top: ${top}px;`
          });
        }
        node = node.nextElementSibling;
      }
      return radios;
    },
    pixelRatio() {
      return window.devicePixelRatio;
    }
  }
};
</script>
<template>
  <WidgetWrapper widgettype="checklist">
    <div class="checklist">
      <input
        v-for="check in checks"
        type="checkbox"
        :key="check.key"
        :value="check.value"
        :style="check.style + 'transform: scale(' + pixelRatio + ');'"
      />
    </div>
  </WidgetWrapper>
</template>
<style lang="scss">
.checklist {
  position: absolute;
}
.widget .checklist {
  input[type="checkbox"] {
    position: absolute;
  }
}
</style>
