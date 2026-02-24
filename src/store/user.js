import { defineStore } from 'pinia'
import { loginOrRegister, getUserInfo, logout as logoutApi } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => {
    let userInfo = null
    try {
      const stored = localStorage.getItem('userInfo')
      if (stored && stored !== 'undefined') {
        userInfo = JSON.parse(stored)
      }
    } catch (e) {
      console.warn('Failed to parse userInfo from localStorage', e)
      localStorage.removeItem('userInfo')
    }
    return {
      token: localStorage.getItem('token') || '',
      userInfo
    }
  },
  actions: {
    // 登录或注册
    async login(loginForm) {
      try {
        // 构建请求参数
        const data = {
          username: loginForm.username,
          password: loginForm.password
        }
        
        // 只有在提供了 email 且不为空字符串时才发送
        // 避免发送 null 或 "" 导致后端校验失败
        if (loginForm.email && loginForm.email.trim() !== '') {
          data.email = loginForm.email
        }
        
        // console.log('Sending login request with:', JSON.stringify(data))

        const res = await loginOrRegister(data)
        console.log('Login response:', res)
        
        if (res.token) {
            this.setToken(res.token)
            // 登录成功后，接口直接返回了部分用户信息
            // 我们可以直接保存，或者再调用一次 getUserInfo 获取更全的信息
            // 接口返回：token, userId, username, role, message
            const userInfo = {
                id: res.userId,
                username: res.username,
                role: res.role
            }
            this.setUserInfo(userInfo)
            return res
        }
        return Promise.reject(new Error(res.message || '登录失败'))
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 获取用户信息
    async getInfo() {
      try {
        const res = await getUserInfo()
        // 接口文档返回结构：
        // { id: 0, username: "string", ... }
        this.setUserInfo(res)
        return res
      } catch (error) {
        return Promise.reject(error)
      }
    },

    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    
    setUserInfo(info) {
      this.userInfo = info
      localStorage.setItem('userInfo', JSON.stringify(info))
    },
    
    // 退出登录
    async logout() {
      try {
        await logoutApi()
      } catch (error) {
        console.warn('Logout API failed:', error)
      } finally {
        this.token = ''
        this.userInfo = null
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
      }
    }
  }
})
