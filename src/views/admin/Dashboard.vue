<template>
  <div class="admin-container">
    <el-container class="main-layout">
      <!-- 侧边栏 -->
      <el-aside width="240px" class="sidebar-aside">
        <div class="sidebar-header">
          <img src="../../assets/logo.png" alt="logo" class="admin-logo">
          <span class="admin-title">管理后台</span>
        </div>
        
        <el-menu
          :default-active="route.path"
          class="admin-menu"
          router
        >
          <el-menu-item index="/admin/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/events">
            <el-icon><Ticket /></el-icon>
            <span>演出管理</span>
          </el-menu-item>
          <el-menu-item index="/home">
            <el-icon><Back /></el-icon>
            <span>返回前台</span>
          </el-menu-item>
        </el-menu>

        <div class="admin-user-info">
          <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <div class="user-detail">
            <span class="name">管理员</span>
            <span class="role">超级管理员</span>
          </div>
          <el-icon class="logout-icon" @click="handleLogout"><SwitchButton /></el-icon>
        </div>
      </el-aside>

      <!-- 主体内容 -->
      <el-main class="main-body">
        <header class="body-header">
          <h2 class="page-title">{{ currentPageTitle }}</h2>
          <div class="header-right">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item>管理中心</el-breadcrumb-item>
              <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </header>
        
        <div class="content-wrapper">
          <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { 
  User, Ticket, Back, SwitchButton 
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const currentPageTitle = computed(() => {
  if (route.path.includes('users')) return '用户管理'
  if (route.path.includes('events')) return '演出管理'
  return '数据看板'
})

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-container {
  height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  overflow: hidden;
}

.main-layout {
  height: 100%;
}

/* 侧边栏样式 */
.sidebar-aside {
  background: #fff;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.sidebar-header {
  padding: 30px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-logo {
  height: 28px;
}

.admin-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-color);
}

.admin-menu {
  border-right: none;
  background: transparent;
  flex: 1;
}

:deep(.el-menu-item) {
  height: 56px;
  line-height: 56px;
  margin: 4px 12px;
  border-radius: 12px;
  color: var(--text-secondary) !important;
  transition: all 0.3s;
}

:deep(.el-menu-item:hover) {
  background: rgba(0, 0, 0, 0.03) !important;
  color: var(--text-color) !important;
}

:deep(.el-menu-item.is-active) {
  background: var(--primary-color) !important;
  color: #fff !important;
  font-weight: bold;
}

.admin-user-info {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.user-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-detail .name { font-size: 14px; font-weight: 500; }
.user-detail .role { font-size: 12px; color: var(--text-secondary); }

.logout-icon {
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.3s;
}

.logout-icon:hover {
  color: var(--primary-color);
}

/* 主体内容样式 */
.main-body {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.body-header {
  height: 72px;
  padding: 0 40px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.page-title {
  font-size: 20px;
  font-weight: bold;
}

.content-wrapper {
  padding: 30px 40px;
  flex: 1;
  overflow-y: auto;
}

/* 面包屑样式 */
:deep(.el-breadcrumb__inner) {
  color: var(--text-secondary) !important;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: var(--text-color) !important;
}

:deep(.el-card) {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  background: #fff;
}

/* 动画效果 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-15px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(15px);
}
</style>
