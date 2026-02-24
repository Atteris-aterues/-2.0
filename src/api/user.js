import request from '@/utils/request'

export function loginOrRegister(data) {
  return request({
    url: '/user/register-or-login',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/user/current',
    method: 'get'
  })
}

export function updateUserInfo(data) {
  return request({
    url: '/user/update',
    method: 'put',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 获取收货地址列表
export function getAddressList() {
  return request({
    url: '/user/addresses',
    method: 'get'
  })
}

// 添加收货地址
export function addAddress(data) {
  return request({
    url: '/user/address',
    method: 'post',
    data
  })
}

// 修改收货地址
export function updateAddress(id, data) {
  return request({
    url: `/user/address/${id}`,
    method: 'put',
    data
  })
}

// 删除收货地址
export function deleteAddress(id) {
  return request({
    url: `/user/address/${id}`,
    method: 'delete'
  })
}

// 获取收货地址详情
export function getAddressDetails(id) {
  return request({
    url: `/user/address/${id}`,
    method: 'get'
  })
}

// 管理端：管理员登录
export function adminLogin(params) {
  return request({
    url: '/admin/login',
    method: 'post',
    params
  })
}

// 管理端：分页查询用户列表
export function adminGetUsers(params) {
  return request({
    url: '/admin/users',
    method: 'get',
    params
  })
}

// 管理端：用户详情
export function adminGetUserDetails(id) {
  return request({
    url: `/admin/users/${id}`,
    method: 'get'
  })
}

// 管理端：修改用户信息
export function adminUpdateUser(id, data) {
  return request({
    url: `/admin/users/${id}`,
    method: 'put',
    data
  })
}

// 管理端：启用/禁用用户
export function adminUpdateUserStatus(id, status) {
  return request({
    url: `/admin/users/${id}/status`,
    method: 'put',
    params: { status }
  })
}
