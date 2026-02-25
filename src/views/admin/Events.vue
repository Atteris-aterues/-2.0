<template>
  <div class="admin-events-view">
    <!-- 统计栏 -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="label">在售演出</span>
        <span class="value">24</span>
      </div>
      <div class="stat-card">
        <span class="label">本月新增</span>
        <span class="value">+8</span>
      </div>
      <div class="stat-card">
        <span class="label">待审核</span>
        <span class="value">3</span>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索演出名称、场馆"
          :prefix-icon="Search"
          class="custom-input"
          clearable
        />
      </div>
      <el-button type="primary" :icon="Plus" @click="handleAdd">添加演出</el-button>
    </div>

    <!-- 表格区域 -->
    <div class="table-card">
      <el-table :data="pagedEvents" style="width: 100%" class="custom-table">
        <el-table-column label="演出信息" min-width="300">
          <template #default="{ row }">
            <div class="event-cell">
              <el-image :src="row.image" class="event-thumb" fit="cover" />
              <div class="event-info">
                <div class="title">{{ row.title }}</div>
                <div class="category">{{ row.category }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="city" label="城市" width="120" />
        <el-table-column label="演出时间" width="200">
          <template #default="{ row }">
            <span class="date-text">{{ row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格区间" width="150">
          <template #default="{ row }">
            <span class="price-text">￥{{ row.minPrice }} - {{ row.maxPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'onsale' ? 'success' : 'info'" effect="dark">
              {{ row.status === 'onsale' ? '在售中' : '已下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button link :type="row.status === 'onsale' ? 'warning' : 'success'">
                {{ row.status === 'onsale' ? '下架' : '上架' }}
              </el-button>
              <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredEvents.length"
          layout="total, prev, pager, next"
          class="custom-pagination"
        />
      </div>
    </div>

    <!-- 添加/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑演出' : '添加演出'"
      width="600px"
      custom-class="glass-dialog"
    >
      <el-form :model="form" label-width="100px" class="custom-form">
        <el-form-item label="演出名称">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="城市">
          <el-select v-model="form.city" style="width: 100%">
            <el-option label="上海" value="上海" />
            <el-option label="北京" value="北京" />
            <el-option label="广州" value="广州" />
            <el-option label="深圳" value="深圳" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category" style="width: 100%">
            <el-option label="演唱会" value="演唱会" />
            <el-option label="音乐会" value="音乐会" />
            <el-option label="话剧歌剧" value="话剧歌剧" />
            <el-option label="体育" value="体育" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格区间">
          <div class="price-range-inputs">
            <el-input-number v-model="form.minPrice" :min="0" placeholder="最低" />
            <span class="separator">-</span>
            <el-input-number v-model="form.maxPrice" :min="0" placeholder="最高" />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { adminGetShows, adminCreateShow, adminUpdateShow, adminDeleteShow } from '@/api/show'
import defaultImage from '@/assets/logo.png'

// 动画效果
onMounted(() => {
  if (window.gsap) {
    window.gsap.from('.stat-card', {
      duration: 0.8,
      y: 30,
      opacity: 0,
      stagger: 0.1,
      ease: 'power2.out'
    })
    
    window.gsap.from('.toolbar', {
      duration: 1,
      opacity: 0,
      delay: 0.4,
      ease: 'power2.out'
    })
    
    window.gsap.from('.table-card', {
      duration: 1,
      y: 20,
      opacity: 0,
      delay: 0.6,
      ease: 'power2.out'
    })
  }
})

const router = useRouter()
const userStore = useUserStore()
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const isEdit = ref(false)
const loading = ref(false)

const events = ref([])

const fetchShows = async () => {
  loading.value = true
  try {
    const res = await adminGetShows({ pageNum: 1, pageSize: 100 })
    let records = []
    if (Array.isArray(res)) {
      records = res
    } else if (res && res.records) {
      records = res.records
    } else if (res && res.data && res.data.records) {
      records = res.data.records
    }
    events.value = records.map(r => ({
      id: r.id,
      title: r.name || r.title || '未命名演出',
      category: r.category || '其它',
      city: r.region || r.city || '全国',
      date: r.startTime && r.endTime ? `${r.startTime} - ${r.endTime}` : (r.startTime || '待定'),
      minPrice: r.price || 0,
      maxPrice: r.price || 0,
      image: r.coverImage || r.image || defaultImage,
      status: r.isOnSale === 1 ? 'onsale' : 'offsale'
    }))
  } catch (e) {
    ElMessage.error('获取演出列表失败')
  } finally {
    loading.value = false
  }
}

const filteredEvents = computed(() => {
  return events.value.filter(e => 
    e.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    e.city.includes(searchQuery.value)
  )
})

const pagedEvents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredEvents.value.slice(start, end)
})

const form = ref({
  id: undefined,
  name: '',
  venue: '',
  region: '',
  category: '',
  price: 0,
  startTime: '',
  endTime: '',
  isOnSale: 1
})

const handleAdd = () => {
  isEdit.value = false
  form.value = { id: undefined, name: '', venue: '', region: '', category: '', price: 0, startTime: '', endTime: '', isOnSale: 1 }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  form.value = { 
    id: row.id,
    name: row.title,
    venue: row.venue || '',
    region: row.city,
    category: row.category,
    price: row.minPrice,
    startTime: row.date?.split(' - ')[0] || row.date || '',
    endTime: row.date?.includes(' - ') ? row.date.split(' - ')[1] : '',
    isOnSale: row.status === 'onsale' ? 1 : 0
  }
  dialogVisible.value = true
}

const saveForm = async () => {
  const loading = ElLoading.service({ text: '正在保存...', lock: true })
  try {
    if (isEdit.value && form.value.id) {
      const res = await adminUpdateShow(form.value.id, { ...form.value })
      if (res && res.success) ElMessage.success('修改成功')
      else ElMessage.error(res?.message || '修改失败')
    } else {
      const res = await adminCreateShow({ ...form.value })
      if (res && res.success) ElMessage.success('添加成功')
      else ElMessage.error(res?.message || '添加失败')
    }
    dialogVisible.value = false
    await fetchShows()
  } catch (e) {
    ElMessage.error('保存异常')
  } finally {
    loading.close()
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该演出吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error',
    customClass: 'glass-message-box'
  }).then(async () => {
    try {
      const res = await adminDeleteShow(row.id)
      if (res && res.success) {
        ElMessage.success('删除成功')
        await fetchShows()
      } else {
        ElMessage.error(res?.message || '删除失败')
      }
    } catch (e) {
      ElMessage.error('删除异常')
    }
  })
}

onMounted(() => {
  const isAdmin = userStore.userInfo?.isAdmin === true || userStore.userInfo?.role === 2
  if (!isAdmin) {
    ElMessage.warning('请使用管理员账号登录')
    router.push('/login')
    return
  }
  fetchShows()
})
</script>

<style scoped>
.admin-events-view {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 统计卡片 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 24px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.stat-card .label { color: var(--text-secondary); font-size: 14px; font-weight: 500; }
.stat-card .value { font-size: 28px; font-weight: 700; color: var(--text-color); }

/* 工具栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-box {
  width: 300px;
}

/* 表格区域 */
.table-card {
  background: #fff;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.event-cell {
  display: flex;
  align-items: center;
  gap: 15px;
}

.event-thumb {
  width: 45px;
  height: 60px;
  border-radius: 4px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.event-info .title {
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-color);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-info .category {
  font-size: 12px;
  color: var(--text-secondary);
}

.price-text {
  color: var(--primary-color);
  font-weight: 600;
}

.date-text {
  color: var(--text-secondary);
  font-size: 13px;
}

.action-btns {
  display: flex;
  gap: 12px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 样式覆盖 */
:deep(.custom-table) {
  background-color: transparent !important;
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: #f8f8f9;
  --el-table-border-color: #ebeef5;
  --el-table-text-color: var(--text-secondary);
  --el-table-header-text-color: var(--text-color);
}

:deep(.el-table__row:hover > td) {
  background-color: #f5f7fa !important;
}

:deep(.custom-input .el-input__wrapper) {
  background-color: #fff !important;
  box-shadow: none !important;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

:deep(.custom-input .el-input__inner) {
  color: var(--text-color) !important;
}

.price-range-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.price-range-inputs .separator {
  color: #555;
}
</style>
