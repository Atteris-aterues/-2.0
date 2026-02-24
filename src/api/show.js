import request from '@/utils/request'

// 获取首页演出列表
export function getShowHome() {
  return request({
    url: '/show/home',
    method: 'get'
  })
}

// 搜索演出
export function searchShows(keyword) {
  return request({
    url: '/show/search',
    method: 'get',
    params: { keyword }
  })
}

// 条件查询演出（分页）
export function queryShows(params) {
  return request({
    url: '/show/query',
    method: 'get',
    params
  })
}

// 获取演出详情
export function getShowDetails(showId) {
  return request({
    url: '/show/details',
    method: 'get',
    params: { showId }
  })
}

// 管理端：添加演出
export function adminCreateShow(data) {
  return request({
    url: '/admin/shows',
    method: 'post',
    data
  })
}

// 管理端：分页查询演出列表
export function adminGetShows(params) {
  return request({
    url: '/admin/shows',
    method: 'get',
    params
  })
}

// 管理端：修改演出信息
export function adminUpdateShow(id, data) {
  return request({
    url: `/admin/shows/${id}`,
    method: 'put',
    data
  })
}

// 管理端：演出详情
export function adminGetShowDetails(id) {
  return request({
    url: `/admin/shows/${id}`,
    method: 'get'
  })
}

// 管理端：删除演出
export function adminDeleteShow(id) {
  return request({
    url: `/admin/shows/${id}`,
    method: 'delete'
  })
}
