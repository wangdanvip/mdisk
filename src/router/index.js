/**
 * Created by qiangxl on 2017/2/28.
 */
//import Vue from 'vue'
import NotFound from './NotFound/NotFound.vue'
import Login from './Login.vue'

import Home from './Home.vue'
import DepartmentList from './DepartmentList/DepartmentList.vue'
import DepartmentAdmin from './DepartmentAdmin/DepartmentAdmin.vue'
import UserList from './UserList/UserList.vue'
import CasualUser from './CasualUser/CasualUser.vue'
import GroupManage from './GroupManage/GroupManage.vue'
import GroupPermission from './GroupPermission/GroupPermission.vue'
// import DocumentReview from './DocumentReview/DocumentReview.vue'
import DataCenter from './DataCenter/model.vue'
import U_storage from './DataCenter/u_storage.vue'
import G_storage from './DataCenter/g_storage.vue'
import Access_time from './DataCenter/access_time.vue'
import Tracking from './DataCenter/tracking.vue'
import News from './News/model.vue'
import AddNews from './News/add.vue'

let routes = [
  {
    path: '/404',
    component: NotFound,
    name: '404页面'
  },
  {
    path: '/login',
    component: Login,
    name: '登录'
  },
  {
    path: '/',
    component: Home,
    name: 'Home',
    children: [
      {path: '/dataCenter', component: DataCenter, name: 'dataCenter'},
      {path: '/storage/user', component: U_storage, name: 'u_storage'},
      {path: '/storage/group', component: G_storage, name: 'g_storage'},
      {path: '/access_time', component: Access_time, name: 'access_time'},
      {path: '/tracking', component: Tracking, name: 'tracking'},
      {path: '/DepartmentList', component: DepartmentList, name: '部门列表'},
      {path: '/DepartmentAdmin', component: DepartmentAdmin, name: '部门管理员'},
      {path: '/UserList', component: UserList, name: '用户列表'},
      {path: '/CasualUser', component: CasualUser, name: '临时用户'},
      {path: '/GroupManage', component: GroupManage, name: '群组管理'},
      {path: '/GroupPermission', component: GroupPermission, name: '群组权限'},
      {path: '/news', component: News, name: 'news'},
      {path: '/news/add', component: AddNews, name: 'addNews'},
      {path: '/news/:id/edit', component: AddNews, name: 'editNews'},
      // {path: '/DocumentReview', component: DocumentReview, name: '文件审核'},
    ]
  },
  {
    path: '*',
    redirect: { path: '/404' }
  }
];

export default routes;

