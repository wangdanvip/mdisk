import axios from 'axios';
import config from 'src/config'

let base = config.router_URL || ''

//10.1.10  访问数据展示
const getVisit = params => {
  return axios.post(`${base}/v1/mideastore/service/get/visit/data`,params, {id: '234', time: (new Date()).getTime()}).then(res => res.data);
}
//10.1.11  数据趋势图
const getTrend = params => {
  return axios.post(`${base}/v1/mideastore/service/get/data/trend`, params, {id: '235', time: (new Date()).getTime()}).then(res => res.data);
}
//10.1.12 存储比例图
const getStore = params => {
  return axios.post(`${base}/v1/mideastore/service/get/store/ratio`,params, {id: '236', time: (new Date()).getTime()}).then(res => res.data);
}
//10.1.13 获取个人存储使用列表
const userStore = params => {
  return axios.post(`${base}/v1/mideastore/service/get/user/store/list`,params, {id: '237', time: (new Date()).getTime()}).then(res => res.data);
}
//10.1.14 获取群组存储使用列表
const groupStore = params => {
  return axios.post(`${base}/v1/mideastore/service/get/group/store/list`,params, {id: '238', time: (new Date()).getTime()}).then(res => res.data);
}
//11.1.23 按键埋点表
const getTracking = params => {
  return axios.post(`${base}/v1/mideastore/service/click/button/get/list`, params).then(res => res.data)
}
//11.1.27 获取页面平均停留时长列表
const access_time = params => {
  return axios.post(`${base}/v1/mideastore/service/get/page/staytime/list`, params).then(res => res.data)
}

export {
  getVisit,
  getTrend,
  getStore,
  userStore,
  groupStore,
  getTracking,
  access_time
}
