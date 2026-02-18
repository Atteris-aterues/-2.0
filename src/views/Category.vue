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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import NavBar from '@/components/NavBar.vue'
import { Search, Microphone, MagicStick, Trophy, Headset, Sugar, Film, Service, Ticket } from '@element-plus/icons-vue'

// 导入本地图片资源
import eventA from '@/assets/a.png'
import eventB from '@/assets/b.png'
import eventC from '@/assets/c.png'
import eventD from '@/assets/d.png'
import eventE from '@/assets/e.png'
import eventF from '@/assets/f.png'

const router = useRouter()
const userStore = useUserStore()
const currentCategory = ref(1)
const currentCity = ref('全部')
const sortBy = ref('recommend')

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

const events = ref([
  { id: 1, title: '【上海】周杰伦“嘉年华”世界巡回演唱会', venue: '上海体育场', date: '2026.05.20', price: 580, categoryId: 1, city: '上海', image: eventA, hot: 100 },
  { id: 2, title: '【北京】音乐剧《罗密欧与朱丽叶》', venue: '天桥艺术中心', date: '2026.06.12', price: 180, categoryId: 2, city: '北京', image: eventB, hot: 80 },
  { id: 3, title: '【广州】2026 广州超级音乐节', venue: '广州海心沙亚运公园', date: '2026.04.15', price: 399, categoryId: 4, city: '广州', image: eventC, hot: 90 },
  { id: 4, title: '【深圳】CBA联赛 深圳马可波罗 vs 广东东莞大益', venue: '深圳大运中心体育馆', date: '2026.03.10', price: 100, categoryId: 3, city: '深圳', image: eventD, hot: 70 },
  { id: 5, title: '【上海】陈奕迅 Fear and Dreams 演唱会', venue: '梅赛德斯-奔驰文化中心', date: '2026.07.10', price: 680, categoryId: 1, city: '上海', image: eventE, hot: 95 },
  { id: 6, title: '【成都】李荣浩“纵横四海”巡回演唱会', venue: '凤凰山体育公园专业足球场', date: '2026.08.20', price: 380, categoryId: 1, city: '成都', image: eventF, hot: 85 }
])

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
