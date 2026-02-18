<template>
  <div class="profile-container">
    <!-- 顶部导航栏 -->
    <NavBar />

    <main class="main-content">
      <div class="profile-glass-card">
        <div class="user-header">
          <div class="avatar-wrapper">
            <el-avatar :size="100" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <div class="edit-badge"><el-icon><Edit /></el-icon></div>
          </div>
          <div class="user-meta">
            <h2 class="username">大麦用户_1234</h2>
            <div class="user-tags">
              <span class="tag">普通会员</span>
              <span class="tag">实名认证</span>
            </div>
            <p class="phone-mask">138****0000</p>
          </div>
        </div>

        <div class="stats-bar">
          <div class="stat-item" @click="router.push('/orders')">
            <span class="num">3</span>
            <span class="label">全部订单</span>
          </div>
          <div class="stat-item">
            <span class="num">0</span>
            <span class="label">优惠券</span>
          </div>
          <div class="stat-item">
            <span class="num">12</span>
            <span class="label">想看</span>
          </div>
        </div>

        <div class="profile-menu">
          <div class="menu-section-title">我的服务</div>
          <div class="menu-grid">
            <div class="menu-item" @click="router.push('/orders')">
              <div class="icon-box ticket"><el-icon><Ticket /></el-icon></div>
              <span>我的订单</span>
              <el-icon class="arrow"><ArrowRight /></el-icon>
            </div>
            <div class="menu-item">
              <div class="icon-box people"><el-icon><User /></el-icon></div>
              <span>常用观演人</span>
              <el-icon class="arrow"><ArrowRight /></el-icon>
            </div>
            <div class="menu-item">
              <div class="icon-box address"><el-icon><Location /></el-icon></div>
              <span>地址管理</span>
              <el-icon class="arrow"><ArrowRight /></el-icon>
            </div>
            <div class="menu-item">
              <div class="icon-box coupon"><el-icon><MagicStick /></el-icon></div>
              <span>我的优惠券</span>
              <el-icon class="arrow"><ArrowRight /></el-icon>
            </div>
            <div class="menu-item">
              <div class="icon-box service"><el-icon><Service /></el-icon></div>
              <span>在线客服</span>
              <el-icon class="arrow"><ArrowRight /></el-icon>
            </div>
            <div class="menu-item">
              <div class="icon-box setting"><el-icon><Setting /></el-icon></div>
              <span>账号设置</span>
              <el-icon class="arrow"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import NavBar from '@/components/NavBar.vue'
import { 
  Ticket, Location, Service, MagicStick, 
  ArrowRight, User, Setting, Edit 
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.main-content {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
}

.profile-glass-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 40px;
  box-shadow: var(--shadow-md);
  margin-bottom: 30px;
  border: 1px solid var(--glass-border);
}

.user-header {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid var(--glass-border);
}

.avatar-wrapper {
  position: relative;
}

.edit-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border: 3px solid #fff;
  cursor: pointer;
}

.username {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--text-color);
}

.user-tags {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.tag {
  font-size: 12px;
  padding: 4px 12px;
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-secondary);
  border-radius: 20px;
}

.phone-mask {
  color: var(--text-muted);
  font-size: 14px;
  margin: 0;
}

.stats-bar {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
  padding: 24px;
  background: #f8f8f9;
  border-radius: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.stat-item .num {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color);
}

.stat-item .label {
  font-size: 13px;
  color: var(--text-secondary);
}

.profile-menu {
  padding: 0 20px;
}

.menu-section-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--text-color);
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-item:hover {
  border-color: var(--primary-color);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
}

.icon-box.ticket { background: #ff1268; }
.icon-box.people { background: #00b4ff; }
.icon-box.address { background: #ff5a00; }
.icon-box.coupon { background: #4b56ff; }
.icon-box.service { background: #16d2ac; }
.icon-box.setting { background: #86868b; }

.menu-item span {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color);
}

.menu-item .arrow {
  color: var(--text-muted);
}
</style>

