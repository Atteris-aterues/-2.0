<template>
  <div class="search-container">
    <!-- 顶部导航栏 -->
    <NavBar />

    <main class="main-content">
      <!-- 筛选区域 -->
      <section class="filter-section">
        <div class="filter-group">
          <span class="filter-label">城市：</span>
          <div class="filter-options">
            <span v-for="city in cities" :key="city" :class="{ active: currentCity === city }" @click="currentCity = city">{{ city }}</span>
          </div>
        </div>
        <div class="filter-group">
          <span class="filter-label">分类：</span>
          <div class="filter-options">
            <span v-for="cat in categories" :key="cat" :class="{ active: currentCategory === cat }" @click="currentCategory = cat">{{ cat }}</span>
          </div>
        </div>
        <div class="filter-group">
          <span class="filter-label">时间：</span>
          <div class="filter-options">
            <span v-for="time in times" :key="time" :class="{ active: currentTime === time }" @click="currentTime = time">{{ time }}</span>
          </div>
        </div>
      </section>

      <!-- 结果统计 -->
      <section class="result-header">
        <div class="stat">共 <span>{{ filteredEvents.length }}</span> 个相关演出</div>
        <div class="sort-options">
          <span :class="{ active: sortBy === 'recommend' }" @click="sortBy = 'recommend'">综合排序</span>
          <span :class="{ active: sortBy === 'recent' }" @click="sortBy = 'recent'">最近开场</span>
          <span :class="{ active: sortBy === 'price' }" @click="sortBy = 'price'">价格最低</span>
        </div>
      </section>

      <!-- 结果列表 -->
      <section class="result-list">
        <div 
          v-for="event in filteredEvents" 
          :key="event.id" 
          class="event-horizontal-card"
          @click="router.push(`/detail/${event.id}`)"
        >
          <div class="event-poster">
            <img :src="event.image" :alt="event.title" loading="lazy">
            <div class="event-tag">{{ event.category }}</div>
          </div>
          <div class="event-detail">
            <h3 class="event-title" v-html="highlight(event.title)"></h3>
            <div class="event-meta">
              <p><el-icon><Calendar /></el-icon> {{ event.date }}</p>
              <p><el-icon><Location /></el-icon> {{ event.venue }}</p>
            </div>
            <div class="event-footer">
              <div class="price">
                <span class="currency">￥</span>
                <span class="amount">{{ event.price }}</span>
                <span class="unit">起</span>
              </div>
              <el-button type="primary" plain class="buy-btn">立即购票</el-button>
            </div>
          </div>
        </div>
      </section>

      <!-- 无结果展示 -->
      <el-empty v-if="filteredEvents.length === 0" description="没有找到相关演出，换个关键词试试吧" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import NavBar from '@/components/NavBar.vue'
import { Search, Calendar, Location } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { searchShows, queryShows } from '@/api/show'
import defaultImage from '@/assets/logo.png'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 搜索状态
const searchQuery = ref(route.query.q || '')
const currentCity = ref('全部')
const currentCategory = ref('全部')
const currentTime = ref('全部')
const sortBy = ref('recommend')
const loading = ref(false)

const cities = ['全部', '上海', '北京', '广州', '深圳', '杭州', '成都']
const categories = ['全部', '演唱会', '话剧歌剧', '体育', '音乐会', '儿童亲子']
const times = ['全部', '今天', '明天', '本周末', '一个月内']

const events = ref([])

const timeToRange = (t) => {
  const now = new Date()
  const start = new Date(now)
  const end = new Date(now)
  if (t === '今天') {
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
  } else if (t === '明天') {
    start.setDate(start.getDate() + 1)
    end.setDate(end.getDate() + 1)
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
  } else if (t === '本周末') {
    const day = now.getDay()
    const toSat = (6 - day + 7) % 7
    const toSun = (7 - day + 7) % 7
    start.setDate(start.getDate() + toSat)
    end.setDate(end.getDate() + toSun)
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
  } else if (t === '一个月内') {
    start.setHours(0, 0, 0, 0)
    end.setMonth(end.getMonth() + 1)
    end.setHours(23, 59, 59, 999)
  } else {
    return {}
  }
  return { startTime: start.toISOString(), endTime: end.toISOString() }
}

const fetchResults = async () => {
  loading.value = true
  try {
    let res
    if (searchQuery.value && searchQuery.value.trim()) {
      res = await searchShows(searchQuery.value.trim())
    } else {
      const params = {
        pageNum: 1,
        pageSize: 20
      }
      if (currentCity.value !== '全部') params.city = currentCity.value
      if (currentCategory.value !== '全部') params.category = currentCategory.value
      const range = timeToRange(currentTime.value)
      Object.assign(params, range)
      res = await queryShows(params)
    }
    let list = []
    if (Array.isArray(res)) {
      list = res
    } else if (res && res.data && Array.isArray(res.data)) {
      list = res.data
    } else if (res && res.records && Array.isArray(res.records)) {
      list = res.records
    } else if (res && res.data && res.data.records && Array.isArray(res.data.records)) {
      list = res.data.records
    }
    events.value = list.map(item => ({
      id: item.id,
      title: item.title,
      venue: item.venue || item.venueName || '未知场馆',
      date: item.showTime || item.date || '待定',
      price: item.minPrice || item.price || 0,
      category: item.category || '其它',
      city: item.city || '全国',
      image: item.coverImage || item.image || defaultImage,
      hot: item.hot || 0
    }))
  } catch (error) {
    console.error('Search/query error:', error)
    ElMessage.error('获取演出列表失败')
  } finally {
    loading.value = false
  }
}

const filteredEvents = computed(() => {
  let result = events.value.filter(e => {
    // 搜索关键词筛选
    const matchSearch = !searchQuery.value || e.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || e.venue.toLowerCase().includes(searchQuery.value.toLowerCase())
    // 城市筛选
    const matchCity = currentCity.value === '全部' || e.city === currentCity.value
    // 分类筛选
    const matchCat = currentCategory.value === '全部' || e.category === currentCategory.value
    
    return matchSearch && matchCity && matchCat
  })

  // 排序逻辑
  if (sortBy.value === 'recent') {
    result.sort((a, b) => new Date(a.date) - new Date(b.date))
  } else if (sortBy.value === 'price') {
    result.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'recommend') {
    result.sort((a, b) => b.hot - a.hot)
  }

  return result
})


const highlight = (text) => {
  if (!searchQuery.value) return text
  const reg = new RegExp(`(${searchQuery.value})`, 'gi')
  return text.replace(reg, '<span class="highlight">$1</span>')
}

watch(() => route.query.q, (newVal) => {
  searchQuery.value = newVal || ''
  fetchResults()
})

watch([currentCity, currentCategory, currentTime], () => {
  fetchResults()
})

onMounted(() => {
  window.scrollTo(0, 0)
  fetchResults()
})
</script>

<style scoped>
.search-container {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* 筛选器 */
.filter-section {
  background: #fff;
  padding: 25px 30px;
  border-radius: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.filter-group {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.filter-group:last-child { margin-bottom: 0; }

.filter-label {
  width: 60px;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 500;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-options span {
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 6px 16px;
  border-radius: 20px;
  transition: all 0.3s;
}

.filter-options span:hover {
  background: #f5f5f7;
  color: var(--text-color);
}

.filter-options span.active {
  background: var(--primary-color);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(255, 18, 104, 0.2);
}

/* 结果头部 */
.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid var(--glass-border);
  margin-bottom: 30px;
}

.stat { color: var(--text-secondary); font-size: 14px; }
.stat span { color: var(--text-color); font-weight: bold; }

.sort-options {
  display: flex;
  gap: 30px;
}

.sort-options span {
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.3s;
}

.sort-options span:hover {
  color: var(--text-color);
}

.sort-options span.active {
  color: var(--text-color);
  font-weight: bold;
}

/* 结果列表 */
.result-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.event-horizontal-card {
  display: flex;
  gap: 30px;
  background: #fff;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.event-horizontal-card:hover {
  transform: translateX(12px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.06);
}

.event-poster {
  width: 160px;
  aspect-ratio: 3/4;
  position: relative;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.event-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s;
}

.event-horizontal-card:hover .event-poster img {
  transform: scale(1.05);
}

.event-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--primary-color);
  color: #fff;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  z-index: 1;
  box-shadow: 0 4px 10px rgba(255, 18, 104, 0.3);
}

.event-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.event-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  line-height: 1.4;
  color: var(--text-color);
}

:deep(.highlight) {
  color: var(--primary-color);
}

.event-meta {
  color: var(--text-secondary);
  font-size: 15px;
  margin: 20px 0;
}

.event-meta p {
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.event-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px dashed rgba(0, 0, 0, 0.05);
}

.price { color: var(--primary-color); }
.currency { font-size: 16px; font-weight: 600; }
.amount { font-size: 28px; font-weight: 800; }
.unit { font-size: 14px; color: var(--text-muted); margin-left: 4px; }

.buy-btn {
  border-radius: 25px;
  padding: 10px 30px;
  font-weight: 600;
}
</style>
