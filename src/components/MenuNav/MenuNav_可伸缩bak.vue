<template>
  <div>
    <div style="padding-top:6px;text-align:center;line-height:30px;color:#fff;cursor:pointer; z-index: 2008" @click="changeMenuHide()"><i class="iconfont icon-shouyeicon02"></i></div>
    <el-menu class="el-menu-vertical-demo" theme="dark" :router="true" :default-active="$route.path" router >
      <el-submenu index="1" v-if="pbAdmin.pb_admin==='0' || loginInfo.isDeptAdmin==='1'">
        <template :style="MenuHide?{'padding-left':'0px'}:{}" slot="title"><span v-show="!MenuHide">{{__.g.department_manage}}</span></template>
        <el-menu-item-group>
          <el-menu-item :style="MenuHide?{'padding-left':'0px','text-align':'center','padding-right':'0px'}:{}" index="/DepartmentList" :route="{'path':'/DepartmentList'}"><i class="iconfont icon-wu"></i><span v-show="!MenuHide">{{__.g.department_list}}</span></el-menu-item>
          <el-menu-item v-if="pbAdmin.pb_admin==='0'" :style="MenuHide?{'padding-left':'0px','text-align':'center','padding-right':'0px'}:{}" index="/DepartmentAdmin" :route="{'path':'/DepartmentAdmin'}"><i class="iconfont icon-wu"></i><span v-show="!MenuHide">{{__.g.department_admin}}</span></el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2" v-if="pbAdmin.pb_admin==='0' || loginInfo.isDeptAdmin==='1'">
        <template :style="MenuHide?{'padding-left':'0px'}:{}" slot="title"><span v-show="!MenuHide">{{__.g.user_manage}}</span></template>
        <el-menu-item-group>
          <el-menu-item :style="MenuHide?{'padding-left':'0px','text-align':'center','padding-right':'0px'}:{}" index="/UserList" :route="{'path':'/UserList'}"><i class="iconfont icon-Userlist"></i><span v-show="!MenuHide">{{__.g.user_list}}</span></el-menu-item>
          <el-menu-item :style="MenuHide?{'padding-left':'0px','text-align':'center','padding-right':'0px'}:{}" index="/CasualUser" :route="{'path':'/CasualUser'}"><i class="iconfont icon-linshikehu1"></i><span v-show="!MenuHide">{{__.g.casual_list}}</span></el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3" v-if="pbAdmin.pb_admin==='0' || pbAdmin.pb_admin==='1' || pbAdmin.pb_admin==='2'">
        <template :style="MenuHide?{'padding-left':'0px'}:{}" slot="title"><span v-show="!MenuHide">{{__.g.group_manage}}</span></template>
        <el-menu-item-group>
          <el-menu-item :style="MenuHide?{'padding-left':'0px','text-align':'center','padding-right':'0px'}:{}" index="/GroupManage" :route="{'path':'/GroupManage'}"><i class="iconfont icon-qunzu"></i><span v-show="!MenuHide">{{__.g.group_list}}</span></el-menu-item>
          <el-menu-item :style="MenuHide?{'padding-left':'0px','text-align':'center','padding-right':'0px'}:{}" index="/GroupPermission" :route="{'path':'/GroupPermission'}" v-if="pbAdmin.pb_admin==='0'"><i class="iconfont icon-qunzhu"></i><span v-show="!MenuHide">{{__.g.GroupPermission}}</span></el-menu-item>
          <!--<el-menu-item index="/DocumentReview" :route="{'path':'/DocumentReview'}">{{__.g.document_review}}</el-menu-item>-->
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
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
        console.log('11');
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
