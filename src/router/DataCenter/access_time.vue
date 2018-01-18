<template>
  <div class="main_wrapper wrap_shoadow">
    <div style="padding: 10px">
      <span style="font-weight: bold">{{i18n.access_time_table}}</span>
      <i class="iconfont icon-back icon-action" @click="chart_view"></i>
    </div>
    <div style="margin-bottom: 15px;">
      <el-select v-model="area" @change="select_area" ref="select">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>

    <el-table
      :data="tableData"
      border
      :max-height="maxHeight"
      ref="table">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="pageName"
        :label="i18n.pageName"
        width="360">
      </el-table-column>
      <el-table-column
        prop="staytime"
        :label="i18n.access_time">
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
  import { access_time } from './request'

  export default {
    data() {
      let i18n = this.i18n
      return ({
        area: 'cn',
        options: [{
          value: 'cn',
          label: i18n.mainland_data
        }, {
          value: 'hk',
          label: i18n.INT_data
        }],
        tableData: [],
        pagination: {
          currentPage: 1,
          pageSize: 20,
          total: 20
        },
        maxHeight: 0
      })
    },
    computed:{
      token () {
        return JSON.parse(window.localStorage.getItem('loginInfo')).token
      }
    },
    methods: {
      select_area() {
        this.getTableData()
      },
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
          site: this.area,
          token: this.token,
          dateType: this.$route.query && this.$route.query.dateType || '4'
        }
        if (params.dateType == '5') {
          params.beginDate = this.$route.query && this.$route.query.beginDate
          params.endDate = this.$route.query && this.$route.query.endDate
        }
        access_time(params).then(data => {
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
</style>
