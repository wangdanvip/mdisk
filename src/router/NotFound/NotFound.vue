<template>
  <div id="NotFound">
    <div class="main">
      <!--页面内容开始-->
      <div class="content">
        <div class="backBox">
          <a class="comeback" onclick="window.history.go(-1)">返回上一步</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  body
    overflow hidden
    .content
      position relative
      margin 230px auto
      width 750px
      height 220px
      background url('img/404-bg.jpg') no-repeat
      font-family "Microsoft YaHei",SimHei,sans-serif
      .comeback
        position absolute
        top 121px
        left 300px
        display inline-block
        width 200px
        height 55px
        border-radius 3px
        background #5fb2ea
        color #fff
        text-align center
        text-decoration none
        font-size 24px
        line-height 55px
        cursor pointer
</style>
