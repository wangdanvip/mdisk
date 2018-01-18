// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import store from './store/'
import routes from './router'
import 'common/css/base.styl'
import 'common/css/icon/iconfont.css'
import $ from 'common/js/jquery-vendor.js'
import lang from 'src/lang.json'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import locale_e from 'element-ui/lib/locale/lang/en'
import locale_z from 'element-ui/lib/locale/lang/zh-CN'
import axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'
import config from 'src/config'

Vue.use(VueRouter)
Vue.use(VueQuillEditor)

let language = store.getters['language_version']
Vue.prototype.language = language
Vue.prototype.i18n =  language == 'zh' ? lang.zh_CN : lang.en
Vue.prototype.$http = axios
if (language == 'zh') {
  Vue.use(ElementUI, { locale:locale_z })
} else {
  Vue.use(ElementUI, { locale:locale_e })
}

axios.defaults.timeout = 15000
axios.interceptors.request.use(function (config) {  //配置发送请求的信息
  if (!config.url.includes('v1/monitor/report')) {
    store.dispatch('toggleMask', true)
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

const router = new VueRouter({
  // mode: 'history',
  routes
})

axios.interceptors.response.use(function (res) { //配置请求回来的信息
  let map = {
    301: app.i18n.account_error,
    302: app.i18n.lockedUser,
    401: app.i18n.login_overtime,
    501: app.i18n.auth_fail,
    504: app.i18n.capacity_too_small,
    601: app.i18n.system_error,
    607: app.i18n.system_busy,
    701: app.i18n.login_conflict,
    901: app.i18n.delLord_error,
    902: app.i18n.existedLord,
    903: app.i18n.addLord,
    904: app.i18n.existedGroup,
    910: app.i18n.unlock_dept,
    911: app.i18n.transfer_gm_error
  }

  if(res.status === 408){
    app.msg("warning", app.i18n.overtime)
  }
  //模调
  if (!res.config.url.includes('v1/monitor/report')) {
    store.dispatch('toggleMask', false)
    if(res.data.errorCode != "200"){
      if(res.data.errorCode == "401" || res.data.errorCode == "701") {
        config.router_URL ? router.push({name:'登录'}) : (window.location.href = "http://"+window.location.host+"/")
      }
      app.msg("warning", map[res.data.errorCode])
    }
    let params = [{
      "request_module_id": '12',     //上报者自身模块ID
      "response_module_id": '3',    //被调方模块ID
      "interface_id": res.config.id || '0',			 //被调方接口ID
      "request_ip": '127.0.0.1',    //调用者自身IP,暂时可以填127.0.0.1
      "response_ip": "http://" + window.location.host,   //被调方IP
      "errcode": '0',            //接口调用返回的错误码,0
      "delay": (new Date().getTime() - res.config.time) || 0          //调用延迟
    }]
    //axios.post('http://10.17.32.111:19092/v1/monitor/report', JSON.stringify(params))
  }
  return res;
}, function (error) {
  store.dispatch('toggleMask', false)
  return Promise.reject(error);
});

router.beforeEach((to,from,next) => {
  let host_str="http://"+window.location.host+"/";

  if (to.name === '登录') {
    window.localStorage.removeItem('pbAdmin');
    window.localStorage.removeItem('loginInfo');
    $('.v-modal').hide();
  }
  let loginInfo = JSON.parse(window.localStorage.getItem('loginInfo'));
  let pbAdmin = JSON.parse(window.localStorage.getItem('pbAdmin'));
  if(to.path=='/'){
    if(!loginInfo){
      config.router_URL ? next({name:'登录'}) : (window.location.href = host_str)
    }else{
      if(pbAdmin.pb_admin==='0'){
        next({name:'dataCenter'})
      }else if(loginInfo.isDeptAdmin==='1'){
        next({name:'部门列表'})
      }else if(pbAdmin.pb_admin==='1' || pbAdmin.pb_admin==='2'){
        next({name:'群组管理'})
      }else{
        config.router_URL ? next({name:'404页面'}) : (window.location.href = "http://"+window.location.host+"/")
      }
    }
  }

  if(!loginInfo && (to.name != '登录' && to.name != '404页面' && to.path != '/')){
    window.localStorage.removeItem('pbAdmin');
    window.localStorage.removeItem('loginInfo');
    config.router_URL ? next({name:'登录'}) : (window.location.href = host_str)
  }else {
    next()
  }
})

Vue.filter('replace_deptName', function(value) {
  if (!value) {
    return '';
  }
  value = value.replace(/_/g, "/");
  return value;
})

Vue.filter('calValidDate', function(value) {
  if (!value) {
    return '';
  }
  let validdate = value.split(' ');
  let validdate1 = validdate[0].split('-');
  let validdate2 = validdate[1].split(':');
  let end_time = new Date(validdate1[0],validdate1[1]-1,validdate1[2],validdate2[0],validdate2[1],validdate2[2]);
  let now = new Date();
  let res=end_time-now;
  let res_str='';
  if(res>0){
    //秒
    // let second=parseInt(res/1000)%60;
    //分
    let minute=parseInt(res/1000/60)%60;
    //小时
    let hour=parseInt(res/1000/60/60)%24;
    //天
    let day=parseInt(res/1000/60/60/24);
    if(day!==0){
      res_str+=day+app.i18n.lday;
    }
    if(hour!==0){
      res_str+=hour+app.i18n.hour;
    }
    if(minute!==0){
      res_str+=minute+app.i18n.minute;
    }
  }else{
    res_str= app.i18n.g.due
  }
  // let res_str=day+'天'+hour+'小时'+minute+'分';
  return res_str;
})

Vue.filter('escape', function(str) {
  return str.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g, "&quot;").replace(/'/g, "&#039;");
})

Vue.directive('focus', function (el, bindings) {
  if (bindings.value) {
    $(el).find("input").focus()
  }
})

let app = new Vue({
  store,
  router,
  el: '#app_box',
  components: { App }
})

Vue.prototype.msg = function (type, msg) {
  let map = {
    'warning': app.i18n.g.warning,
    'success': app.i18n.g.success
  }
  app.$notify({
    title: map[type],
    message: msg,
    offset: 100,
    type: type
  })
}

Vue.prototype.confirm = function (type, msg, func) {
  let map = {
    'warning': app.i18n.g.warning,
  }
  this.$confirm(msg, map[type], {
    confirmButtonText: app.i18n.g.sure_q,
    cancelButtonText: app.i18n.g.cancel_q,
    type: type
  }).then(() => {
    func && func()
  }).catch(() => {
  })
}

Vue.prototype.format = function(str) {
  for (let i=1; i<arguments.length; i++) {
    str = str.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i])
  }
  return str;
}

Vue.prototype.dateFormat = function (date, format) {
  var o = {
    "M+": date.getMonth() + 1, //month
    "d+": date.getDate(), //day
    "h+": date.getHours(), //hour
    "m+": date.getMinutes(), //minute
    "s+": date.getSeconds(), //second
    "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
    "S": date.getMilliseconds() //millisecond
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length))
    }
  }
  return format
}

