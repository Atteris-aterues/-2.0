<template>
  <div class="admin-users">
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card glass-card">
        <div class="stat-icon users"><el-icon><User /></el-icon></div>
        <div class="stat-info">
          <span class="label">总用户数</span>
          <span class="value">0</span>
          <span class="trend up">+0% <el-icon><CaretTop /></el-icon></span>
        </div>
      </div>
      <div class="stat-card glass-card">
        <div class="stat-icon active"><el-icon><Sunny /></el-icon></div>
        <div class="stat-info">
          <span class="label">今日活跃</span>
          <span class="value">0</span>
          <span class="trend up">+0% <el-icon><CaretTop /></el-icon></span>
        </div>
      </div>
      <div class="stat-card glass-card">
        <div class="stat-icon new"><el-icon><Plus /></el-icon></div>
        <div class="stat-info">
          <span class="label">本周新增</span>
          <span class="value">0</span>
          <span class="trend down">-0% <el-icon><CaretBottom /></el-icon></span>
        </div>
      </div>
      <div class="stat-card glass-card">
        <div class="stat-icon admin"><el-icon><Key /></el-icon></div>
        <div class="stat-info">
          <span class="label">管理员</span>
          <span class="value">1</span>
          <span class="trend">稳定</span>
        </div>
      </div>
    </div>

    <!-- 操作栏 -->
    <div class="action-bar glass-card">
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户名、邮箱或手机号..."
          prefix-icon="Search"
          clearable
          class="custom-input"
        />
        <el-select v-model="roleFilter" placeholder="角色筛选" clearable class="custom-select">
          <el-option label="普通用户" value="user" />
          <el-option label="管理员" value="admin" />
          <el-option label="大V用户" value="vip" />
        </el-select>
        <el-select v-model="statusFilter" placeholder="状态筛选" clearable class="custom-select">
          <el-option label="正常" value="active" />
          <el-option label="已禁用" value="disabled" />
        </el-select>
      </div>
      <el-button type="primary" icon="Plus" @click="handleAdd">新增用户</el-button>
    </div>

    <!-- 数据表格 -->
    <div class="table-container glass-card">
      <el-table :data="paginatedUsers" style="width: 100%" class="custom-table">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="用户信息" min-width="250">
          <template #default="{ row }">
            <div class="user-info-cell">
              <el-avatar :size="40" :src="row.avatar" />
              <div class="details">
                <span class="username">{{ row.username }}</span>
                <span class="email">{{ row.email }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="getRoleTagType(row.role)" effect="dark" size="small">
              {{ row.role === 'admin' ? '管理员' : row.role === 'vip' ? '大V' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" effect="plain" size="small">
              {{ row.status === 'active' ? '正常' : '已禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="regDate" label="注册日期" width="150" sortable />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button 
              size="small" 
              :type="row.status === 'active' ? 'danger' : 'success'" 
              link 
              @click="toggleStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
            <el-divider direction="vertical" />
            <el-dropdown trigger="click" @command="(cmd) => handleCommand(cmd, row)">
              <el-button size="small" type="info" link>更多</el-button>
              <template #dropdown>
                <el-dropdown-menu class="glass-dropdown">
                  <el-dropdown-item command="resetPwd">重置密码</el-dropdown-item>
                  <el-dropdown-item command="changeRole">修改角色</el-dropdown-item>
                  <el-dropdown-item command="delete" divided class="delete-item">彻底删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          :total="filteredUsers.length"
          class="custom-pagination"
        />
      </div>
    </div>

    <!-- 编辑/新增对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑用户信息' : '新增用户'"
      width="500px"
      custom-class="glass-dialog"
    >
      <el-form :model="form" label-width="80px" class="custom-form">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role" style="width: 100%">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
            <el-option label="大V用户" value="vip" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { User, Sunny, Plus, Key, CaretTop, CaretBottom, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

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
    
    window.gsap.from('.action-bar', {
      duration: 1,
      opacity: 0,
      delay: 0.4,
      ease: 'power2.out'
    })
    
    window.gsap.from('.table-container', {
      duration: 1,
      y: 20,
      opacity: 0,
      delay: 0.6,
      ease: 'power2.out'
    })
  }
})

// 模拟数据
const users = ref([
  { id: 1001, username: 'Admin_Master', email: 'admin@damai.com', phone: '13800000000', role: 'admin', status: 'active', regDate: '2025-01-01', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' },
  { id: 1002, username: 'User_XiaoMing', email: 'xiaoming@qq.com', phone: '13811112222', role: 'user', status: 'active', regDate: '2025-01-10', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=XiaoMing' },
  { id: 1003, username: 'Music_Lover', email: 'music@163.com', phone: '13833334444', role: 'vip', status: 'active', regDate: '2025-01-12', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Music' },
  { id: 1004, username: 'Test_User', email: 'test@gmail.com', phone: '13855556666', role: 'user', status: 'disabled', regDate: '2025-01-15', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test' },
  { id: 1005, username: 'Concert_Goer', email: 'concert@outlook.com', phone: '13877778888', role: 'user', status: 'active', regDate: '2025-01-16', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Concert' },
  { id: 1006, username: 'Ticket_Hunter', email: 'hunter@foxmail.com', phone: '13899990000', role: 'user', status: 'active', regDate: '2025-01-17', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hunter' },
  { id: 1007, username: 'Art_Fanatic', email: 'art@sina.com', phone: '13700001111', role: 'vip', status: 'active', regDate: '2025-01-18', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Art' },
])

// 状态变量
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({
  username: '',
  email: '',
  phone: '',
  role: 'user'
})

// 过滤后的数据
const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchSearch = !searchQuery.value || 
      u.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      u.phone.includes(searchQuery.value)
    const matchRole = !roleFilter.value || u.role === roleFilter.value
    const matchStatus = !statusFilter.value || u.status === statusFilter.value
    return matchSearch && matchRole && matchStatus
  })
})

// 分页后的数据
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

// 工具函数
const getRoleTagType = (role) => {
  switch (role) {
    case 'admin': return 'danger'
    case 'vip': return 'warning'
    default: return 'info'
  }
}

// 操作方法
const handleAdd = () => {
  isEdit.value = false
  form.value = { username: '', email: '', phone: '', role: 'user' }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

const saveForm = () => {
  if (isEdit.value) {
    const index = users.value.findIndex(u => u.id === form.value.id)
    if (index > -1) users.value[index] = { ...form.value }
    ElMessage.success('用户信息已更新')
  } else {
    const newUser = {
      ...form.value,
      id: Date.now(),
      status: 'active',
      regDate: new Date().toISOString().split('T')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.value.username}`
    }
    users.value.unshift(newUser)
    ElMessage.success('用户创建成功')
  }
  dialogVisible.value = false
}

const toggleStatus = (row) => {
  const action = row.status === 'active' ? '禁用' : '启用'
  ElMessageBox.confirm(`确定要${action}该用户吗？`, '操作确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: row.status === 'active' ? 'warning' : 'info',
    customClass: 'glass-message-box'
  }).then(() => {
    row.status = row.status === 'active' ? 'disabled' : 'active'
    ElMessage.success(`用户已${action}`)
  })
}

const handleCommand = (cmd, row) => {
  if (cmd === 'resetPwd') {
    ElMessage.info('密码重置邮件已发送至 ' + row.email)
  } else if (cmd === 'delete') {
    ElMessageBox.confirm('彻底删除用户将无法恢复，且会影响订单记录，确定继续？', '极度危险', {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'error',
      customClass: 'glass-message-box'
    }).then(() => {
      users.value = users.value.filter(u => u.id !== row.id)
      ElMessage.success('用户已彻底删除')
    })
  }
}
</script>

<style scoped>
.admin-users {
  padding: 24px;
}

/* 玻璃拟态卡片 */
.glass-card {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

/* 统计区域 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-icon.users { background: rgba(64, 158, 255, 0.1); color: #409eff; }
.stat-icon.active { background: rgba(103, 194, 58, 0.1); color: #67c23a; }
.stat-icon.new { background: rgba(230, 162, 60, 0.1); color: #e6a23c; }
.stat-icon.admin { background: rgba(144, 147, 153, 0.1); color: #909399; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-info .label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
  font-weight: 500;
}

.stat-info .value {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1;
}

.stat-info .trend {
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.trend.up { color: #67c23a; }
.trend.down { color: #f56c6c; }

/* 操作栏 */
.action-bar {
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
}

.search-box {
  display: flex;
  gap: 12px;
}

.custom-input { width: 300px; }
.custom-select { width: 140px; }

/* 表格样式 */
.table-container {
  padding: 20px;
  background: #fff;
}

.user-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info-cell .details {
  display: flex;
  flex-direction: column;
}

.user-info-cell .username {
  color: var(--text-color);
  font-weight: 600;
  font-size: 14px;
}

.user-info-cell .email {
  color: var(--text-secondary);
  font-size: 12px;
}

/* 分页 */
.pagination-wrapper {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

/* Element Plus 覆盖 */
:deep(.custom-table) {
  background-color: transparent !important;
  color: var(--text-color);
  --el-table-header-bg-color: #f8f8f9;
  --el-table-header-text-color: var(--text-color);
  --el-table-border-color: #ebeef5;
}

:deep(.custom-table th.el-table__cell) {
  font-weight: 600;
}

:deep(.custom-table td.el-table__cell) {
  color: var(--text-secondary);
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell) {
  background-color: #f5f7fa !important;
}

:deep(.custom-input .el-input__wrapper),
:deep(.custom-select .el-select__wrapper) {
  background-color: #fff !important;
  box-shadow: none !important;
  border: 1px solid #dcdfe6;
}

:deep(.custom-input .el-input__inner),
:deep(.custom-select .el-select__placeholder) {
  color: var(--text-color) !important;
}

.delete-item {
  color: #f56c6c !important;
}

/* 响应式 */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
