module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "https://6wjw3w2zy7.execute-api.us-east-1.amazonaws.com/init",
        changeOrigin: true
      }
    }
  }
};
