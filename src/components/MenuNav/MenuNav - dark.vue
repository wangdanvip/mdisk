<template>
  <div>
    <div style="padding-top:6px;text-align:center;line-height:30px;color:#fff;cursor:pointer; z-index: 2008" @click="changeMenuHide()"><i class="iconfont icon-shouyeicon02"></i></div>


    <ul class="el-menu el-menu-vertical-demo el-menu--dark">
      <li class="el-submenu is-opened" v-if="pbAdmin.pb_admin==='0' || loginInfo.isDeptAdmin==='1'">
        <div class="el-submenu__title" style="padding-left: 20px;" :style="MenuHide?{'padding-left':'0px'}:{}">
          <span v-show="!MenuHide">{{__.g.department_manage}}</span>
        </div>
        <ul class="el-menu">
          <li class="el-menu-item-group">
            <div class="el-menu-item-group__title" style="padding-left: 30px;"></div>
            <ul>
              <router-link :style="MenuHide?{'padding-left':'0px','text-align':'center','padding-right':'0px'}:{}" :to="{'name':'部门列表'}" tag="li" active-class="is-active" class="el-menu-item" style="padding-left: 40px;">
                <i class="iconfont icon-bumen1"></i><span v-show="!MenuHide">{{__.g.department_list}}</span>
              </router-link>
              <router-link v-if="pbAdmin.pb_admin==='0'" :style="MenuHide?{'padding-left':'0px','text-align':'center','padding-right':'0px'}:{}" :to="{'name':'部门管理员'}" tag="li" active-class="is-active" class="el-menu-item" style="padding-left: 40px;">
                <i class="iconfont icon-guanliyuan"></i><span v-show="!MenuHide">{{__.g.department_admin}}</span>
              </router-link>
            </ul></li>
        </ul></li>
      <li class="el-submenu is-active is-opened" v-if="pbAdmin.pb_admin==='0' || loginInfo.isDeptAdmin==='1'">
        <div class="el-submenu__title" style="padding-left: 20px;">
          <span v-show="!MenuHide">{{__.g.user_manage}}</span>
        </div>
        <ul class="el-menu">
          <li data-v-05d82319="" class="el-menu-item-group">
            <div class="el-menu-item-group__title" style="padding-left: 30px;"></div>
            <ul>
              <router-link :style="MenuHide?{'padding-left':'0px','text-align':'center','padding-right':'0px'}:{}" :to="{'name':'用户列表'}" tag="li" active-class="is-active" class="el-menu-item" style="padding-left: 40px;">
                <i class="iconfont icon-Userlist"></i><span v-show="!MenuHide">{{__.g.user_list}}</span>
              </router-link>
              <router-link :style="MenuHide?{'padding-left':'0px','text-align':'center','padding-right':'0px'}:{}" :to="{'name':'临时用户'}" tag="li" active-class="is-active" class="el-menu-item" style="padding-left: 40px;">
                <i class="iconfont icon-linshikehu1"></i><span v-show="!MenuHide">{{__.g.casual_list}}</span>
              </router-link>
            </ul></li>
        </ul></li>
      <li class="el-submenu is-opened" v-if="pbAdmin.pb_admin==='0' || pbAdmin.pb_admin==='1' || pbAdmin.pb_admin==='2'">
        <div class="el-submenu__title" style="padding-left: 20px;">
          <span v-show="!MenuHide">{{__.g.group_manage}}</span>
        </div>
        <ul class="el-menu">
          <li class="el-menu-item-group">
            <div class="el-menu-item-group__title" style="padding-left: 30px;"></div>
            <ul>
              <router-link :style="MenuHide?{'padding-left':'0px','text-align':'center','padding-right':'0px'}:{}" :to="{'name':'群组管理'}" tag="li" active-class="is-active" class="el-menu-item" style="padding-left: 40px;">
                <i class="iconfont icon-qunzu"></i><span v-show="!MenuHide">{{__.g.group_list}}</span>
              </router-link>
              <router-link :style="MenuHide?{'padding-left':'0px','text-align':'center','padding-right':'0px'}:{}" :to="{'name':'群组权限'}" tag="li" active-class="is-active" class="el-menu-item" style="padding-left: 40px;" v-if="pbAdmin.pb_admin==='0'">
                <i class="iconfont icon-qunzhu"></i><span v-show="!MenuHide">{{__.g.GroupPermission}}</span>
              </router-link>
            </ul></li>
        </ul></li>
    </ul>


  </div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapActions} from 'vuex'
  import lang from 'src/lang.json'
  export default {
    computed:{
      ...mapGetters([
        'language_version',
        'left_menu_w'
      ]),
      '__'(){
        let __={};
        this.language_version === 'zh'?__ = lang.zh_CN:__ = lang.en;
        return __;
      },
      'pbAdmin'(){
        let pbAdmin = JSON.parse(window.localStorage.getItem('pbAdmin'));
        return pbAdmin;
      },
      'loginInfo'(){
        let loginInfo = JSON.parse(window.localStorage.getItem('loginInfo'));
        return loginInfo;
      }
    },
    data(){
      return({
        'MenuHide':false
      })
    },
    methods:{
      'changeMenuHide'(){
        this.MenuHide=!this.MenuHide;
        this.MenuHide?this.$store.dispatch('set_left_menu_w_min'):this.$store.dispatch('set_left_menu_w_max');
      }
    },
    created(){
      this.MenuHide=this.left_menu_w!=='260';
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  i.iconfont
    margin-right 8px
</style>
