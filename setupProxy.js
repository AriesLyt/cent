const proxy = require('http-proxy-middleware')
const processUrl = require("./src/env/process")

// console.log(processUrl(process.env.NODE_ENV))

module.exports = function (app) {
  app.use(
    proxy.createProxyMiddleware(
      '/api',
      {
      target: "http://localhost:8718",//服务器的地址
      changeOrigin: true,
      pathRewrite: {
        "^/api": ""
      }
    }));
}