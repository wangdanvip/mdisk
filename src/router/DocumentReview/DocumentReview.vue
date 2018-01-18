<template>
  <div id="DocumentReview_box">
    <div class="main_wrapper">
      <div class="content_wrapper wrap_shoadow">
        <div class="btn_wrapper">
          <el-button type="primary" size="small" icon="iconfont iconfont icon-shuaxin" >{{__.g.refresh}}</el-button>
        </div>
        <div class="table_wrapper">
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            :row-class-name="tableRowClassName">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="promulgator"
              :label="__.DocumentReview.promulgator"
              width="150">
            </el-table-column>
            <el-table-column
              prop="upload_file"
              :label="__.DocumentReview.upload_file"
              width="150">
            </el-table-column>
            <el-table-column
              prop="file_path"
              :label="__.DocumentReview.file_path">
            </el-table-column>
            <el-table-column
              prop="upload_time"
              :label="__.DocumentReview.upload_time"
              width="220">
            </el-table-column>
            <el-table-column
              prop="status"
              :label="__.DepartmentList.status"
              width="100"
              :filters="[{ text: __.DocumentReview.audit_s, value: '0' }, { text: __.DocumentReview.audit_fail, value: '0' },{ text: __.DocumentReview.audit_ing, value: '2' }]"
              :filter-method="filterStatus">
            </el-table-column>
            <el-table-column
              width="170"
              prop="r_time"
              :label="__.CasualUser.r_time">
            </el-table-column>
            <el-table-column
              prop="handle_status"
              :label="__.DepartmentList.handle"
              width="160"
              @click="handleEdit(scope.$index, scope.row)">
              <template scope="scope">
                <el-button size="small" class="el-button--danger">{{__.g.delete}}</el-button>
                <el-button size="small" class="el-button--primary">{{__.g.edit}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapActions} from 'vuex'
  import lang from 'src/lang.json'

  export default {
    data(){
      return ({
        'tableData':[{
          'promulgator':'chenlc2',
          'upload_file':'123.xps',
          'file_path':'/群组文件/国际/it群组',
          'upload_time':'2017.2.10 12：00：00',
          'status':'0'
        },{
          'promulgator':'陈小花',
          'upload_file':'123.xps',
          'file_path':'/群组文件/国际/合同系统',
          'upload_time':'2017.2.10 12：00：00',
          'status':'1'
        },{
          'promulgator':'陈小花',
          'upload_file':'123.xps',
          'file_path':'/群组文件/国际/合同系统',
          'upload_time':'2017.2.10 12：00：00',
          'status':'2'
        }]
      })
    },
    computed:{
      ...mapGetters([
        'language_version'
      ]),
      '__'(){
        let __={};
        this.language_version === 'zh'?__ = lang.zh_CN:__ = lang.en;
        return __;
      }
    },
    methods: {
      tableRowClassName(row, index) {
        if (index%2 === 1) {
          return 'info-row';
        } else if (index%2 === 0) {
          return 'positive-row';
        }
        return '';
      },
      filterStatus(value, row) {
        return row.status === value;
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  #DocumentReview_box
    height 100%
    overflow-x auto
    .main_wrapper
      width 100%
      height 100%
      min-width 886px
      .content_wrapper
        position relative
        font-size 20px
        width 99%
        height 99%
        background #fff
        border-radius 8px
        overflow-y auto
        .btn_wrapper
          line-height 48px
          padding-bottom 6px
          border-bottom 1px solid #cccccc
        .table_wrapper
          width 100%
          margin-top 12px
</style>
