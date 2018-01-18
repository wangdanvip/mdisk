<template>
  <div class="main_wrapper wrap_shoadow">
    <div style="padding: 10px">
      <span style="font-weight: bold">{{i18n.u_storage_list}}</span>
      <i class="iconfont icon-back icon-action" @click="chart_view"></i>
    </div>

    <el-table
      :data="tableData"
      ref="table"
      stripe
      border>
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        :label="i18n.UserList.user_name"
        width="160">
        <template scope="scope">
          <span :title="scope.row.username" class="text-over" style="display:inline-block;width: 100%;">{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="i18n.mip"
        width="160">
        <template scope="scope">
          <span :title="scope.row.userAccount" class="text-over" style="display:inline-block;width: 100%;">{{scope.row.userAccount}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalCapacity"
        :label="i18n.total_capacity">
        <template scope="scope">
          <span>{{scope.row.totalCapacity/1024/1024}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cnUseCapacity"
        :label="i18n.cn_usage">
        <template scope="scope">
          <span>{{scope.row.cnUseCapacity%1024 == 0 ? scope.row.cnUseCapacity/1024 : (scope.row.cnUseCapacity/1024).toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="hkUseCapacity"
        :label="i18n.hk_usage">
        <template scope="scope">
          <span>{{scope.row.hkUseCapacity%1024 == 0 ? scope.row.hkUseCapacity/1024 : (scope.row.hkUseCapacity/1024).toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="i18n.DepartmentList.belongs_to_depart"
        width="320">
        <template scope="scope">
          <span class="text-over" style="width: 100%;display: inline-block" :title="scope.row.deptName">{{scope.row.deptName}}</span>
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
        ref="deptPagination"
        :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { userStore } from './request'

  export default {
    data() {
      return ({
        tableData: [],
        pagination: {
          currentPage: 1,
          pageSize: 20,
          total: 20
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
          token: this.token
        }
        userStore(params).then(data => {
          try{
            this.tableData = data.result
            this.pagination.total = parseInt(data.total, 10)
          }catch(e) { console.log(e) }
        })
      },
      chart_view() {
        this.$router.push({ name: 'dataCenter' })
      },
    },
    created () {
      this.getTableData()
    },
    mounted () {
      let elem = this.$refs.table.$vnode.child.$el.childNodes[2]
      elem.style.maxHeight=(document.body.clientHeight - 250)+'px'

      window.onresize=() => {
        let elem = this.$refs.table.$vnode.child.$el.childNodes[2]
        elem.style.maxHeight=(document.body.clientHeight - 250)+'px'
      }
    },
    destroyed() {
      window.onresize = null
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
</style>
