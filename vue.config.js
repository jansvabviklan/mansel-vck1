const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ]/*,
  devServer: {
    proxy: {
      '/V1': {
            target: 'https://www.viklan.cz/',
            changeOrigin: true,
            pathRewrite: {
            '^/V1': ''
          }
      },
      '/V2': {
            target: 'http://localhost:81/', 
            changeOrigin: true,
            pathRewrite: {
            '^/V2': ''
          }
      },
      '/V3': {
        target: 'http://192.168.1.8:5010/',
        changeOrigin: true,
        pathRewrite: {
        '^/V3': ''
        },
      }     
    }
  }*/
})
