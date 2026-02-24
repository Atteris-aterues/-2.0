// 微信登录相关接口
// 使用相对路径请求，通过 vue.config.js 中的 proxy 转发解决跨域问题

// 1. 获取场景值
export async function getWechatSceneId() {
  // 通过 vue.config.js 代理转发请求，解决跨域问题
  // 代理规则：/wxlogin -> https://7e84a3d1.r29.cpolar.top/wxlogin
  const response = await fetch('/wxlogin/scene-id')
  if (!response.ok) throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`)
  return await response.text()
}

// 2. 获取二维码 URL
export async function getWechatQRCode(sceneId) {
  const response = await fetch(`/wxlogin/qrcode?sceneId=${sceneId}`)
  if (!response.ok) throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`)
  return await response.text()
}

// 3. 查询登录状态
export async function getWechatLoginStatus(sceneId) {
  const response = await fetch(`/wxlogin/status?sceneId=${sceneId}`)
  if (!response.ok) throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`)
  return await response.text()
}

// 4. 获取 Token (登录成功后)
export async function getWechatToken(sceneId) {
  // 代理规则：/user/wechat-token -> https://7e84a3d1.r29.cpolar.top/user/wechat-token
  const response = await fetch(`/user/wechat-token?sceneId=${sceneId}`)
  if (!response.ok) throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`)
  return await response.json()
}
