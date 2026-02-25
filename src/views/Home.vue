<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <NavBar showCitySelector v-model:city="currentCity" />

    <!-- 主体内容 -->
    <main class="main-content">
      <!-- 轮播图区域 -->
      <section class="banner-section">
        <el-carousel :interval="4000" type="card" height="450px">
          <el-carousel-item v-for="item in banners" :key="item.id">
            <div class="banner-item" :style="{ backgroundImage: `url(${item.image})` }">
              <div class="banner-mask">
                <h3>{{ item.title }}</h3>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </section>

      <!-- 公告栏 -->
      <section class="notice-bar">
        <el-icon class="notice-icon"><ChatDotRound /></el-icon>
        <el-carousel
          height="40px"
          direction="vertical"
          :autoplay="true"
          :interval="3000"
          indicator-position="none"
          arrow="never"
        >
          <el-carousel-item v-for="(msg, index) in announcements" :key="index">
            <span class="notice-text">{{ msg }}</span>
          </el-carousel-item>
        </el-carousel>
        <div class="notice-more">查看更多 <el-icon><ArrowRight /></el-icon></div>
      </section>

      <!-- 分类入口 -->
      <section class="category-grid">
        <div 
          v-for="cat in categories" 
          :key="cat.name" 
          class="category-item"
          @click="router.push('/category')"
        >
          <div class="icon-wrapper" :style="{ background: cat.color }">
            <el-icon :size="24"><component :is="cat.icon" /></el-icon>
          </div>
          <span>{{ cat.name }}</span>
        </div>
      </section>

      <!-- 安全保障 -->
      <section class="guarantee-grid">
        <div v-for="item in guarantees" :key="item.title" class="guarantee-item">
          <el-icon class="g-icon"><component :is="item.icon" /></el-icon>
          <div class="g-info">
            <span class="g-title">{{ item.title }}</span>
            <span class="g-desc">{{ item.desc }}</span>
          </div>
        </div>
      </section>

      <!-- 热门榜单 -->
      <section class="rank-section">
        <div class="section-header">
          <h2 class="section-title">热销榜单</h2>
          <div class="more-btn" @click="router.push('/category')">
            查看完整榜单 <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
        <div class="rank-grid">
          <div 
            v-for="(item, index) in rankings" 
            :key="item.id" 
            class="rank-card"
            @click="router.push(`/detail/${item.id}`)"
          >
            <div class="rank-num" :class="'rank-' + (index + 1)">{{ index + 1 }}</div>
            <img :src="item.image" class="rank-img">
            <div class="rank-info">
              <h4 class="rank-name">{{ item.title }}</h4>
              <p class="rank-hot">
                <el-icon><Goods /></el-icon> 热度值 {{ 1000 - index * 100 }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div class="content-layout">
        <!-- 右侧侧边栏 -->
        <aside class="side-column">
          <!-- 用户卡片 -->
          <div class="side-card user-card">
            <div class="user-info-box" v-if="userStore.token">
              <el-avatar :size="50" :icon="UserFilled" />
              <div class="user-detail">
                <span class="welcome">Hi, {{ userStore.userInfo?.username || '大麦用户' }}</span>
                <span class="level">普通会员</span>
              </div>
            </div>
            <div class="user-login-box" v-else>
              <el-avatar :size="50" :icon="UserFilled" />
              <p>Hi, 欢迎来到大麦</p>
              <el-button type="primary" round @click="router.push('/login')">登录 / 注册</el-button>
            </div>
            <div class="user-quick-links">
              <div class="link-item">
                <el-icon><Ticket /></el-icon>
                <span>我的票夹</span>
              </div>
              <div class="link-item">
                <el-icon><Wallet /></el-icon>
                <span>优惠券</span>
              </div>
            </div>
          </div>

          <!-- 下载APP -->
          <div class="side-card download-card">
            <div class="card-header">
              <span class="card-title">下载大麦APP</span>
            </div>
            <div class="download-content">
              <div class="qr-code">
                <img src="https://img.alicdn.com/tfs/TB1969Ym7T2gK0jSZPcXXc7pXXa-324-324.png" alt="QR Code">
              </div>
              <div class="download-info">
                <p><el-icon><Iphone /></el-icon> 随时随地</p>
                <p><el-icon><Monitor /></el-icon> 抢票快人一步</p>
              </div>
            </div>
          </div>

          <!-- 热门场馆 -->
          <div class="side-card venue-card">
            <div class="card-header">
              <span class="card-title">精选场馆</span>
              <span class="card-more">全部 <el-icon><ArrowRight /></el-icon></span>
            </div>
            <div class="venue-list">
              <div v-for="venue in hotVenues" :key="venue.name" class="venue-item">
                <div class="venue-icon">
                  <el-icon><OfficeBuilding /></el-icon>
                </div>
                <div class="venue-info">
                  <div class="v-name">{{ venue.name }}</div>
                  <div class="v-tags">
                    <span v-for="tag in venue.tags" :key="tag" class="v-tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 艺人推荐 -->
          <div class="side-card singer-card">
            <div class="card-header">
              <span class="card-title">艺人推荐</span>
              <span class="card-more">换一批</span>
            </div>
            <div class="singer-list">
              <div v-for="singer in recommendedSingers" :key="singer.name" class="singer-item">
                <el-avatar :size="40" :src="singer.avatar" />
                <div class="singer-info">
                  <div class="s-name">{{ singer.name }}</div>
                  <div class="s-desc">{{ singer.desc }}</div>
                </div>
                <el-button size="small" plain round class="follow-btn">关注</el-button>
              </div>
            </div>
          </div>

          <!-- 侧边服务 -->
          <div class="side-card service-card">
            <div class="service-item">
              <el-icon><Service /></el-icon>
              <span>在线客服</span>
            </div>
          </div>
        </aside>

        <!-- 左侧推荐列表 -->
        <div class="main-column">
          <section class="event-section">
            <div class="section-header">
              <h2 class="section-title">为你推荐</h2>
            </div>
            
            <div v-if="filteredEvents.length > 0" class="event-grid">
              <el-card 
                v-for="event in filteredEvents" 
                :key="event.id" 
                class="event-card" 
                :body-style="{ padding: '0px' }"
                @click="router.push(`/detail/${event.id}`)"
              >
                <div class="event-image-box">
                  <img :src="event.image" class="event-img" loading="lazy">
                  <div class="event-tag">{{ event.category }}</div>
                </div>
                <div class="event-info">
                  <h3 class="event-title">{{ event.title }}</h3>
                  <p class="event-venue">{{ event.venue }}</p>
                  <p class="event-date">{{ event.date }}</p>
                  <div class="event-price">
                    <span class="currency">￥</span>
                    <span class="amount">{{ event.price }}</span>
                    <span class="unit">起</span>
                  </div>
                </div>
              </el-card>
            </div>
            <div v-else class="empty-state">
              <el-empty description="该城市暂无相关演出，看看其他城市吧" />
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { getShowHome, queryShows } from '@/api/show'
import { ElMessage } from 'element-plus'
import NavBar from '@/components/NavBar.vue'
import { Search, Location, ArrowRight, Microphone, Service, MagicStick, Trophy, Sugar, Film, Headset, Ticket, ChatDotRound, CircleCheck, Umbrella, Goods, UserFilled, Wallet, Cellphone, OfficeBuilding, Iphone, Monitor } from '@element-plus/icons-vue'

// 导入本地轮播图图片
import banner1 from '@/assets/1.png'
import banner2 from '@/assets/2.jpg'
import banner3 from '@/assets/4.png'
// 图片占位符，如果API返回没有图片则使用默认图
import defaultImage from '@/assets/logo.png'

// 导入本地推荐列表图片 (单字母名字)
import eventA from '@/assets/a.png'
import eventB from '@/assets/b.png'
import eventC from '@/assets/c.png'
import eventD from '@/assets/d.png'
import eventE from '@/assets/e.png'
import eventF from '@/assets/f.png'

const router = useRouter()
const userStore = useUserStore()
const currentCity = ref('全国')

// 公告数据
const announcements = ref([
  '【公告】大麦网票务服务升级通知',
  '【提醒】谨防虚假票务诈骗，保护个人信息安全',
  '【活动】周杰伦演唱会周边商品限时开启预售'
])

// 安全保障数据
const guarantees = [
  { title: '正品保证', icon: CircleCheck, desc: '100%正品票源' },
  { title: '售后无忧', icon: Umbrella, desc: '退改有保障' },
  { title: '快速入场', icon: MagicStick, desc: '扫码即刻验票' },
  { title: '安全交易', icon: Ticket, desc: '资金支付安全' }
]

const banners = ref([
  { id: 1, title: '周杰伦演唱会', image: banner1 },
  { id: 2, title: '陈奕迅演唱会', image: banner2 },
  { id: 3, title: '迷笛音乐节', image: banner3 }
])

const categories = [
  { name: '演唱会', icon: Microphone, color: '#ff1268' },
  { name: '话剧歌剧', icon: MagicStick, color: '#ff5a00' },
  { name: '体育', icon: Trophy, color: '#00b4ff' },
  { name: '音乐会', icon: Headset, color: '#4b56ff' },
  { name: '儿童亲子', icon: Sugar, color: '#ffcf00' },
  { name: '展览休闲', icon: Film, color: '#16d2ac' },
  { name: '音乐节', icon: Service, color: '#ff1268' },
  { name: '其它', icon: Ticket, color: '#999' }
]

const events = ref([])

onMounted(async () => {
  try {
    const res = await getShowHome()
    // 假设 res 是一个数组，或者 { data: [] }
    console.log('API Response:', res)
    
    // 统一解析首页数据
    let homeEvents = []
    if (Array.isArray(res)) {
      homeEvents = res
    } else if (res && res.data && Array.isArray(res.data)) {
      homeEvents = res.data
    } else if (res && res.records && Array.isArray(res.records)) {
      homeEvents = res.records
    }

    if (homeEvents.length > 0) {
      events.value = homeEvents.map(item => ({
        id: item.id,
        title: item.title,
        venue: item.venue || '未知场馆',
        date: item.showTime || '待定',
        price: item.minPrice || item.price || 0,
        category: item.category || '其它',
        city: item.city || '全国',
        image: item.coverImage || item.image || defaultImage
      }))
    }
    
    // 如果首页接口返回为空，尝试调用分页接口获取数据
     if (events.value.length === 0) {
       console.log('Home API returned empty, trying query API...')
       // 尝试多种参数格式以匹配后端分页接口
       const queryRes = await queryShows({ 
         pageNum: 1, pageSize: 10,
         page: 1, size: 10,
         current: 1
       })
       console.log('Query API Response:', queryRes)
       
       // 尝试解析不同结构的响应
       let records = []
       if (queryRes && queryRes.records && Array.isArray(queryRes.records)) {
         records = queryRes.records
       } else if (queryRes && queryRes.data && queryRes.data.records && Array.isArray(queryRes.data.records)) {
         records = queryRes.data.records
       } else if (queryRes && Array.isArray(queryRes)) {
         records = queryRes
       }

       if (records.length > 0) {
         events.value = records.map(item => ({
           id: item.id,
           title: item.title,
           venue: item.venue || '未知场馆',
           date: item.showTime || '待定',
           price: item.minPrice || item.price || 0,
           category: item.category || '其它',
           city: item.city || '全国',
           image: item.coverImage || item.image || defaultImage
         }))
       }
     }
     
     // 如果还是没有数据，不再使用Mock数据，而是显示空状态
     if (events.value.length === 0) {
       console.warn('API returned empty list')
     }
  } catch (error) {
    console.error('Failed to fetch events:', error)
    ElMessage.error('获取首页演出数据失败')
  }
})

function loadMockData() {
  // 移除 Mock 数据
  console.log('Mock data removed')
}

// 热门榜单 (取前5个)
const rankings = computed(() => {
  return [...events.value].slice(0, 5)
})

// 热门场馆数据
const hotVenues = [
  { name: '上海体育场', location: '上海市徐汇区', tags: ['演唱会', '体育'] },
  { name: '梅赛德斯-奔驰文化中心', location: '上海市浦东新区', tags: ['音乐会', '演艺'] },
  { name: '国家体育场(鸟巢)', location: '北京市朝阳区', tags: ['大型赛事', '巨星'] }
]

// 推荐艺人数据
const recommendedSingers = [
  { name: '周杰伦', desc: '华语流行乐男歌手、词曲作者', avatar: 'https://img.alicdn.com/bao/uploaded/i4/2251059038/O1CN01fP2C2m2GdS8m6m7P2_!!0-item_pic.jpg' },
  { name: '陈奕迅', desc: '华语流行乐男歌手、演员', avatar: 'https://img.alicdn.com/bao/uploaded/i1/2251059038/O1CN01Z7Wp8x2GdS8kGfJ1u_!!0-item_pic.jpg' },
  { name: '邓紫棋', desc: '华语流行乐女歌手、词曲作者', avatar: 'https://img.alicdn.com/bao/uploaded/i2/2251059038/O1CN01y6iP5l2GdS8p0G7K8_!!0-item_pic.jpg' },
  { name: '五月天', desc: '华语摇滚乐团', avatar: 'https://img.alicdn.com/bao/uploaded/i3/2251059038/O1CN01Xp7W8x2GdS8m6m7P2_!!0-item_pic.jpg' }
]

// 过滤后的活动列表
const filteredEvents = computed(() => {
  let result = [...events.value]

  // 城市筛选
  if (currentCity.value !== '全国') {
    result = result.filter(e => e.city === currentCity.value)
  }

  return result
})
</script>

<style scoped>
.home-container {
  width: 100%;
  background-color: var(--bg-color);
}

.main-content {
  width: 100%;
  padding: 20px 40px;
}

.main-content::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* 轮播图 */
.banner-section {
  margin-bottom: 30px;
  width: 100%;
  overflow: hidden;
}

:deep(.el-carousel) {
  width: 100%;
}

.banner-item {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  position: relative;
}

.banner-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  border-radius: 0 0 12px 12px;
}

.banner-mask h3 {
  font-size: 24px;
  margin: 0;
  color: #fff;
}

/* 公告栏 */
.notice-bar {
  background: var(--card-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  padding: 0 20px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 15px;
  height: 50px;
}

.notice-icon {
  color: var(--primary-color);
  font-size: 20px;
}

.notice-bar :deep(.el-carousel) {
  flex: 1;
  min-width: 0; /* 允许走马灯缩小以防止溢出 */
}

.notice-text {
  line-height: 40px;
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block; /* 确保省略号生效 */
}

.notice-text:hover {
  color: var(--primary-color);
}

.notice-more {
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0; /* 防止“查看更多”被挤压 */
}

/* 分类网格 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.3s;
}

.category-item:hover {
  transform: translateY(-5px);
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.category-item span {
  font-size: 14px;
  color: var(--text-secondary);
}

/* 安全保障 */
.guarantee-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
  padding: 20px 40px;
  background: var(--card-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
}

.guarantee-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.g-icon {
  font-size: 32px;
  color: var(--primary-color);
  opacity: 0.8;
}

.g-info {
  display: flex;
  flex-direction: column;
}

.g-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
}

.g-desc {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

/* 热门榜单 */
.rank-section {
  margin-bottom: 30px;
}

.rank-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.rank-card {
  position: relative;
  background: var(--card-bg);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid var(--glass-border);
}

.rank-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.rank-num {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 24px;
  height: 24px;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  z-index: 1;
}

.rank-1 { background: #ff1268; }
.rank-2 { background: #ff5a00; }
.rank-3 { background: #ffcf00; }
.rank-4, .rank-5 { background: rgba(0,0,0,0.3); }

.rank-img {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
}

.rank-info {
  padding: 12px;
}

.rank-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--text-color);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rank-hot {
  font-size: 12px;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 4px;
}

.more-btn {
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.3s;
}

.more-btn:hover {
  color: var(--primary-color);
}

/* 布局结构 */
.content-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.main-column {
  flex: 1;
  min-width: 0;
}

.side-column {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 92px; /* 导航栏高度 72px + 20px 间距 */
  align-self: flex-start;
}

/* 侧边栏通用卡片 */
.side-card {
  background: var(--card-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  padding: 16px;
  box-shadow: var(--shadow-sm);
}

/* 用户卡片 */
.user-card {
  text-align: center;
}

.user-info-box {
  display: flex;
  align-items: center;
  gap: 15px;
  text-align: left;
  margin-bottom: 20px;
}

.user-detail {
  display: flex;
  flex-direction: column;
}

.welcome {
  font-weight: 600;
  color: var(--text-color);
}

.level {
  font-size: 12px;
  color: var(--primary-color);
  background: rgba(255, 18, 104, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  margin-top: 4px;
}

.user-login-box p {
  margin: 12px 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.user-quick-links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed var(--glass-border);
}

.link-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: color 0.3s;
}

.link-item:hover {
  color: var(--primary-color);
}

.link-item .el-icon {
  font-size: 20px;
}

.link-item span {
  font-size: 12px;
}

/* 下载APP卡片 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-title {
  font-weight: 700;
  font-size: 16px;
  color: var(--text-color);
}

.download-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.qr-code img {
  width: 80px;
  height: 80px;
  border: 1px solid var(--glass-border);
  padding: 4px;
  border-radius: 4px;
}

.download-info p {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 热门场馆 */
.card-more {
  font-size: 12px;
  color: var(--text-muted);
  cursor: pointer;
}

.venue-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.venue-item {
  display: flex;
  gap: 12px;
  align-items: center;
  cursor: pointer;
}

.venue-icon {
  width: 40px;
  height: 40px;
  background: var(--bg-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-size: 20px;
}

.v-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
}

.v-tags {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.v-tag {
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-color);
  padding: 1px 6px;
  border-radius: 4px;
}

/* 艺人推荐 */
.singer-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.singer-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.singer-info {
  flex: 1;
  min-width: 0;
}

.s-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 2px;
}

.s-desc {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.follow-btn {
  padding: 4px 12px;
  height: 24px;
  font-size: 12px;
  border-color: var(--primary-color) !important;
  color: var(--primary-color) !important;
}

.follow-btn:hover {
  background: var(--primary-color) !important;
  color: #fff !important;
}

/* 侧边服务 */
.service-card {
  padding: 15px 20px;
}

.service-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.3s;
}

.service-item:hover {
  color: var(--primary-color);
}

/* 推荐区域 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0;
}

.empty-state {
  padding: 60px 0;
}

:deep(.el-empty__description p) {
  color: var(--text-muted) !important;
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 30px;
}

@media (max-width: 1000px) {
  .side-column {
    display: none;
  }
}

.event-card {
  background: var(--card-bg) !important;
  border: 1px solid var(--glass-border) !important;
  border-radius: var(--radius-md) !important;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: var(--shadow-sm) !important;
}

.event-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-lg) !important;
}

.event-image-box {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
}

.event-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s;
}

.event-card:hover .event-img {
  transform: scale(1.1);
}

.event-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--primary-color);
  color: #fff;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(255, 18, 104, 0.3);
}

.event-info {
  padding: 16px;
}

.event-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 10px;
  color: var(--text-color);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 44px;
}

.event-venue, .event-date {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-price {
  margin-top: 12px;
  color: var(--primary-color);
}

.currency { font-size: 12px; font-weight: 600; }
.amount { font-size: 20px; font-weight: 800; }
.unit { font-size: 12px; color: var(--text-muted); margin-left: 2px; }
</style>

