<template>
  <nav class="navbar">
    <div class="nav-content">
      <!-- 左侧：Logo、城市选择、链接 -->
      <div class="nav-left">
        <img src="../assets/logo.png" alt="logo" class="logo" @click="router.push('/')">
        
        <el-dropdown v-if="showCitySelector" trigger="click" @command="handleCityChange">
          <div class="city-selector">
            <el-icon><Location /></el-icon>
            <span>{{ city }}</span>
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu class="glass-dropdown">
              <el-dropdown-item v-for="city in cities" :key="city" :command="city">
                {{ city }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <div class="nav-links">
          <router-link to="/" :class="{ active: route.path === '/' }">首页</router-link>
          <router-link to="/category" :class="{ active: route.path === '/category' }">分类</router-link>
          <router-link to="/search" :class="{ active: route.path.startsWith('/search') }">列表</router-link>
        </div>
      </div>
      
      <!-- 中间：搜索框 -->
      <div class="nav-center">
        <el-input
          v-model="searchQuery"
          placeholder="搜索明星、演出、场馆"
          class="search-input"
          :prefix-icon="Search"
          @keyup.enter="handleSearch"
        >
          <template #append v-if="showSearchButton">
            <el-button @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>

      <!-- 右侧：用户信息/登录 -->
      <div class="nav-right">
        <div v-if="userStore.token" class="user-info">
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <span class="username">我的大麦</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu class="glass-dropdown">
                <el-dropdown-item @click="router.push('/profile')">个人中心</el-dropdown-item>
                <el-dropdown-item @click="router.push('/orders')">我的订单</el-dropdown-item>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div v-else class="login-entry">
          <el-button text @click="router.push('/login')">登录 / 注册</el-button>
        </div>
        <div class="app-download">
          <el-button text>下载APP</el-button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import { Search, Location, ArrowDown } from '@element-plus/icons-vue'

const props = defineProps({
  showCitySelector: { type: Boolean, default: false },
  showSearchButton: { type: Boolean, default: true },
  city: { type: String, default: '全国' }
})

const emit = defineEmits(['update:city'])

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const searchQuery = ref(route.query.q || '')
const cities = ['全国', '上海', '北京', '广州', '深圳', '成都', '杭州']

// 监听路由查询参数变化，同步搜索框内容
watch(() => route.query.q, (newQ) => {
  searchQuery.value = newQ || ''
})

const handleSearch = () => {
  if (searchQuery.value) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
  }
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

const handleCityChange = (city) => {
  emit('update:city', city)
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-border);
  height: 72px;
}

.nav-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 30px;
}

.logo {
  height: 36px;
  cursor: pointer;
}

.city-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  color: var(--text-color);
  padding: 6px 12px;
  border-radius: 18px;
  background: rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.city-selector:hover {
  background: rgba(0, 0, 0, 0.1);
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 16px;
  transition: all 0.3s;
  padding: 8px 12px;
  border-radius: 8px;
}

.nav-links a:hover, .nav-links a.active {
  color: var(--text-color);
  background: rgba(0, 0, 0, 0.05);
}

.nav-links a.active {
  font-weight: 600;
}

.nav-center {
  flex: 1;
  max-width: 400px;
  margin: 0 40px;
}

:deep(.search-input .el-input__wrapper) {
  background-color: #fff !important;
  box-shadow: 0 0 0 1px #dcdfe6 inset !important;
  border-radius: 20px 0 0 20px;
  transition: all 0.3s;
}

:deep(.search-input .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--primary-color) inset !important;
}

:deep(.search-input .el-input-group__append) {
  background: var(--primary-color);
  border: none;
  border-radius: 0 20px 20px 0;
  color: white;
  padding: 0 20px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--text-color);
}

.username {
  color: var(--text-color);
}

.app-download .el-button {
  color: var(--text-secondary);
}

.app-download .el-button:hover {
  color: var(--primary-color);
}

:deep(.glass-dropdown) {
  background: var(--glass-bg) !important;
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border) !important;
  border-radius: 12px;
  padding: 8px;
}
</style>
