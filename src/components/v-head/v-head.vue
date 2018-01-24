<template>
  <el-row id="head_box">
    <el-col :span="24">
      <div class="wrapper clearFix" style="overflow: visible;">
        <div class="wrapper_l">
          <!--<span class="logo" style="padding-top: 7px"><img src="./img/logo.png" alt="logo"/></span>-->
          <!--<span class="text"><span style="color: #00adf5">{{__.meicloud}}</span>{{__.drive}}</span>-->
          <!--<span class="text">{{__.meicloud + __.drive}}</span>-->
          <img src="./img/logo_zh.png" v-show="language == 'zh'" alt="logo" style="height: 26px"/>
          <img src="./img/logo_en.png" v-show="language == 'en'" alt="logo" style="height: 26px"/>
        </div>
        <!--<div id="beta_tip">-->
          <!--<div><i class="iconfont icon-beta"></i></div>-->
          <!--<div>-->
            <!--<p>首页权限位为：{{pbAdmin.pb_admin}}</p>-->
            <!--<p>角色类型为：{{pbAdmin.type}}</p>-->
          <!--</div>-->
          <!--<div>-->
            <!--<p>仅在beta测试版显示，</p>-->
            <!--<p>正式环境将不再显示。</p>-->
          <!--</div>-->
        <!--</div>-->
        <el-menu theme="dark" :default-active="activeIndex" mode="horizontal">
          <el-submenu index="0" v-show="pbAdmin.pb_admin == '0'">
            <template slot="title">{{i18n.data_center}}</template>
            <el-menu-item index="0-1">
              <router-link :to="{'name':'dataCenter'}">
                <span>{{i18n.statistics_chart}}</span>
              </router-link>
            </el-menu-item>
            <el-menu-item index="0-2">
              <router-link :to="{'name':'tracking'}">
                <span>{{i18n.tracking}}</span>
              </router-link>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="1" v-show="pbAdmin.pb_admin==='0' || loginInfo.isDeptAdmin==='1'">
            <template slot="title">{{__.g.department_manage}}</template>
            <el-menu-item index="1-1">
              <router-link :to="{'name':'部门列表'}">
                <span>{{__.g.department_list}}</span>
              </router-link>
            </el-menu-item>
            <el-menu-item index="1-2" v-show="pbAdmin.pb_admin==='0'">
              <router-link :to="{'name':'部门管理员'}">
                <span>{{__.g.department_admin}}</span>
              </router-link>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2" v-show="pbAdmin.pb_admin==='0' || loginInfo.isDeptAdmin==='1'">
            <template slot="title">{{__.g.user_manage}}</template>
            <el-menu-item index="2-1">
              <router-link :to="{'name':'用户列表'}">
                <span>{{__.g.user_list}}</span>
              </router-link>
            </el-menu-item>
            <el-menu-item index="2-2">
              <router-link :to="{'name':'临时用户'}">
                <span>{{__.g.casual_list}}</span>
              </router-link>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3" v-show="pbAdmin.pb_admin==='0' || pbAdmin.pb_admin==='1' || pbAdmin.pb_admin==='2'">
            <template slot="title">{{__.g.group_manage}}</template>
            <el-menu-item index="3-1">
              <router-link :to="{'name':'群组管理'}">
                <span>{{__.g.group_list}}</span>
              </router-link>
            </el-menu-item>
            <el-menu-item index="3-2" v-show="pbAdmin.pb_admin==='0'">
              <router-link :to="{'name':'群组权限'}">
                <span>{{__.g.GroupPermission}}</span>
              </router-link>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="4" v-show="pbAdmin.pb_admin == '0'" style="margin-top:-2px;">
            <router-link :to="{name: 'news'}">
              <span>{{i18n.news}}</span>
            </router-link>
          </el-menu-item>
        </el-menu>
        <div class="wrapper_r clearFix">
          <div class="userName">
            <div class="el-dropdown" @mouseover="setShow" @mouseout="setHide">
              <button style="background: #373d41;border:none;color:#bfcbd9" type="button" class="el-button dropTitle el-button--primary">
                <span> {{loginInfo.userName}}<i data-v-ae896822="" class="el-icon-caret-bottom el-icon--right"></i></span>
              </button>
              <ul class="el-dropdown-menu admin_head_drop" style="z-index: 2001; position: absolute; left: 0px; right: 0px; top: 45px; padding-left: 0px; padding-right: 0px;min-width: 130px;" :style="dropStyle">
                <li class="el-dropdown-menu__item dropText" style="display: block; width: 100% !important;"><a href="/#/all">{{__.head.link_to_disk}}</a></li>
                <li class="el-dropdown-menu__item dropText" style="display: block; width: 100% !important;"><a href="/" @click="removeFun">{{__.head.sign_out}}</a></li>
              </ul>
            </div>
          </div>
          <!--<el-menu theme="dark" class="el-meu-demo" mode="horizontal">
            <el-submenu index="4">
              <template slot="title">{{loginInfo.userName}}</template>
              <el-menu-item index="4-1">
                <a href="/#/all">{{__.head.link_to_disk}}</a>
              </el-menu-item>
              <el-menu-item index="4-2">
                <a href="/" @click="removeFun">{{__.head.sign_out}}</a>
              </el-menu-item>
            </el-submenu>
          </el-menu>-->
          <div class="language">
            <span :class="zh_class" @click="setLang('SET_CH')">中文</span>
            <span>/</span>
            <span :class="en_class" @click="setLang('SET_EN')">En</span>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  import {mapGetters, mapActions} from 'vuex'
  import lang from 'src/lang.json'
  import { getLoginInfo } from 'common/api/api'

  export default {
    data(){
      return {
        'dropShow':false,
        loginInfo: null,
        pbAdmin: null
      }
    },
    computed:{
      ...mapGetters([
        'language_version'
      ]),
      '__'(){
        let __={};
        this.language_version === 'zh'?__ = lang.zh_CN:__ = lang.en;
        return __;
      },
      'zh_class'(){
        let cName={};
        this.language_version === 'zh'?cName = {'header-lang':true,'is-active':true}:cName = {'header-lang':true,'is-active':false};
        return cName;
      },
      'en_class'(){
        let cName={};
        this.language_version === 'en'?cName = {'header-lang':true,'is-active':true}:cName = {'header-lang':true,'is-active':false};
        return cName;
      },
      /*'loginInfo'(){
        let loginInfo = JSON.parse(window.localStorage.getItem('loginInfo'));
        return loginInfo;
      },
      'pbAdmin'(){
        let pbAdmin = JSON.parse(window.localStorage.getItem('pbAdmin'));
        return pbAdmin;
      },*/
      token () {
        return JSON.parse(window.localStorage.getItem('loginInfo')).token
      },
      'dropStyle'(){
        return this.dropShow?{'display':'block'}:{'display':'none'}
      },
      activeIndex() {
        switch (this.$route.name) {
          case 'dataCenter': case 'u_storage' : case 'g_storage' :
            return '0-1'
          case 'tracking' :
          return '0-2'
          case '部门列表':
            return '1-1'
          case '部门管理员':
            return '1-2'
          case '用户列表':
            return '2-1'
          case '临时用户':
            return '2-2'
          case '群组管理':
            return '3-1'
          case '群组权限':
            return '3-2'
          case 'news': case 'addNews' : case 'editNews' :
            return '4'
          default:
            return '0'
        }
      },
    },
    methods:{
      setShow(){
        this.dropShow=true;
      },
      setHide(){
        this.dropShow=false;
      },
      setLang(lang_version){
        if (this.language_version == 'zh' && lang_version == 'SET_CH' || this.language_version == 'en' && lang_version == 'SET_EN') {
          return
        }
        this.$store.dispatch(lang_version)
      },
      removeFun(){
        window.localStorage.removeItem('pbAdmin');
        window.localStorage.removeItem('loginInfo');
        let host_str="http://"+window.location.host+"/";
        window.location.href=host_str;
      },
      isInvalid(val) {
        let name = this.$route.name
        if ((name == '部门列表' || name == '用户列表' || name == '临时用户') && val.isDeptAdmin == '0') {
          return true
        }
        if (name == '群组管理' && val.pb_admin == '3') {
          return true
        }
        return false
      },
    },
    created() {
      this.pbAdmin = JSON.parse(window.localStorage.getItem('pbAdmin'))
      this.loginInfo = JSON.parse(window.localStorage.getItem('loginInfo'))
      let token = this.token
      let params = { token }
      getLoginInfo(params).then(data => {
        let pbAdmin = JSON.parse(window.localStorage.getItem('pbAdmin'))
        if (pbAdmin.pb_admin != data.result.pbJson.pb_admin) {
          pbAdmin.pb_admin = data.result.pbJson.pb_admin
          this.pbAdmin = pbAdmin
          window.localStorage.setItem('pbAdmin',JSON.stringify(pbAdmin))
          if (this.isInvalid(pbAdmin)) {
            this.$router.push({ path: '/' })
          }
        }
        let loginInfo = JSON.parse(window.localStorage.getItem('loginInfo'))
        if (loginInfo.isDeptAdmin != data.result.isDeptAdmin) {
          loginInfo.isDeptAdmin = data.result.isDeptAdmin
          this.loginInfo = loginInfo
          window.localStorage.setItem('loginInfo',JSON.stringify(loginInfo))
          if (pbAdmin.pb_admin !== 0 && this.isInvalid(loginInfo)) {
            this.$router.push({ path: '/' })
          }
        }
      })
    },
    /*watch: {
      pbAdmin: function (val, oldval) {
        if (oldval != null && this.isInvalid(val)) {
          this.$router.push({ path: '/' })
        }
      },
      loginInfo: function (val, oldval) {
        console.log(val, oldval)
        if (oldval != null && this.isInvalid(val)) {
          this.$router.push({ path: '/' })
        }
      },
    }*/
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../common/css/minix'
  a
    display inline-block
    width 100%
    height 36px
    line-height 36px
    text-decoration none
    padding 0 20px
  .el-menu--dark
    display inline-block
    background-color #373d41
  .el-menu-item
    padding 0!important
    min-width :115px !important
  .el-dropdown-menu__item
    padding 0
  #beta_tip
    position absolute
    padding 18px 0px
    height 60px
    line-height 50px
    color #fff
    left 300px
    top 0px
    z-index 8
    div
      display inline-block
      font-size 16px
      line-height 25px
      padding 0px 8px
      border 1px solid #fff
      background rgba(130,171,189,0.5)
      &:first-child
        border-top-left-radius  8px
        border-bottom-left-radius  8px
        height 52px
        line-height 52px
        font-size 0px
        >i
          font-size 52px
      &:last-child
        border-top-right-radius  8px
        border-bottom-right-radius  8px

  body > ul.admin_head_drop
    font-size 14px
  #head_box
    position absolute
    top 0px
    left 0px
    width 100%
    color #bfcbd9
    min-width 1250px
  ul > li.dropText
    width 103px!important
    a
      text-decoration none
      color #444
  .wrapper
    font-family Microsoft YaHei
    background Default
    line-height 60px
    height 60px
    width 100%
    font-size 0px
    overflow hidden
    background-color #373d41
    color #bfcbd9
    .wrapper_l
      float left
      margin-left 18px
      height 60px
      padding-top 11px
      .logo
        vertical-align top
        display inline-block
        width auto
        height 60px
        margin-right 8px
      .text
        font-size 26px
    .wrapper_r
      float right
      margin-right 68px
      &>div
        display inline-block
        color #fff
        font-size 20px
        margin-left 16px
      .userImg
        vertical-align top
        width 50px
        height 50px
        background url('img/user_img.jpg')
        background-size 100% 100%
        border-radius 50%
      .userName
        .dropTitle
          font-size 14px
      .language
        font-size 14px
        .header-lang
          display inline-block
          cursor pointer
          opacity 0.7
          &.is-active
            opacity 1
</style>
