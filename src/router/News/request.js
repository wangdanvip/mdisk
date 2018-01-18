import axios from 'axios';
import config from 'src/config'

let base = config.router_URL || ''

//11.1.16 新建/编辑新闻
const addNews = params => {
  return axios.post(`${base}/v1/mideastore/service/news/edit`, params).then(res => res.data)
}
//11.1.17 获取新闻详情
const newsDetail = params => {
  return axios.post(`${base}/v1/mideastore/service/news/get/detail`, params).then(res => res.data)
}
//11.1.18 删除新闻
const delNews = params => {
  return axios.post(`${base}/v1/mideastore/service/news/delete`, params).then(res => res.data)
}
//11.1.19 获取新闻列表
const getNews = params => {
  return axios.post(`${base}/v1/mideastore/service/news/get/list`, params).then(res => res.data)
}

//11.1.26 修改新闻状态
const publishNews = params => {
  return axios.post(`${base}/v1/mideastore/service/news/status/edit`, params).then(res => res.data)
}

export {
  addNews,
  newsDetail,
  delNews,
  getNews,
  publishNews,
}
