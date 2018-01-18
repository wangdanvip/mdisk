<template>
  <div class="webhelp pull-right animated" :class="{ slideInRight: show, slideOutRight: !show }">
    <div class="title">
      <h3>{{i18n.g[view]}}</h3>
      <i class="iconfont icon-arrow-right pull-right" @click="onAction"></i>
    </div>
    <component class="content" v-bind:is="view">
    </component>
  </div>
</template>

<script type="text/ecmascript-6">
  import department_list from 'src/router/DepartmentList/webHelp.vue'
  import department_admin from 'src/router/DepartmentAdmin/webHelp.vue'

  export default {
    props: ['show', 'view', 'onAction'],
    components: {
      department_list,
      department_admin
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .webhelp
    width 320px
    position absolute
    top 0
    right 0
    background-color #fff
    box-shadow 0 -1px 24px rgba(0, 0, 0, .4)
    z-index 1000
    font-size 14px
    .title
      padding 9px 22px
      border-bottom 1px solid #d9d9d9
      h3
        display inline-block
        font-size 20px
      i
        position relative
        top 3px
        color #999999
        &:hover
          cursor pointer
          color #333
    .content
      line-height 1.5em
      padding 6px
  .animated
    animation-duration .4s
    animation-fill-mode both
  .slideOutRight
    animation-name slideOutRight
  @keyframes slideOutRight
    0% {
      transform translate3d(0, 0, 0)
    }
    100% {
      visibility hidden
      transform translate3d(100%, 0, 0)
    }
  .slideInRight
    animation-name slideInRight
  @keyframes slideInRight
    0% {
      transform translate3d(100%, 0, 0)
      visibility visible
    }
    100% {
      transform translate3d(0, 0, 0)
    }
</style>
