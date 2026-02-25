<template>
  <div class="login-container">
    <!-- 粒子背景画布 -->
    <canvas ref="particleCanvas" class="particle-canvas"></canvas>

    <el-card class="login-card">
      <template #header>
        <div class="login-header">
          <img src="../assets/logo.png" alt="logo" class="logo">
          <h2>大麦 2.0 - 登录/注册</h2>
        </div>
      </template>

      <el-tabs v-model="activeTab" stretch>
        <!-- 密码登录 -->
        <el-tab-pane label="密码登录" name="password">
          <el-form :model="loginForm" :rules="rules" ref="pwdFormRef" label-position="top">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="用户名" :prefix-icon="UserIcon" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" :prefix-icon="LockIcon" show-password autocomplete="new-password" />
            </el-form-item>
            <el-form-item prop="email" v-if="isRegister">
              <el-input v-model="loginForm.email" placeholder="请输入邮箱" :prefix-icon="MessageIcon" autocomplete="off" />
            </el-form-item>
            <el-button type="primary" class="login-btn" @click="handleLogin" :loading="loading">{{ isRegister ? '注 册' : '登 录' }}</el-button>
            <div class="form-footer">
              <span class="toggle-mode" @click="toggleMode">
                {{ isRegister ? '已有账号？去登录' : '没有账号？去注册' }}
              </span>
            </div>
          </el-form>
        </el-tab-pane>

        <!-- 邮箱登录 -->
        <el-tab-pane label="邮箱登录" name="email">
          <el-form :model="emailForm" :rules="rules" ref="emailFormRef" label-position="top">
            <el-form-item prop="emailCode">
              <el-input v-model="emailForm.email" placeholder="请输入邮箱" :prefix-icon="MessageIcon" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="code">
              <div class="code-input">
                <el-input v-model="emailForm.code" placeholder="验证码" :prefix-icon="KeyIcon" autocomplete="off" />
                <el-button @click="sendCode" :disabled="!!timer">
                  {{ timer ? `${countdown}s` : '获取验证码' }}
                </el-button>
              </div>
            </el-form-item>
            <el-button type="primary" class="login-btn" @click="handleEmailLogin" :loading="loading">登录 / 注册</el-button>
          </el-form>
        </el-tab-pane>

        <!-- 微信扫码 -->
        <el-tab-pane label="微信扫码" name="wechat">
          <div class="wechat-login">
            <div class="qr-code" v-loading="!qrcodeUrl && activeTab === 'wechat'">
              <img v-if="qrcodeUrl" :src="qrcodeUrl" alt="WeChat QR Code" style="width: 200px; height: 200px; object-fit: contain;">
              <el-icon v-else :size="150"><component :is="PictureIcon" /></el-icon>
              <p>微信扫码 安全登录</p>
            </div>
          </div>
        </el-tab-pane>
        
        <!-- 管理员登录 -->
        <el-tab-pane label="管理员登录" name="admin">
          <el-form :model="adminForm" ref="adminFormRef" label-position="top">
            <el-form-item label="管理员账号">
              <el-input v-model="adminForm.account" placeholder="管理员账号" autocomplete="off" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="adminForm.password" type="password" placeholder="请输入密码" show-password autocomplete="new-password" />
            </el-form-item>
            <el-button type="primary" class="login-btn" @click="handleAdminLogin" :loading="loading">登 录</el-button>
            <div class="form-footer">
              <span class="toggle-mode" @click="activeTab = 'password'">返回普通登录</span>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 左上角标语 -->
    <div class="footer-slogan">
      <p>让每一场热爱，都触手可及。</p>
      <p class="en">Damai 2.0:<br>Bringing every passion within your reach.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { User as UserIcon, Lock as LockIcon, Message as MessageIcon, Key as KeyIcon, Picture as PictureIcon } from '@element-plus/icons-vue'
import gsap from 'gsap'
import { getWechatSceneId, getWechatQRCode, getWechatLoginStatus, getWechatToken } from '@/api/wechat'
import { adminLogin } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()
const activeTab = ref('password')
const isRegister = ref(false)
const loading = ref(false)
const particleCanvas = ref(null)
const pwdFormRef = ref(null)
const emailFormRef = ref(null)
const adminFormRef = ref(null)

// 粒子背景逻辑
let animationFrameId = null
const initParticles = () => {
  const canvas = particleCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  let particles = []
  
  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  class Particle {
    constructor() {
      this.reset()
    }
    reset() {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.size = Math.random() * 2 + 0.5
      this.speedX = Math.random() * 0.5 - 0.25
      this.speedY = Math.random() * 0.5 - 0.25
      this.opacity = Math.random() * 0.5 + 0.2
    }
    update() {
      this.x += this.speedX
      this.y += this.speedY
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset()
      }
    }
    draw() {
      ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity * 0.2})`;
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const createParticles = () => {
    particles = []
    const count = Math.floor((canvas.width * canvas.height) / 15000)
    for (let i = 0; i < count; i++) {
      particles.push(new Particle())
    }
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => {
      p.update()
      p.draw()
    })
    // 绘制连线
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 100) {
          ctx.strokeStyle = `rgba(0, 0, 0, ${0.05 * (1 - distance / 100)})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }
    animationFrameId = requestAnimationFrame(animate)
  }

  window.addEventListener('resize', resize)
  resize()
  createParticles()
  animate()
}

onMounted(() => {
  initParticles()
  
  const tl = gsap.timeline();

  // 1. Slogan (Main Text)
  tl.from('.footer-slogan p:not(.en)', {
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: 'power4.out'
  })
  // 2. Slogan (Subtitle) - Overlap slightly
  .from('.footer-slogan .en', {
    y: 50,
    opacity: 0,
    duration: 1.5,
    ease: 'power3.out'
  }, '-=1.2')
})

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
const countdown = ref(60)
const timer = ref(null)

const loginForm = reactive({ username: '', password: '', email: '' })
const emailForm = reactive({ email: '', code: '' })
const adminForm = reactive({ account: '', password: '' })

// 微信登录逻辑
const qrcodeUrl = ref('')
let wechatTimer = null
let currentSceneId = ''

const startWechatLogin = async () => {
  try {
    // 1. 获取场景值
    const sceneId = await getWechatSceneId()
    if (activeTab.value !== 'wechat') return
    currentSceneId = sceneId
    
    // 2. 获取二维码 URL
    const url = await getWechatQRCode(currentSceneId)
    if (activeTab.value !== 'wechat') return
    qrcodeUrl.value = url
    
    // 3. 开始轮询状态
    stopWechatLogin()
    wechatTimer = setInterval(async () => {
      try {
        if (activeTab.value !== 'wechat') {
            stopWechatLogin()
            return
        }
        const status = await getWechatLoginStatus(currentSceneId)
        if (status === 'success') {
          stopWechatLogin()
          // 4. 登录成功，获取 Token
          const tokenRes = await getWechatToken(currentSceneId)
          if (tokenRes.code === 200 || tokenRes.success || (tokenRes.data && tokenRes.data.token)) {
             const token = tokenRes.data ? tokenRes.data.token : tokenRes.token
             userStore.setToken(token)
             ElMessage.success('登录成功')
             // 获取用户信息并跳转
             try {
               await userStore.getInfo()
             } catch (e) {
               console.warn('Get user info failed', e)
             }
             router.push('/home')
          } else {
             ElMessage.error(tokenRes.message || '获取Token失败')
          }
        }
      } catch (e) {
        console.error('WeChat polling error', e)
      }
    }, 2000)
  } catch (error) {
    let msg = '微信登录服务连接失败，请检查网络或后台服务'
    if (error.message && error.message.includes('404')) {
      msg = '微信登录服务未找到 (404)，请确认后端服务已启动且代理配置生效'
    } else if (error.message && error.message.includes('Network response was not ok')) {
      msg = `微信登录接口异常: ${error.message}`
    }
    ElMessage.error(msg)
    console.error('WeChat Login Init Error:', error)
  }
}

const stopWechatLogin = () => {
  if (wechatTimer) {
    clearInterval(wechatTimer)
    wechatTimer = null
  }
}

watch(activeTab, (newVal) => {
  if (newVal === 'wechat') {
    startWechatLogin()
  } else {
    stopWechatLogin()
    qrcodeUrl.value = ''
  }
})

// 清理定时器
onUnmounted(() => {
  stopWechatLogin()
})

const rules = computed(() => {
  const baseRules = {
    username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    emailCode: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ],
    code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
  }
  
  if (isRegister.value) {
    baseRules.email = [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ]
  }
  
  return baseRules
})

const toggleMode = () => {
  isRegister.value = !isRegister.value
  // 重置表单验证
  if (pwdFormRef.value) {
    pwdFormRef.value.clearValidate()
  }
}

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  
  if (isRegister.value && !loginForm.email) {
    ElMessage.warning('请输入邮箱')
    return
  }

  loading.value = true
  try {
    const res = await userStore.login(loginForm)
    ElMessage.success(res.message || (isRegister.value ? '注册成功' : '登录成功'))
    router.push('/home')
  } catch (error) {
    console.error('Login error:', error)
    // 错误信息已在 request.js 中通过 ElMessage 显示，这里不再重复显示
  } finally {
    loading.value = false
  }
}

const sendCode = () => {
  if (!emailForm.email) return ElMessage.warning('请先输入邮箱')
  ElMessage.success('验证码已发送')
  timer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer.value)
      timer.value = null
      countdown.value = 60
    }
  }, 1000)
}

const handleEmailLogin = () => {
  ElMessage.info('邮箱登录功能开发中...')
}

const handleAdminLogin = async () => {
  if (!adminForm.account || !adminForm.password) {
    ElMessage.warning('请输入管理员账号和密码')
    return
  }
  loading.value = true
  try {
    const res = await adminLogin({ account: adminForm.account, password: adminForm.password })
    if (res && res.token) {
      userStore.setToken(res.token)
      const info = {
        id: res.userId,
        username: res.username,
        role: res.role,
        isAdmin: true
      }
      userStore.setUserInfo(info)
      ElMessage.success(res.message || '管理员登录成功')
      router.push('/admin/events')
    } else {
      ElMessage.error(res?.message || '管理员登录失败')
    }
  } catch (e) {
    // 错误信息在请求拦截器中已处理
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 10%;
  background-color: var(--bg-color);
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.footer-slogan {
  position: absolute;
  left: 40px;
  top: 40px;
  text-align: left;
  color: var(--text-color);
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  pointer-events: none;
  z-index: 0;
}

.wechat-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}


.qr-code p {
  margin-top: 15px;
  color: #666;
  font-size: 14px;
}

.form-footer {
  margin-top: 15px;
  text-align: center;
}

.toggle-mode {
  color: var(--primary-color);
  cursor: pointer;
  font-size: 14px;
}
.toggle-mode:hover {
  text-decoration: underline;
}

.footer-slogan p {
  margin: 10px 0;
  font-size: 64px;
  font-weight: 900;
  letter-spacing: 6px;
  line-height: 1.1;
  background: linear-gradient(to bottom, var(--text-color), var(--text-secondary));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.footer-slogan .en {
  font-size: 32px;
  color: var(--text-muted);
  letter-spacing: 1px;
  text-transform: uppercase;
  line-height: 1.2;
}

.login-card {
  width: 500px;
  min-height: 550px;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
  z-index: 1;
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.05);
  margin: 40px 0;
}

:deep(.el-card__header) {
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

:deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 60px 50px !important;
}

.login-header {
  text-align: center;
  padding-bottom: 20px;
}

.login-header h2 {
  font-size: 28px;
  margin-bottom: 15px;
  color: var(--text-color);
  letter-spacing: 2px;
  font-weight: 700;
}

.logo {
  width: 100px;
  margin-bottom: 15px;
}

:deep(.el-tabs__content) {
  padding-top: 30px;
}

:deep(.el-form-item) {
  margin-bottom: 45px;
}

:deep(.el-tabs__item) {
  font-size: 18px;
  height: 60px;
  line-height: 60px;
  color: var(--text-secondary);
}

:deep(.el-tabs__item.is-active) {
  color: var(--text-color);
  font-weight: 700;
}

:deep(.el-tabs__active-bar) {
  background-color: var(--primary-color);
}

:deep(.el-input__wrapper) {
  background-color: #f5f5f7 !important;
  box-shadow: none !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
  border-radius: 12px;
  transition: all 0.3s;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary-color) !important;
  background-color: #ffffff !important;
  box-shadow: 0 0 0 1px var(--primary-color) inset !important;
}

:deep(.el-input__inner) {
  height: 55px;
  font-size: 16px;
  color: var(--text-color);
}

:deep(.el-input__inner::placeholder) {
  color: var(--text-muted);
}

:deep(.el-input__prefix-inner .el-icon) {
  font-size: 20px;
  color: var(--text-secondary);
}

.login-btn {
  width: 100%;
  height: 60px;
  margin-top: 30px;
  font-size: 22px;
  background: linear-gradient(135deg, #ff1268 0%, #ff5593 100%);
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-weight: bold;
  letter-spacing: 4px;
  box-shadow: 0 8px 24px rgba(255, 18, 104, 0.25);
  transition: all 0.3s;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(255, 18, 104, 0.4);
}

.code-input {
  display: flex;
  gap: 12px;
}

.code-input .el-button {
  height: 55px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: var(--text-color);
  transition: all 0.3s;
}

.code-input .el-button:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.wechat-login {
  text-align: center;
  padding: 40px 0;
}

.qr-code {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f7;
  padding: 40px;
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.qr-code p {
  margin-top: 20px;
  font-size: 14px;
  letter-spacing: 1px;
}
</style>
