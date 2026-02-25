<template>
  <div class="address-container">
    <NavBar />
    
    <main class="main-content">
      <div class="page-header">
        <h1 class="page-title">收货地址管理</h1>
        <el-button type="primary" @click="showAddDialog">
          <el-icon><Plus /></el-icon> 新增地址
        </el-button>
      </div>

      <div class="address-list" v-loading="loading">
        <div v-for="addr in addressList" :key="addr.id" class="address-card">
          <div class="card-body">
            <div class="user-info">
              <span class="name">{{ addr.name }}</span>
              <span class="phone">{{ addr.phone }}</span>
              <span v-if="addr.isDefault" class="default-tag">默认</span>
            </div>
            <div class="address-detail">
              {{ addr.province }}{{ addr.city }}{{ addr.district }} {{ addr.detailAddress }}
            </div>
          </div>
          <div class="card-actions">
            <el-button link type="primary" @click="handleEdit(addr)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(addr.id)">删除</el-button>
          </div>
        </div>
        
        <el-empty v-if="!loading && addressList.length === 0" description="暂无收货地址" />
      </div>
    </main>

    <!-- 编辑/新增对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑地址' : '新增地址'"
      width="500px"
    >
      <el-form :model="form" label-width="80px" :rules="rules" ref="formRef">
        <el-form-item label="收货人" prop="name">
          <el-input v-model="form.name" placeholder="请输入收货人姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="省市区" prop="region">
          <el-cascader
            v-model="form.region"
            :options="cityOptions"
            placeholder="请选择省市区"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input v-model="form.detailAddress" type="textarea" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="默认地址">
          <el-switch v-model="form.isDefault" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { getAddressList, addAddress, updateAddress, deleteAddress } from '@/api/user'
import NavBar from '@/components/NavBar.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const loading = ref(false)
const addressList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref(null)

const form = reactive({
  id: '',
  name: '',
  phone: '',
  region: [],
  detailAddress: '',
  isDefault: false
})

const rules = {
  name: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  region: [{ required: true, message: '请选择省市区', trigger: 'change' }],
  detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
}

// 简化的城市数据，实际项目中应使用完整数据
const cityOptions = [
  {
    value: '北京市',
    label: '北京市',
    children: [
      { value: '北京市', label: '北京市', children: [
        { value: '朝阳区', label: '朝阳区' },
        { value: '海淀区', label: '海淀区' },
        { value: '东城区', label: '东城区' }
      ]}
    ]
  },
  {
    value: '上海市',
    label: '上海市',
    children: [
      { value: '上海市', label: '上海市', children: [
        { value: '浦东新区', label: '浦东新区' },
        { value: '徐汇区', label: '徐汇区' },
        { value: '黄浦区', label: '黄浦区' }
      ]}
    ]
  }
]

onMounted(() => {
  fetchList()
})

async function fetchList() {
  loading.value = true
  try {
    const res = await getAddressList()
    if (res && res.data) {
      addressList.value = res.data
    } else if (Array.isArray(res)) {
      addressList.value = res
    } else {
      addressList.value = []
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('获取地址列表失败')
  } finally {
    loading.value = false
  }
}

function showAddDialog() {
  isEdit.value = false
  form.id = ''
  form.name = ''
  form.phone = ''
  form.region = []
  form.detailAddress = ''
  form.isDefault = false
  dialogVisible.value = true
}

function handleEdit(addr) {
  isEdit.value = true
  form.id = addr.id
  form.name = addr.name
  form.phone = addr.phone
  form.region = [addr.province, addr.city, addr.district]
  form.detailAddress = addr.detailAddress
  form.isDefault = addr.isDefault
  dialogVisible.value = true
}

function handleDelete(id) {
  ElMessageBox.confirm('确认删除该地址吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteAddress(id)
      ElMessage.success('删除成功')
      fetchList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const data = {
          name: form.name,
          phone: form.phone,
          province: form.region[0],
          city: form.region[1],
          district: form.region[2],
          detailAddress: form.detailAddress,
          isDefault: form.isDefault
        }
        
        if (isEdit.value) {
          await updateAddress(form.id, data)
          ElMessage.success('修改成功')
        } else {
          await addAddress(data)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        fetchList()
      } catch (error) {
        console.error(error)
        ElMessage.error(isEdit.value ? '修改失败' : '添加失败')
      } finally {
        submitting.value = false
      }
    }
  })
}
</script>

<style scoped>
.address-container {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.main-content {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.address-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.user-info {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
}

.phone {
  color: var(--text-secondary);
}

.default-tag {
  background: rgba(255, 18, 104, 0.1);
  color: var(--primary-color);
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
}

.address-detail {
  color: var(--text-secondary);
  font-size: 14px;
}

.card-actions {
  display: flex;
  gap: 12px;
}
</style>
