<template>
  <div class="category-container">
    <!-- 顶部导航栏 -->
    <NavBar />

    <main class="main-content">
      <!-- 侧边分类栏 -->
      <aside class="sidebar">
        <div 
          v-for="cat in categories" 
          :key="cat.id" 
          class="sidebar-item"
          :class="{ active: currentCategory === cat.id }"
          @click="currentCategory = cat.id"
        >
          <el-icon><component :is="cat.icon" /></el-icon>
          <span>{{ cat.name }}</span>
        </div>
      </aside>

      <!-- 右侧内容区 -->
      <div class="content-area">
        <!-- 二级筛选 -->
        <section class="sub-filter">
          <div class="filter-row">
            <span class="label">城市：</span>
            <div class="options">
              <span v-for="city in cities" :key="city" :class="{ active: currentCity === city }" @click="currentCity = city">{{ city }}</span>
            </div>
          </div>
          <div class="filter-row">
            <span class="label">排序：</span>
            <div class="options">
              <span v-for="s in sortOptions" :key="s.value" :class="{ active: sortBy === s.value }" @click="sortBy = s.value">{{ s.label }}</span>
            </div>
          </div>
        </section>

        <!-- 演出列表 -->
        <div class="event-grid">
          <el-card 
            v-for="event in filteredEvents" 
            :key="event.id" 
            class="event-card"
            @click="router.push(`/detail/${event.id}`)"
          >
            <div class="poster-box">
              <img :src="event.image" :alt="event.title">
            </div>
            <div class="info">
              <h4 class="title">{{ event.title }}</h4>
              <p class="venue">{{ event.venue }}</p>
              <p class="date">{{ event.date }}</p>
              <div class="price">￥{{ event.price }} 起</div>
            </div>
          </el-card>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import NavBar from '@/components/NavBar.vue'
import { Search, Microphone, MagicStick, Trophy, Headset, Sugar, Film, Service, Ticket } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { queryShows } from '@/api/show'
import defaultImage from '@/assets/logo.png'

const router = useRouter()
const userStore = useUserStore()
const currentCategory = ref(1)
const currentCity = ref('全部')
const sortBy = ref('recommend')
const loading = ref(false)

const categories = [
  { id: 1, name: '演唱会', icon: Microphone },
  { id: 2, name: '话剧歌剧', icon: MagicStick },
  { id: 3, name: '体育', icon: Trophy },
  { id: 4, name: '音乐会', icon: Headset },
  { id: 5, name: '儿童亲子', icon: Sugar },
  { id: 6, name: '展览休闲', icon: Film },
  { id: 7, name: '音乐节', icon: Service },
  { id: 8, name: '其它', icon: Ticket }
]

const cities = ['全部', '上海', '北京', '广州', '深圳', '杭州', '成都']
const sortOptions = [
  { label: '综合排序', value: 'recommend' },
  { label: '最新开场', value: 'recent' },
  { label: '价格低到高', value: 'price' }
]

const events = ref([])

const fetchList = async () => {
  loading.value = true
  try {
    const cat = categories.find(c => c.id === currentCategory.value)?.name
    const params = { pageNum: 1, pageSize: 20 }
    if (cat) params.category = cat
    if (currentCity.value !== '全部') params.city = currentCity.value
    const res = await queryShows(params)
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
      categoryId: currentCategory.value,
      city: item.city || '全国',
      image: item.coverImage || item.image || defaultImage,
      hot: item.hot || 0
    }))
  } catch (error) {
    console.error('Query category error:', error)
    ElMessage.error('获取分类演出失败')
  } finally {
    loading.value = false
  }
}

const filteredEvents = computed(() => {
  let result = events.value.filter(e => {
    const matchCat = e.categoryId === currentCategory.value
    const matchCity = currentCity.value === '全部' || e.city === currentCity.value
    return matchCat && matchCity
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

watch([currentCategory, currentCity], () => {
  fetchList()
})

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.category-container {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.main-content {
  max-width: 1200px;
  margin: 40px auto;
  display: flex;
  gap: 30px;
  padding: 0 20px;
}

.sidebar {
  width: 220px;
  background: #fff;
  border-radius: 20px;
  padding: 24px 12px;
  height: fit-content;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.3s;
  margin-bottom: 4px;
}

.sidebar-item:hover {
  background: #f5f5f7;
  color: var(--text-color);
}

.sidebar-item.active {
  background: var(--primary-color);
  color: #fff;
  box-shadow: 0 8px 20px rgba(255, 18, 104, 0.25);
}

.content-area {
  flex: 1;
}

.sub-filter {
  background: #fff;
  border-radius: 20px;
  padding: 24px 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.filter-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.label {
  width: 70px;
  color: var(--text-muted);
  font-weight: 500;
  padding-top: 6px;
  font-size: 14px;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.options span {
  padding: 6px 18px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
  transition: all 0.3s;
  background: transparent;
}

.options span:hover {
  background: #f5f5f7;
  color: var(--text-color);
}

.options span.active {
  background: var(--primary-color);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(255, 18, 104, 0.2);
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 30px;
}

.event-card {
  background: #fff !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
  border-radius: 20px !important;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.event-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08) !important;
}

.poster-box {
  aspect-ratio: 3/4;
  overflow: hidden;
}

.poster-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s;
}

.event-card:hover .poster-box img {
  transform: scale(1.05);
}

.info {
  padding: 16px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 44px;
}

.venue, .date {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0 0 6px;
}

.price {
  margin-top: 12px;
  color: var(--primary-color);
  font-weight: 700;
  font-size: 18px;
}
</style>
