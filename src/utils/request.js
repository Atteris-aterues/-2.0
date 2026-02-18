import axios from 'axios'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '/api',
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
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
    const res = response.data
    // 这里可以根据后端的 code 进行统一处理
    return res
  },
  error => {
    ElMessage.error(error.response?.data?.message || '网络请求错误')
    return Promise.reject(error)
  }
)

export default service
