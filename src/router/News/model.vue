<template>
  <div class="main_wrapper wrap_shoadow">
    <div class="btn_wrapper">
      <el-button type="primary" size="small" icon="iconfont iconfont icon-add" @click="addView()">{{i18n.g.add}}</el-button>
    </div>

    <el-table
      :data="tableData"
      border
      style="margin-top: 12px;"
      stripe
      :max-height="maxHeight"
      ref="table">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="title"
        :label="i18n.article_name">
        <template scope="scope">
          <span class="text-over" style="width: 100%;display: inline-block" :title="scope.row.title">{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="i18n.release_location">
        <template scope="scope">
          <span>{{p_map[scope.row.position]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="view"
        :label="i18n.pageviews">
      </el-table-column>
      <el-table-column
        :label="i18n.DepartmentList.status">
        <template scope="scope">
          <span>{{s_map[scope.row.status]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="i18n.DepartmentList.handle">
        <template scope="scope">
          <el-button @click="publishNews(scope.row.id)" v-if="scope.row.status == 0" size="small" class="el-button--primary">{{i18n.release}}</el-button>
          <el-button @click="editView(scope.row.id)" v-if="scope.row.status == 0" size="small" class="el-button--primary">{{i18n.g.edit}}</el-button>
          <el-button @click="delNews(scope.row.id)" v-if="scope.row.status == 0" size="small" class="el-button--danger">{{i18n.g.delete}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 12px; text-align: right;margin-right: 36px;">
      <el-pagination
        @current-change="currentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="pagination.pageSize"
        layout="total, prev, pager, next"
        :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getNews, delNews, publishNews } from './request'

  export default {
    data() {
      let i18n = this.i18n
      return ({
        tableData: [],
        pagination: {
          currentPage: 1,
          pageSize: 20,
          total: 20
        },
        maxHeight: 0,
        p_map: {
          1: i18n.FAQ,
          2: i18n.system_info,
          3: i18n.suggestion,
        },
        s_map: {
          0: i18n.unpublished,
          1: i18n.published
        },
      })
    },
    computed:{
      token () {
        return JSON.parse(window.localStorage.getItem('loginInfo')).token
      }
    },
    methods: {
      currentChange(val) {
        this.pagination.currentPage = val
        this.getTableData()
        try {
          this.$refs.table.$vnode.child.$el.childNodes[2].scrollTop = 0
        } catch (e) { console.log(e) }
      },
      getTableData() {
        let params = {
          index: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          token: this.token,
        }
        getNews(params).then(data => {
          try{
            this.tableData = data.result
            this.pagination.total = parseInt(data.total, 10)
          }catch(e) { console.log(e) }
        })
      },
      delNews(id) {
        var _this = this
        let func = function() {
          let params = {
            newsId: id,
            token: _this.token,
          }
          delNews(params).then(data => {
            try{
              _this.getTableData()
              _this.msg('success', _this.i18n.g.handle_success)
            }catch(e) { console.log(e) }
          })
        }
        this.confirm('warning', this.i18n.g.s_t_del, func)
      },
      publishNews(id) {
        let params = {
          newsId: id,
          status: '1',
          token: this.token,
        }
        publishNews(params).then(() => {
          try{
            this.getTableData()
            this.msg('success', this.i18n.g.handle_success)
          }catch(e) { console.log(e) }
        })
      },
      addView() {
        this.$router.push({name: 'addNews'})
      },
      editView(id) {
        this.$router.push({name: 'editNews', params: { id: id }})
      },
    },
    created () {
      this.getTableData()
    },
    mounted () {
      this.maxHeight = document.body.clientHeight- 260
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .main_wrapper
    width 100%
    height 100%
    background #fff
    border-radius 8px
    overflow auto
    /*margin 0 auto*/
  .btn_wrapper
    padding-bottom 6px
    border-bottom 1px solid #cccccc
</style>
