<template>
  <div class="main_wrapper wrap_shoadow">
    <div style="padding: 10px">
      <span style="font-weight: bold">{{i18n.tracking_list}}</span>
      <i class="iconfont icon-back icon-action" @click="chart_view"></i>
    </div>
    <div style="margin-bottom: 15px;">
      <el-select v-model="pageId" @change="select_page" ref="select" :placeholder="i18n.select_page">
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
        :label="i18n.page"
        width="360">
      </el-table-column>
      <el-table-column
        prop="buttonName"
        :label="i18n.name">
      </el-table-column>
      <el-table-column
        prop="clickNum"
        :label="i18n.traffic">
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
  import { getTracking } from './request'

  export default {
    data() {
      let i18n = this.i18n
      return ({
        pageId: '',
        options: [{
          value: '',
          label: i18n.select_page
        }, {
          value: '1',
          label: i18n.home
        }, {
          value: '2',
          label: i18n.personal_files
        }, {
          value: '3',
          label: i18n.video
        }, {
          value: '4',
          label: i18n.music
        }, {
          value: '5',
          label: i18n.doc
        }, {
          value: '6',
          label: i18n.picture
        }, {
          value: '7',
          label: i18n.group_files
        }, {
          value: '8',
          label: i18n.dispatchedFiles
        }, {
          value: '9',
          label: i18n.receivedFiles
        }, {
          value: '10',
          label: i18n.collection
        }, {
          value: '11',
          label: i18n.shareDownload
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
      select_page() {
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
          token: this.token,
          pageId: this.pageId
        }
        getTracking(params).then(data => {
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
