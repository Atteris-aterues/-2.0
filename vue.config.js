const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://121.199.47.63:8080', // 之前的 BaseURL (普通业务)
        changeOrigin: true,
        // pathRewrite: { '^/api': '' }  // 暂时注释掉，保留 /api 前缀尝试
      },
      // 微信登录代理配置 (独立使用 cpolar 远程地址)
      '/wxlogin': {
        target: 'https://7e84a3d1.r29.cpolar.top',
        changeOrigin: true
        // 注意：这里不需要 pathRewrite，因为后端路径就是 /wxlogin 开头
      },
      // 微信 Token 获取代理 (独立使用 cpolar 远程地址)
      '/user/wechat-token': {
        target: 'https://7e84a3d1.r29.cpolar.top',
        changeOrigin: true
      }
    }
  }
})
