<template>
  <div id="app">
    <el-config-provider>
      <div class="page-wrapper">
        <router-view/>
        <Footer v-if="showFooter" />
      </div>
    </el-config-provider>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Footer from '@/components/Footer.vue'

const route = useRoute()
const showFooter = computed(() => {
  // 不在管理后台和登录页显示 footer
  return !route.path.startsWith('/admin') && route.path !== '/login'
})
</script>

<style>
:root {
  --bg-color: #ebebec;
  --text-color: #1d1d1f;
  --text-secondary: #424245; /* 加深次要文字颜色，从 #6e6e73 改为 #424245 */
  --text-muted: #86868b;
  --glass-bg: rgba(255, 255, 255, 0.85); /* 提高不透明度 */
  --glass-border: rgba(0, 0, 0, 0.12);
  --primary-color: #ff1268;
  --card-bg: #ffffff;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.12);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
  overflow-x: hidden;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

#app {
  width: 100%;
  min-height: 100vh;
}

.page-wrapper {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

* {
  box-sizing: border-box;
}

/* Global Theme Overrides for Element Plus */
.glass-message-box {
  background: var(--glass-bg) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid var(--glass-border) !important;
  border-radius: 12px !important;
}

.glass-message-box .el-message-box__title,
.glass-message-box .el-message-box__content {
  color: var(--text-color) !important;
}

.glass-message-box .el-message-box__btns .el-button--default {
  background: transparent !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  color: var(--text-secondary) !important;
}

.glass-message-box .el-message-box__btns .el-button--primary {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

/* Global Overlay & Dialog */
.el-overlay {
  backdrop-filter: blur(8px);
}

.glass-dialog {
  background: var(--glass-bg) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid var(--glass-border) !important;
  border-radius: 16px !important;
}

.glass-dialog .el-dialog__title {
  color: var(--text-color) !important;
  font-weight: bold;
}

.glass-dialog .el-form-item__label {
  color: var(--text-secondary) !important;
}

/* Global Form Styles */
.custom-form :deep(.el-input__wrapper),
.custom-form :deep(.el-select__wrapper),
.custom-form :deep(.el-textarea__inner) {
  background-color: #f5f5f7 !important;
  box-shadow: none !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.custom-form :deep(.el-input__inner),
.custom-form :deep(.el-textarea__inner) {
  color: var(--text-color) !important;
}

/* Global Dropdown */
.el-dropdown__popper.el-popper {
  background: var(--glass-bg) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid var(--glass-border) !important;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1) !important;
}

.el-dropdown-menu {
  background: transparent !important;
}

.el-dropdown-menu__item {
  color: var(--text-color) !important;
}

.el-dropdown-menu__item:hover {
  background: rgba(0, 0, 0, 0.05) !important;
  color: var(--primary-color) !important;
}

.el-popper__arrow::before {
  background: var(--glass-bg) !important;
  border: 1px solid var(--glass-border) !important;
}
</style>
