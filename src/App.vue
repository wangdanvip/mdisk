<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
  import v_head from 'components/v-head/v-head.vue';
  import MenuNav from 'components/MenuNav/MenuNav.vue';
  import {mapGetters, mapActions} from 'vuex'
  import lang from './lang.json';

  export default {
    components:{
      v_head,
      MenuNav
    },
    computed:{
      ...mapGetters([
        'language_version'
      ]),
      '__':function(){
        let __={};
        this.language_version === 'zh'?__ = lang.zh_CN:__ = lang.en;
        return __;
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  #app
    width 100%
    height 100%
    font-size 14px
</style>
