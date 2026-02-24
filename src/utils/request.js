import axios from 'axios'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 每次请求前动态获取 store，确保能拿到最新的 token
    // 注意：Pinia store 必须在 setup() 或函数中调用，不能在文件顶部直接调用
    // 这里虽然在回调函数中，但最好在调用处确保 Pinia 已安装
    // 更好的做法是直接引入 store 实例，或者在 main.js 中处理
    // 鉴于 request.js 是工具类，我们这里动态获取 store 实例
    // 但由于 import { useUserStore } from '@/store/user' 会依赖 Pinia 实例
    // 只要 request.js 是在组件或 Pinia 安装后调用的，通常没问题
    // 为了保险起见，我们可以直接读取 localStorage，或者信任 Pinia 已经就绪
    // 这里我们先尝试从 localStorage 读取 token，作为备选方案，
    // 或者直接使用 useUserStore()，因为大多数请求发生在应用启动后
    try {
        const userStore = useUserStore()
        if (userStore.token) {
        config.headers['Authorization'] = `Bearer ${userStore.token}`
        }
    } catch (e) {
        // Pinia 可能还没准备好（极少见情况），尝试读取 localStorage
        const token = localStorage.getItem('token')
        if (token) {
             config.headers['Authorization'] = `Bearer ${token}`
        }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 调试日志
    // console.log('Response:', response)
    
    // 根据接口文档，成功时直接返回数据
    // 接口文档显示成功时返回 { message: "...", success: true, ... }
    // 或者直接返回数据对象
    // 这里我们直接返回 response.data，让调用方处理
    return response.data
  },
  error => {
    // 忽略 401 时的错误提示，因为会自动触发登出逻辑
    // 特别是在 logout 接口本身返回 401 时，避免不必要的报错
    const isLogout = error.config?.url?.includes('/logout')
    
    if (error.response?.status === 401) {
      if (!isLogout) {
        const message = error.response?.data?.message || '登录已过期，请重新登录'
        ElMessage.error(message)
      }
      
      try {
        const userStore = useUserStore()
        // 只有非 logout 接口触发的 401 才需要调用 logout action
        // 否则会导致循环调用（logout -> api -> 401 -> logout -> ...）
        if (!isLogout) {
          userStore.logout()
        }
      } catch (e) {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
      }
      return Promise.reject(error)
    }
    
    // 优先显示后端返回的详细错误信息
    const resData = error.response?.data
    const message = resData?.message || resData?.error || '网络请求错误'
    
    // 如果是 400 错误，且有更详细的 errors 数组（常见于参数校验错误）
    if (error.response?.status === 400 && resData?.errors) {
        const detailedMsg = Array.isArray(resData.errors) 
          ? resData.errors.map(e => e.defaultMessage || e.message).join('; ')
          : JSON.stringify(resData.errors)
        ElMessage.error(detailedMsg || message)
     } else {
        ElMessage.error(`请求失败 (${error.response?.status}): ${message}`)
     }
     
     // console.error('Request Error Details:', error.response?.data)
     return Promise.reject(error)
   }
 )

export default service
