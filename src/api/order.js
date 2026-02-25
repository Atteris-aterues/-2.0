import request from '@/utils/request'

// 创建订单（抢票）
export function createOrder(params) {
  return request({
    url: '/order/create',
    method: 'post',
    params // 注意：根据文档，参数是在 query 中传递的，虽然是 POST 请求
  })
}

// 查询订单详情
export function getOrderDetails(orderId) {
  return request({
    url: '/order/details',
    method: 'get',
    params: { orderId }
  })
}

// 分页查询订单列表
export function getOrderList(params) {
  return request({
    url: '/order/list',
    method: 'get',
    params
  })
}

// 支付订单
export function payOrder(orderId) {
  return request({
    url: '/order/pay',
    method: 'put',
    params: { orderId }
  })
}

// 取消订单
export function cancelOrder(orderId) {
  return request({
    url: '/order/cancel',
    method: 'put',
    params: { orderId }
  })
}
