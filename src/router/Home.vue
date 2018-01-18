<template>
  <div id="Home">
    <v_head></v_head>
    <div id="wrapper">
      <!--<div id="menu_box" :style="{'width':0+'px'}">
        <MenuNav></MenuNav>
      </div>-->
      <div id="content_box" :style="{'padding-left':0+'px'}" v-loading.lock="mask.show > 0">
        <!-- :element-loading-text="i18n.g.data_loading"-->
        <div style="overflow: auto">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <!--<div id="guideLayer" v-if="show_tips">-->
    <!--</div>-->
    <!--<div id="guideLayer_tips"  v-if="show_tips">-->
      <!--<div id="yd_bg"></div>-->
      <!--<div id="yd_close" @click="closeTips"></div>-->
    <!--</div>-->
  </div>
</template>
<script type="text/ecmascript-6">
  import v_head from 'components/v-head/v-head.vue'
  import MenuNav from 'components/MenuNav/MenuNav.vue'
  import {mapGetters, mapActions} from 'vuex'
  import lang from 'src/lang.json'

  export default {
    components:{
      v_head,
      MenuNav
    },
//    data(){
//      return {
////        'show_tips':false
//      }
//    },
    computed:{
      ...mapGetters([
        'language_version',
        'left_menu_w',
        'mask'
      ]),
      '__':function(){
        let __={};
        this.language_version === 'zh'?__ = lang.zh_CN:__ = lang.en;
        return __;
      },
      token () {
        return JSON.parse(window.localStorage.getItem('loginInfo')).token
      },
    },
    methods:{
      /*'closeTips'(){
        this.show_tips=false;
      }*/
    },
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  #Home
    width 100%
    height 100%
    #wrapper
      width 100%
      height 100%
      box-sizing border-box
      padding-top 60px
      overflow hidden
      #menu_box
        float left
        height 100%
        /*background #324157*/
        /*background #d1dbe5*/
        background #fff
        border-right 1px solid #d5d5d5
        box-shadow 0 1px 1px #b3b3b3;
        overflow-y auto
      #content_box
        width 100%
        height 100%
        box-sizing border-box
        background #f3f3f4
        &>div
          padding 16px
          height 100%
    #guideLayer
      position absolute
      left 0px
      top 0px
      width 100%
      height 100%
      background #000
      opacity: 0.5
      z-index 998
    #guideLayer_tips
      position absolute
      left 0px
      top 0px
      width 100%
      height 100%
      z-index 999
      #yd_bg
        width 807px
        height 580px
        z-index 999
        background url("../common/img/yd_bg.png")
      #yd_close
        cursor pointer
        position absolute
        left 800px
        top: 80px
        width 175px
        height 136px
        background url("../common/img/yd_close.png")
</style>
<style lang="stylus" rel="stylesheet/stylus">
  .pagination_slot
    border-color #20a0ff
    background-color #20a0ff
    color #fff
    text-align center
    cursor default
  .el-table
    overflow visible!important
  .text-over
    white-space nowrap
    text-overflow ellipsis
    word-break break-all
    overflow hidden
    margin-top 8px
  .left_wrapper
    float left
    height 100%
    width 300px
    overflow-x hidden
  .right_wrapper
    position absolute
    right 0
    top 0
    bottom 0
  .content_wrapper
    position relative
    font-size 20px
    width 100%
    height 100%
    background #fff
    border-radius 8px
  .el-notification__content
    text-align left
  .el-loading-mask
    background-color transparent
  .dialog-footer
    .el-button
      width 74px
  /*.el-tree-node > .el-tree-node__children
    overflow inherit!important*/
  .icon-action
    color #20a0ff
    position relative
    top 1px
    &:hover
      cursor pointer
      color #4db3ff
  .el-tooltip__popper
    padding  10px!important
    max-width 265px
    line-height 22px
    border 1px solid #bfcbd9!important
  .popper__arrow
    border-bottom-color #bfcbd9!important
  .select
    border-radius 4px
    height 36px
    padding-left 6px
    vertical-align top
    border 1px solid #bfcbd9
    &:focus
      border 1px solid #20a0ff
      outline none
  .red
    color red
    margin-right 6px
  .el-form-item.is-error .el-input__inner, .el-form-item.is-error .el-textarea__inner
    border-color #bfcbd9
  .btn_wrapper
    padding-bottom 6px
    border-bottom 1px solid #cccccc
  .column-extend
    padding-left  5px!important
    padding-right 0!important
  .el-input--small .el-input__inner
    height 32px
</style>
