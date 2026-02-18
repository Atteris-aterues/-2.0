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
              <el-input v-model="loginForm.username" placeholder="用户名/邮箱" :prefix-icon="UserIcon" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" :prefix-icon="LockIcon" show-password autocomplete="new-password" />
            </el-form-item>
            <el-button type="primary" class="login-btn" @click="handleLogin" :loading="loading">登录 / 注册</el-button>
          </el-form>
        </el-tab-pane>

        <!-- 邮箱登录 -->
        <el-tab-pane label="邮箱登录" name="email">
          <el-form :model="emailForm" :rules="rules" ref="emailFormRef" label-position="top">
            <el-form-item prop="email">
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
            <div class="qr-code">
              <el-icon :size="150"><component :is="PictureIcon" /></el-icon>
              <p>微信扫码 安全登录</p>
            </div>
          </div>
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
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { User as UserIcon, Lock as LockIcon, Message as MessageIcon, Key as KeyIcon, Picture as PictureIcon } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const activeTab = ref('password')
const loading = ref(false)
const particleCanvas = ref(null)
const pwdFormRef = ref(null)
const emailFormRef = ref(null)

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
})

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
const countdown = ref(60)
const timer = ref(null)

const loginForm = reactive({ username: '', password: '' })
const emailForm = reactive({ email: '', code: '' })

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

const handleLogin = async () => {
  loading.value = true
  // 这里后续对接后端登录接口
  setTimeout(() => {
    userStore.setToken('mock-token')
    ElMessage.success('登录成功')
    router.push('/')
    loading.value = false
  }, 1000)
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
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding-right: 10%;
  padding-top: 5%;
  background-color: var(--bg-color);
  position: relative;
  overflow: hidden;
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

.footer-slogan p {
  margin: 10px 0;
  font-size: 64px;
  font-weight: 900;
  letter-spacing: 6px;
  line-height: 1.1;
  background: linear-gradient(to bottom, var(--text-color), var(--text-secondary));
  -webkit-background-clip: text;
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
  min-height: 700px;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
  z-index: 1;
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.05);
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
  background: #f5f5f7;
  padding: 40px;
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  color: var(--text-secondary);
}

.qr-code p {
  margin-top: 20px;
  font-size: 14px;
  letter-spacing: 1px;
}
</style>
