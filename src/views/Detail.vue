<template>
  <div class="detail-container">
    <!-- 顶部导航栏 -->
    <NavBar />

    <!-- 背景高斯模糊 -->
    <div class="bg-blur" :style="{ backgroundImage: `url(${eventData.image})` }"></div>

    <main class="main-content">
      <!-- 演出概览区域 -->
      <section class="overview-section">
        <div class="poster-side">
          <img :src="eventData.image" alt="poster" class="main-poster">
        </div>
        
        <div class="info-side">
          <div class="event-tag">{{ eventData.category }}</div>
          <h1 class="event-title">{{ eventData.title }}</h1>
          
          <div class="interaction-bar">
            <div class="interaction-item" @click="toggleFavorite">
              <el-icon :class="{ active: isFavorite }"><Star /></el-icon>
              <span>{{ isFavorite ? '已收藏' : '收藏' }}</span>
            </div>
            <div class="interaction-item">
              <el-icon><Share /></el-icon>
              <span>分享</span>
            </div>
          </div>
          
          <div class="meta-info">
            <div class="meta-item">
              <el-icon><Calendar /></el-icon>
              <span>时间：{{ eventData.date }}</span>
            </div>
            <div class="meta-item">
              <el-icon><Location /></el-icon>
              <span>场馆：{{ eventData.venue }}</span>
            </div>
          </div>

          <div class="booking-card">
            <div class="price-range">
              <span class="label">票价：</span>
              <span class="value">￥{{ eventData.minPrice }} - {{ eventData.maxPrice }}</span>
            </div>

            <!-- 场次选择 -->
            <div class="selection-group">
              <span class="group-label">选择场次</span>
              <div class="option-list">
                <div 
                  v-for="(session, index) in eventData.sessions" 
                  :key="index"
                  class="option-item"
                  :class="{ active: selectedSession === index }"
                  @click="selectedSession = index"
                >
                  {{ session }}
                </div>
              </div>
            </div>

            <!-- 票价选择 -->
            <div class="selection-group">
              <span class="group-label">选择票档</span>
              <div class="option-list">
                <div 
                  v-for="(price, index) in eventData.prices" 
                  :key="index"
                  class="option-item"
                  :class="{ active: selectedPrice === index }"
                  @click="selectedPrice = index"
                >
                  ￥{{ price }}
                </div>
              </div>
            </div>

            <!-- 数量选择 -->
            <div class="selection-group">
              <span class="group-label">选择数量</span>
              <el-input-number v-model="ticketCount" :min="1" :max="6" />
              <span class="limit-tip">（每笔订单限购6张）</span>
            </div>

            <div class="action-bar">
              <div class="total-price">
                <span class="label">合计：</span>
                <span class="value">￥{{ eventData.prices[selectedPrice] * ticketCount }}</span>
              </div>
              <el-button type="primary" class="buy-btn" @click="handleBuy">立即购票</el-button>
            </div>
          </div>
        </div>
      </section>

      <!-- 详情内容页签 -->
      <section class="detail-tabs">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="项目详情" name="info">
            <div class="rich-text">
              <p v-for="(p, i) in eventData.description" :key="i">{{ p }}</p>
              <img v-for="(img, i) in eventData.detailImages" :key="i" :src="img" class="detail-img">
            </div>
          </el-tab-pane>
          <el-tab-pane label="购票须知" name="notice">
            <div class="notice-list">
              <div v-for="(item, i) in eventData.notices" :key="i" class="notice-item">
                <h4>{{ item.title }}</h4>
                <p>{{ item.content }}</p>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import NavBar from '@/components/NavBar.vue'
import { ElMessage } from 'element-plus'
import { Calendar, Location, Share, Star } from '@element-plus/icons-vue'

// 导入本地图片资源
import eventA from '@/assets/a.png'
import eventB from '@/assets/b.png'
import eventC from '@/assets/c.png'
import eventD from '@/assets/d.png'
import eventE from '@/assets/e.png'
import eventF from '@/assets/f.png'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const selectedSession = ref(0)
const selectedPrice = ref(0)
const ticketCount = ref(1)
const activeTab = ref('info')
const isFavorite = ref(false)

// 模拟所有活动数据
const allEvents = {
  '1': { title: '【上海】周杰伦“嘉年华”世界巡回演唱会', image: eventA, city: '上海', category: '演唱会', venue: '上海体育场', date: '2026.05.20 - 05.24', minPrice: 580, maxPrice: 2580 },
  '2': { title: '【北京】音乐剧《罗密欧与朱丽叶》', image: eventB, city: '北京', category: '话剧歌剧', venue: '天桥艺术中心-大剧场', date: '2026.06.12 - 06.20', minPrice: 180, maxPrice: 1080 },
  '3': { title: '【广州】2026 广州超级音乐节', image: eventC, city: '广州', category: '音乐会', venue: '广州海心沙亚运公园', date: '2026.04.15', minPrice: 399, maxPrice: 1299 },
  '4': { title: '【深圳】CBA联赛 深圳马可波罗 vs 广东东莞大益', image: eventD, city: '深圳', category: '体育', venue: '深圳大运中心体育馆', date: '2026.03.10', minPrice: 100, maxPrice: 800 },
  '5': { title: '【上海】陈奕迅 Fear and Dreams 演唱会', image: eventE, city: '上海', category: '演唱会', venue: '梅赛德斯-奔驰文化中心', date: '2026.07.10 - 07.15', minPrice: 680, maxPrice: 2580 },
  '6': { title: '【成都】李荣浩“纵横四海”巡回演唱会', image: eventF, city: '成都', category: '演唱会', venue: '凤凰山体育公园专业足球场', date: '2026.08.20', minPrice: 380, maxPrice: 1580 }
}

const currentEvent = computed(() => allEvents[route.params.id] || allEvents['1'])

const eventData = ref({
  ...currentEvent.value,
  sessions: ['2026-05-20 周三 19:30', '2026-05-21 周四 19:30', '2026-05-23 周六 19:30', '2026-05-24 周日 19:30'],
  prices: [580, 980, 1280, 1580, 2580],
  description: [
    '演出详情介绍内容：',
    '这是一场跨越时空的音乐盛宴，顶级的舞台设计与极致的音响效果。',
    '不仅有视听层面的极致享受，更是一场充满惊喜的互动体验。',
    '温馨提示：本项目要求实名制入场，请务必携带本人有效身份证件。'
  ],
  detailImages: [currentEvent.value.image],
  notices: [
    { title: '实名制购票', content: '本项目需实名制购票，购票时请提供观演人有效身份证件。' },
    { title: '退票规则', content: '本项目支持有条件退票，具体规则请查看退票政策。' },
    { title: '入场方式', content: '请携带观演人身份证原件核验入场。' }
  ]
})

const handleBuy = () => {
  if (!userStore.token) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  ElMessage.success('订单已提交，正在为您锁定座位...')
  setTimeout(() => {
    router.push('/orders')
  }, 1500)
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  ElMessage.success(isFavorite.value ? '收藏成功' : '已取消收藏')
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
.detail-container {
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  padding-bottom: 100px;
  position: relative;
  overflow: hidden;
}

/* 顶部导航栏 */
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
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo {
  height: 36px;
  cursor: pointer;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;
}

.nav-links a:hover, .nav-links a.active {
  color: var(--primary-color);
}

.nav-right .el-button {
  color: var(--text-color);
}

/* 背景模糊效果 */
.bg-blur {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 500px;
  background-size: cover;
  background-position: center;
  filter: blur(60px) brightness(0.9);
  opacity: 0.15;
  z-index: 0;
}

.main-content {
  position: relative;
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  z-index: 1;
}

/* 概览区域 */
.overview-section {
  display: flex;
  gap: 40px;
  background: var(--card-bg);
  padding: 40px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  margin-bottom: 40px;
  border: 1px solid var(--glass-border);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.overview-section:hover {
  box-shadow: var(--shadow-lg);
}

.poster-side {
  flex: 0 0 280px;
  height: 380px;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.main-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-side {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.event-tag {
  display: inline-block;
  background: rgba(255, 18, 104, 0.1);
  color: var(--primary-color);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
  width: fit-content;
}

.event-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 20px 0;
  line-height: 1.3;
  color: var(--text-color);
}

.interaction-bar {
  display: flex;
  gap: 25px;
  margin-bottom: 25px;
}

.interaction-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 14px;
  transition: all 0.3s;
}

.interaction-item:hover {
  color: var(--primary-color);
}

.interaction-item .el-icon.active {
  color: var(--primary-color);
}

.meta-info {
  margin-bottom: 30px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  color: var(--text-secondary);
  font-size: 15px;
}

/* 购票卡片 */
.booking-card {
  background: var(--bg-color);
  padding: 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--glass-border);
}

.price-range {
  margin-bottom: 24px;
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.price-range .label {
  color: var(--text-secondary);
  font-size: 14px;
}

.price-range .value {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
}

.selection-group {
  margin-bottom: 20px;
}

.group-label {
  display: block;
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.option-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.option-item {
  padding: 8px 16px;
  background: var(--card-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.option-item:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.option-item.active {
  background: var(--primary-color);
  color: #fff;
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(255, 18, 104, 0.3);
}

.limit-tip {
  font-size: 12px;
  color: var(--text-muted);
  margin-left: 10px;
}

.action-bar {
  margin-top: 30px;
  padding-top: 24px;
  border-top: 1px dashed var(--glass-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-price .label {
  color: var(--text-secondary);
  font-size: 14px;
}

.total-price .value {
  font-size: 28px;
  font-weight: 800;
  color: var(--primary-color);
}

.buy-btn {
  height: 50px;
  padding: 0 40px;
  font-size: 18px;
  font-weight: 600;
  border-radius: var(--radius-md);
  box-shadow: 0 8px 20px rgba(255, 18, 104, 0.2);
  transition: all 0.3s;
}

.buy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(255, 18, 104, 0.3);
}

/* 详情页签 */
.detail-tabs {
  background: var(--card-bg);
  padding: 30px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--glass-border);
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: var(--glass-border);
}

:deep(.el-tabs__active-bar) {
  height: 3px;
  border-radius: 3px;
}

:deep(.el-tabs__item) {
  font-size: 18px;
  font-weight: 600;
  height: 50px;
  line-height: 50px;
}

.rich-text {
  padding: 20px 0;
  line-height: 1.8;
  color: var(--text-secondary);
  font-size: 16px;
}

.detail-img {
  width: 100%;
  margin-top: 20px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.notice-item {
  margin-bottom: 30px;
}

.notice-item h4 {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-color);
}

.notice-item p {
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.6;
}
</style>

