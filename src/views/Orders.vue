<template>
  <div class="orders-container">
    <!-- 顶部导航栏 -->
    <NavBar />

    <main class="main-content">
      <h1 class="page-title">我的订单</h1>
      
      <!-- 订单分类页签 -->
      <el-tabs v-model="activeTab" class="order-tabs">
        <el-tab-pane label="全部订单" name="all"></el-tab-pane>
        <el-tab-pane label="待付款" name="unpaid"></el-tab-pane>
        <el-tab-pane label="待观演" name="upcoming"></el-tab-pane>
        <el-tab-pane label="退款/售后" name="refund"></el-tab-pane>
      </el-tabs>

      <!-- 订单列表 -->
      <div class="order-list">
        <div v-for="order in filteredOrders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="header-left">
              <span class="order-time">{{ order.orderTime }}</span>
              <span class="order-id">订单号：{{ order.id }}</span>
            </div>
            <div class="order-status" :class="order.status">
              {{ getStatusText(order.status) }}
            </div>
          </div>
          
          <div class="order-body">
            <img :src="order.image" :alt="order.title" class="event-poster">
            <div class="event-info">
              <h3 class="event-title">{{ order.title }}</h3>
              <p class="event-detail">
                <el-icon><Calendar /></el-icon> {{ order.date }}
              </p>
              <p class="event-detail">
                <el-icon><Location /></el-icon> {{ order.venue }}
              </p>
              <p class="ticket-info">票档：￥{{ order.price }} x {{ order.count }}张</p>
            </div>
            <div class="order-price">
              <div class="total-label">实付款</div>
              <div class="amount">￥{{ order.price * order.count }}</div>
            </div>
            <div class="order-actions">
              <el-button v-if="order.status === 'unpaid'" type="primary" size="small">立即支付</el-button>
              <el-button v-if="order.status === 'unpaid'" size="small" @click="handleCancel(order.id)">取消订单</el-button>
              <el-button v-if="order.status === 'upcoming'" size="small">查看票夹</el-button>
              <el-button size="small" @click="router.push(`/detail/${order.eventId}`)">项目详情</el-button>
            </div>
          </div>
        </div>

        <el-empty v-if="filteredOrders.length === 0" description="暂无相关订单" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import NavBar from '@/components/NavBar.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Calendar, Location, ArrowRight } from '@element-plus/icons-vue'

// 导入本地图片资源
import eventA from '@/assets/a.png'
import eventB from '@/assets/b.png'
import eventC from '@/assets/c.png'
import eventD from '@/assets/d.png'

const router = useRouter()
const userStore = useUserStore()
const activeTab = ref('all')

const orders = ref([
  {
    id: '202601180001',
    eventId: 1,
    title: '【上海】周杰伦“嘉年华”世界巡回演唱会',
    image: eventA,
    date: '2026.05.20 19:30',
    venue: '上海体育场',
    price: 1280,
    count: 2,
    orderTime: '2026-01-18 10:30',
    status: 'unpaid'
  },
  {
    id: '202601170042',
    eventId: 2,
    title: '【北京】音乐剧《罗密欧与朱丽叶》',
    image: eventB,
    date: '2026.06.12 19:30',
    venue: '天桥艺术中心-大剧场',
    price: 680,
    count: 1,
    orderTime: '2026-01-17 15:20',
    status: 'upcoming'
  },
  {
    id: '202601150089',
    eventId: 3,
    title: '【广州】2026 广州超级音乐节',
    image: eventC,
    date: '2026.04.15 14:00',
    venue: '广州海心沙亚运公园',
    price: 399,
    count: 1,
    orderTime: '2026-01-15 09:15',
    status: 'finished'
  }
])

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  return orders.value.filter(o => o.status === activeTab.value)
})

const getStatusText = (status) => {
  const map = {
    unpaid: '待付款',
    upcoming: '待观演',
    canceled: '已取消',
    finished: '已完成'
  }
  return map[status] || status
}

const handleCancel = (orderId) => {
  ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '点错了',
    type: 'warning',
    customClass: 'glass-message-box'
  }).then(() => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = 'canceled'
      ElMessage.success('订单已取消')
    }
  })
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.orders-container {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.main-content {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
}

.order-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--glass-border);
  transition: all 0.3s;
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

:deep(.el-tabs__item) {
  color: var(--text-secondary) !important;
  font-size: 16px;
  height: 50px;
}

:deep(.el-tabs__item.is-active) {
  color: var(--text-color) !important;
  font-weight: 600;
}

:deep(.el-tabs__active-bar) {
  background-color: var(--primary-color);
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: rgba(0, 0, 0, 0.05);
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.order-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.order-header {
  padding: 16px 24px;
  background: #fcfcfd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  gap: 24px;
  color: var(--text-secondary);
}

.order-status {
  font-weight: 600;
}

.order-status.unpaid { color: var(--primary-color); }
.order-status.upcoming { color: #52c41a; }
.order-status.finished { color: var(--text-muted); }
.order-status.canceled { color: var(--text-muted); }

.order-body {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.event-poster {
  width: 90px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.event-info {
  flex: 1;
}

.event-title {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
}

.event-detail {
  margin: 6px 0;
  color: var(--text-secondary);
  font-size: 14px;
  display: flex; 
  align-items: center;
  gap: 6px;
}

.ticket-info {
  margin-top: 12px;
  color: var(--text-secondary);
  font-size: 14px;
}

.order-price {
  text-align: right;
  padding: 0 40px;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  border-left: 1px solid rgba(0, 0, 0, 0.05);
}

.total-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.amount {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-color);
}

.order-actions {
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 120px;
}

.order-actions .el-button {
  margin-left: 0;
  width: 100%;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #ff1268 0%, #ff5593 100%);
  border: none;
}

:deep(.el-button--default) {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: var(--text-color);
}

:deep(.el-button--default:hover) {
  background: #f5f5f7;
  color: var(--primary-color);
  border-color: var(--primary-color);
}
</style>
