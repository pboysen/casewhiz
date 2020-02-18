<script>
import WidgetWrapper from "@/views/widgets/widget-wrapper.vue";
export default {
  name: "MultipleChoice",
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
    radios() {
      let radios = [];
      let bullet = event.target;
      let node = bullet;
      let index = 1;
      while (node.offsetLeft >= bullet.offsetLeft) {
        if (node.offsetLeft == bullet.offsetLeft) {
          if (bullet.textContent != node.textContent) break;
          let top = node.offsetTop - bullet.offsetTop + 5;
          radios.push({
            value: `mc${this.wid}`,
            style: `left: 12px; top: ${top}px;`,
            key: index++
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
  <WidgetWrapper widgettype="multiplechoice">
    <div class="multiplechoice">
      <input
        v-for="radio in radios"
        type="radio"
        :key="radio.key"
        :value="radio.value"
        :style="radio.style + 'transform: scale(' + pixelRatio + ');'"
      />
    </div>
  </WidgetWrapper>
</template>
<style lang="scss" scoped>
.multiplechoice {
  padding: 0;
  position: absolute;
}
.multiplechoice input[type="radio"] {
  margin: 0;
  position: absolute;
}
</style>
