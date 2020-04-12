<script>
import widgetWrapper from "@/views/widgets/widget-wrapper.vue";
import zoomConfig from "../../util/zoom-config.js";

export default {
  name: "zoom-widget",
  props: {
    nickname: String,
    meetingId: String
    wid: Number
  },
  components: {
    widgetWrapper
  },
  beforeCreate() {
    document.getElementById("zmmtg-root").style.display = "";
  },
  beforeDestroy() {
    document.getElementById("zmmtg-root").style.display = "none";
  },
  mounted() {
    const meetConfig = zoomConfig.MeetingCfg(489053717);
    const ZoomMtg = zoomConfig.ZoomMtg;
    // Generate Signature function
    const signature = ZoomMtg.generateSignature({
      meetingNumber: meetConfig.meetingNumber,
      apiKey: meetConfig.apiKey,
      apiSecret: meetConfig.apiSecret,
      role: meetConfig.role,
      success: res => {
        // eslint-disable-next-line
        console.log("success signature: " + res.result);
      }
    });
    // join function
    console.log("start initialization");
    ZoomMtg.init({
      leaveUrl: "http://www.zoom.us",
      isSupportAV: true,
      success: suc => {
        console.log("trying to join " + JSON.stringify(suc));
        ZoomMtg.join({
          signature: signature,
          meetingNumber: meetConfig.meetingNumber,
          userName: meetConfig.userName,
          apiKey: meetConfig.apiKey,
          userEmail: "peteboysen@gmail.com",
          passWord: meetConfig.passWord,
          success: res => {
            // eslint-disable-next-line
            console.log("join meeting success", res.result);
          },
          error: res => {
            // eslint-disable-next-line
            console.log(res);
          }
        });
      },
      error: res => {
        // eslint-disable-next-line
        console.log(res);
      }
    });
  }
};
</script>
<template>
  <widget-wrapper widgettype="zoom-widget" :wid="wid">
    <div id="zoomApp"></div>
  </widget-wrapper>
</template>
<style lang="scss" scoped>
.widget[widgettype="zoom-widget"] {
  width: 400px;
  height: 400px;
  overflow: auto;
  resize: both;
}
#zoomApp {
  width: 100%;
  height: 100%;
}
</style>
