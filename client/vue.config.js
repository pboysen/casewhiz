module.exports = {
  publicPath: "/springbuck/",
  css: {
    loaderOptions: {
      scss: {
        prependData: `
          @import "@/assets/styles/variables.scss";
          @import "@/assets/styles/mixins.scss";
        `
      }
    }
  },
  devServer: {
      proxy: 'http://springbuck/',
  }
};
