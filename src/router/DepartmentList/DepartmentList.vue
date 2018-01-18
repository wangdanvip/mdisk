<template>
  <div id="Depart_box">
    <!--<div class="collapse-icon" @click="collapse" :style="{left: (search_w > 0 ? 270 : 0) + 'px'}">
      <i class="iconfont icon-formatindentincrease"></i>
    </div>-->
    <div class="left_wrapper clearFix" :style="{width: search_w + 'px'}">
      <div class="content_wrapper wrap_shoadow">
        <div class="el-input">
          <i @click="searchDept" class="el-input__icon el-icon-search" style="cursor: pointer;"></i>
          <span v-show="deptFilter" @click="deptFilter=''" style="position: absolute; right: 30px; font-size: 20px; cursor: pointer; top: 8px; color: #bfcbd9;">x</span>
          <input @keydown.enter="searchDept" type="text" :placeholder="__.DepartmentList.search_placeholder" autocomplete="off" class="el-input__inner" v-model="deptFilter">
        </div>
        <el-tree :data="tree_search"
                 ref="tree"
                 v-if="pbAdmin.pb_admin == '0'"
                 v-show="treeMode"
                 @node-click="nodeClick"
                 :check-strictly="true"
                 :expand-on-click-node="false"
                 :props="superProps"
                 :render-content="renderContent"
                 :load="loadNode"
                 lazy
                 highlight-current
                 :style="{height:left_list_height+'px',overflow:'auto','min-height':'40px'}">
        </el-tree>
        <ul v-show="!treeMode" :style="{height:left_list_height+'px',overflow:'auto','min-height':'40px'}">
          <li v-show="searchResult.length==0">
            {{__.g.no_data}}
          </li>
          <li v-for="e in searchResult" @click="nodeClick(e)" style="width: 220px; overflow: hidden; font-size: 14px; cursor: pointer;">
            <i class="iconfont icon-fangzi" style="color: rgb(16, 148, 16); margin: 0px 6px;"></i>
            <span :title="e.deptName" :style="e.deptId==parentDeptId?{'color':'#cf6216'}:{}">{{e.deptName}}
            </span>
            <span :title="e.parentName" :style="e.deptId==parentDeptId?{'color':'#cf6216'}:{}" class="text-over" style="display:inline-block;width:100%">{{e.parentName}}</span>
          </li>
        </ul>
        <el-tree :data="tree_search"
                 v-if="pbAdmin.pb_admin != '0'"
                 v-show="treeMode"
                 ref="tree"
                 @node-click="nodeClick"
                 :default-expand-all="true"
                 :props="props"
                 :render-content="renderContent"
                 highlight-current
                 :style="{height:left_list_height+'px',overflow:'auto','min-height':'40px'}"></el-tree>
      </div>
    </div>
    <div class="right_wrapper" :style="{left: (search_w > 0 ? 296 : 26) + 'px'}">
      <div class="content_wrapper wrap_shoadow">
        <div class="btn_wrapper">
          <el-button @click="lockDepts" type="primary" size="small" icon="iconfont iconfont icon-iconfontsuoding">{{__.g.lock_department}}</el-button>
          <el-button @click="unlockDepts" type="primary" size="small" icon="iconfont iconfont icon-jiesuo">{{__.g.unlock_department}}</el-button>
          <el-button @click="refresh" type="primary" size="small" icon="iconfont iconfont icon-shuaxin" >{{__.g.refresh}}</el-button>
          <!--<i class="iconfont icon-icon-question icon-action pull-right" @click="toggleHelp()"></i>-->
          <!--<web-help :show="webHelp.opened" view="department_list" :onAction="toggleHelp"></web-help>-->
        </div>
        <div class="table_wrapper">
          <!--暂时去掉表格loading效果
            v-loading="loading"-->
          <el-table
            :data="tableData"
            border
            ref="table"
            style="width: 100%"
            :row-class-name="tableRowClassName"
            @selection-change="selectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              :label="__.DepartmentList.depart_name"
              width="200">
              <template scope="scope">
                <span :title="scope.row.deptName" class="text-over" style="display:inline-block;width: 100%;">{{scope.row.deptName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="parentName"
              :label="__.DepartmentList.belongs_to_depart">
              <template scope="scope">
                <span :title="scope.row.parentName" class="text-over" style="display:inline-block;width: 100%;">{{scope.row.parentName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              :label="__.DepartmentList.status"
              width="105"
              :formatter="formatter"
              :render-header="reder_head">
            </el-table-column>
            <el-table-column
              :label="__.DepartmentList.handle"
              width="105">
              <template scope="scope">
                <el-button v-if="scope.row.status == 0" @click="lockDept(scope.row.deptId)" size="small" class="el-button--danger" :style="{width: language=='en'?'68px':''}">{{__.g.Lock}}</el-button>
                <el-button v-if="scope.row.status == 1" @click="unlockDept(scope.row.deptId)" size="small" class="el-button--primary" :style="{width: language=='en'?'68px':''}">{{__.g.Unlock}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin-top: 12px; text-align: right;margin-right: 36px;">
          <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="pagination.currentPage"
            :page-sizes="[10, 20, 50]"
            :page-size="pagination.pageSize"
            layout="total, prev, pager, next"
            :total="pagination.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapActions} from 'vuex'
  import lang from 'src/lang.json'
  import {listDepts, requestGetAddressbook_nouser, lockDept, unlockDept, requestDeptSearchManage, requestGetDepartManageList} from 'common/api/api'
  import WebHelp from 'src/components/WebHelp.vue'

  export default {
    components:{
      WebHelp,
    },
    data(){
      return ({
        treeMode: true,
        tree_search: [],
        tableData:[],
        deptFilter: '',
        superProps: {
          children: 'children',
          label: 'mName',
          isLeaf: 'isLeaf'
        },
        props: {
          children: 'children',
          label: 'deptName'
        },
        pagination: {
          currentPage: 1,
          pageSize: 20,
          total: 20
        },
        parentDeptId: '',
        loading: false,
        multipleSelection: [],
        left_list_height: 400,
        searchResult: [],
        show_filter: false,
        checkList: {
          normal: true,
          lock: true
        },
        deptList: [],
        webHelp: {
          opened: false
        }
      })
    },
    computed:{
      ...mapGetters([
        'language_version',
        'search_w'
      ]),
      '__'(){
        let __={};
        this.language_version === 'zh'?__ = lang.zh_CN:__ = lang.en;
        return __;
      },
      token () {
        return JSON.parse(window.localStorage.getItem('loginInfo')).token
      },
      pbAdmin () {
        return JSON.parse(window.localStorage.getItem('pbAdmin'))
      },
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
      collapse () {
        this.search_w == '280' ? this.$store.dispatch('set_search_w_min') : this.$store.dispatch('set_search_w_max')
      },
      getAddressbook () {
        let params = {
          deptId: '',
          token: this.token
        }
        requestGetAddressbook_nouser(params).then(data => {
          try {
            this.tree_search = data.result
            this.parentDeptId = data.result[0].mid
            this.getTableData()
          } catch(e) { console.log(e) }
        })
      },
      renderContent(h, { node, data, store }) {
        let span_manage={
          'font-size':'12px',
          'color':'#000'
        }
        let span_no_manage={
          'font-size':'12px',
          'color':'rgba(0,0,0,0.3)'
        }
        return (
          <span style={data.isManage==='0'?span_no_manage:span_manage} title={node.label}>
            <i class="iconfont icon-fangzi" style="color:#109410;margin:0px 3px;"></i>
            {node.label}
          </span>
        )
      },
      loadNode (node, resolve) {
        let params = {
          deptId: node.data.mid,
          token: this.token
        }
        if (node.data.mTag===2){
          requestGetAddressbook_nouser(params).then(data => {
            resolve(data.result)
          })
        } else {
          resolve([])
        }
      },
      nodeClick (data, n, e) {
        if (data.isManage == '0') { return }
        this.parentDeptId = data.mid || data.deptId
        this.pagination.currentPage = 1
        this.checkList = {
          normal: true,
          lock: true
        }
        this.getTableData()

        //所管理的部门点击节点查询通讯录
        if (this.pbAdmin.pb_admin != '0' && this.treeMode) {
          let params = {
            deptId: this.parentDeptId,
            token: this.token
          }
          requestGetAddressbook_nouser(params).then(res => {
            try {
              data.children = res.result.map((e) => {
                return {
                  deptName: e.mName,
                  deptId: e.mid,
                  children: [],
                  isManage: '1'
                }
              })
            } catch(e) { console.log(e) }
          })
        }
      },
      searchDept () {
        this.deptFilter = this.deptFilter.replace(/(^\s*)|(\s*$)/g,"")
        if (this.deptFilter ==  '') {
          this.treeMode = true
          return
        }
        this.treeMode = false
        let params = {
          token: this.token,
          deptName: this.deptFilter
        }
        requestDeptSearchManage(params).then(data => {
          if(data.errorCode == "200"){
            this.searchResult = data.result;
          }
        })
      },
      getTableData () {
        let params = {
          deptId: this.parentDeptId,
          index: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          token: this.token
        }
        if (!this.checkList.normal) {
          params.isLock = 1
        } else if (!this.checkList.lock) {
          params.isLock = 0
        }

        listDepts(params).then(data => {
          try {
            /*if (data.result.length == 0 && this.pagination.currentPage > 1) {
              this.pagination.currentPage = this.pagination.currentPage - 1
              this.msg('warning', this.__.g.no_more_data)
              return
            }*/
            this.tableData = data.result
            this.pagination.total = parseInt(data.total, 10)
            this.loading = false
          } catch (e) { console.log(e) }
        })
      },
      formatter (row) {
        if (row.status == 0) {
          return this.__.g.normal
        } else if (row.status == 1) {
          return this.__.g.Lock
        }
      },
      sizeChange (val) {
        this.pagination.pageSize = val
        this.pagination.currentPage = 1
        this.getTableData()
      },
      currentChange (val) {
        if (val != this.pagination.currentPage) {
          this.pagination.currentPage = val
          this.getTableData()
        }
      },
      lockDept (id) {
        this.$confirm(this.__.g.is_sure_confirm, this.__.g.warning, {
          confirmButtonText:this.__.g.sure_q,
          cancelButtonText:this.__.g.cancel_q,
          type: 'warning'
        }).then(() => {
          let _this = this
          let params = {
            deptId: id,
            token: this.token
          }
          this.loading = true
          lockDept(params).then(data => {
            if (data.errorCode == '200') {
              setTimeout(function () {
                _this.getTableData()
                _this.msg('success', _this.__.DepartmentList.lock_dept_s)
              }, 500)
            } else {
              this.loading = false
            }
          })
        }).catch(() => {})
      },
      lockDepts () {
        var _this = this
        let arr = this.multipleSelection.filter((item) => {
          return item.status == 0;
        })
        if(arr.length===0){
          this.msg('warning', this.__.DepartmentList.s_one_normal)
          return
        }
        this.$confirm(this.__.g.is_sure_confirm, this.__.g.warning, {
          confirmButtonText:this.__.g.sure_q,
          cancelButtonText:this.__.g.cancel_q,
          type: 'warning'
        }).then(() => {
          this.loading = true
          let promises = arr.map((item) => {
            return new Promise((resolve, reject) => {
              let params = {
                deptId: item.deptId,
                token: _this.token
              }
              lockDept(params).then(data => {
                if (data.errorCode == 200) {
                  resolve()
                } else {
                  reject()
                }
              })
            })
          })
          Promise.all(promises).then(res => {
            _this.getTableData()
            _this.loading = false
            _this.msg('success', _this.__.g.complete_head + res.length + _this.__.g.complete_foot)
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {})
      },
      unlockDept (id) {
        this.$confirm(this.__.g.is_sure_confirm, this.__.g.warning, {
          confirmButtonText:this.__.g.sure_q,
          cancelButtonText:this.__.g.cancel_q,
          type: 'warning'
        }).then(() => {
          let _this = this
          let params = {
            deptId: id,
            token: this.token
          }
          this.loading = true
          unlockDept(params).then(data => {
            if(data.errorCode === "200"){
              setTimeout(function () {
                _this.getTableData()
                _this.msg('success', _this.__.DepartmentList.unlock_dept_s)
              }, 500)
            } else {
              this.loading =  false
            }
          })
        }).catch(() => {})
      },
      unlockDepts () {
        var _this = this
        let arr = this.multipleSelection.filter((item) => {
          return item.status == 1;
        })
        if(arr.length===0){
          this.msg('warning', this.__.DepartmentList.s_one_lock)
          return
        }
        this.$confirm(this.__.g.is_sure_confirm, this.__.g.warning, {
          confirmButtonText:this.__.g.sure_q,
          cancelButtonText:this.__.g.cancel_q,
          type: 'warning'
        }).then(() => {
          this.loading = true
          let promises = arr.map((item) => {
            return new Promise((resolve, reject) => {
              let params = {
                deptId: item.deptId,
                token: _this.token
              }
              unlockDept(params).then(data => {
                if (data.errorCode == 200) {
                  resolve()
                } else {
                  reject()
                }
              })
            })
          })
          Promise.all(promises).then(res => {
            _this.getTableData()
            _this.loading = false
            _this.msg('success', _this.__.g.complete_head + res.length + _this.__.g.complete_foot)
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {})
      },
      selectionChange (val) {
        this.multipleSelection = val;
      },
      reder_head(h, {column, $index}){
        let filter_style_s = {
          'position': 'absolute',
          'top': '40px',
          'left': '-18px',
          'right': '-18px',
          'transform-origin': 'center top 0px',
          'z-index': '2001',
          'background-color':'#fff',
          'display':'block'
        };
        let filter_style_n = Object.assign({}, filter_style_s, {'display': 'none'})
        let handleStop = (e) => {
          e.stopPropagation()
        }
        let handleClick=() => {
          this.show_filter = !this.show_filter
          window.obj_vue = this
        }
        let setChecked_lock=(e) => {
          e.preventDefault()
          this.checkList.lock = !this.checkList.lock
        };
        let setChecked_normal=(e) => {
          e.preventDefault()
          this.checkList.normal = !this.checkList.normal
        };
        let handleFilter=(e) => {
          this.pagination.currentPage =1
          this.getTableData()
          this.show_filter=false
        };
        let handleReset = (e) => {
          this.checkList={'normal':true,'lock':true}
          this.pagination.currentPage =1
          this.getTableData()
          this.show_filter=false
        };
        return (
          <div style="position:relative; overflow:visible!important;" onClick={handleStop}>
            <span class="el-table__column-filter-trigger">
              {this.i18n.DepartmentList.status}
              <i class={!this.show_filter?'el-icon-arrow-down':'el-icon-arrow-down el-icon-arrow-up'} style="margin-left:6px;" onClick={handleClick}></i>
            </span>
            <div class="el-table-filter" style={!this.show_filter?filter_style_n:filter_style_s}>
              <div class="el-table-filter__content">
                <div class="el-checkbox-group" id="filter_status">
                  <label class="el-checkbox">
                    <span class={!this.checkList.lock?"el-checkbox__input":"el-checkbox__input is-checked"} onClick={setChecked_lock}><span class="el-checkbox__inner"></span><input type="checkbox" class="el-checkbox__original" value={this.i18n.g.Lock} /></span><span class="el-checkbox__label">{this.i18n.g.Lock}</span>
                  </label>
                  <label class="el-checkbox">
                    <span class={!this.checkList.normal?"el-checkbox__input":"el-checkbox__input is-checked"} onClick={setChecked_normal}><span class="el-checkbox__inner"></span><input type="checkbox" class="el-checkbox__original" value={this.i18n.g.normal} /></span><span class="el-checkbox__label">{this.i18n.g.normal}</span>
                  </label>
                </div>
              </div>
              <div class="el-table-filter__bottom"  style="background-color:#fff;">
                <button class={(!this.checkList.lock && !this.checkList.normal)?"is-disabled":""} onClick={handleFilter}>{this.i18n.g.filter}</button>
                <button onClick={handleReset}>{this.i18n.g.reset}</button>
              </div>
            </div>
          </div>
        )
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1
      },
      deptsManaged () {
        let token = this.token
        requestGetDepartManageList({token}).then(data => {
          try {
            this.tree_search = data.result
            //this.parentDeptId = data.result[0].deptId
            this.getTableData()
          } catch(e) { console.log(e) }
        })
      },
      refresh () {
        this.pagination.currentPage = 1
        this.getTableData()
      },
      toggleHelp() {
        this.webHelp.opened = !this.webHelp.opened
      },
    },
    watch: {
      deptFilter(val) {
        if(val == ''){
          this.treeMode = true
        }
      }
    },
    created () {
      if (this.pbAdmin.pb_admin == '0') {
        this.getAddressbook()
      } else {
        this.deptsManaged()
      }
    },
    mounted () {
      let elem = this.$refs.table.$vnode.child.$el.childNodes[2]
      elem.style.maxHeight= (document.body.clientHeight - 250) +'px'
      this.left_list_height=document.body.clientHeight - 200

      window.onresize=() => {
        let elem = this.$refs.table.$vnode.child.$el.childNodes[2]
        elem.style.maxHeight=(document.body.clientHeight - 250)+'px'
        this.left_list_height=document.body.clientHeight - 200
      }
    },
    destroyed() {
      window.onresize = null
    },
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .collapse-icon
    position absolute
    background #20a0ff
    color #fff
    top 360px
    width 20px
    height 60px
    line-height 60px
    border-top-right-radius 4px
    border-bottom-right-radius 4px
    cursor pointer
    font-size 20px
    z-index 30
  div.el-input
    margin-bottom 16px
  #Depart_box
    height 100%
    overflow-x auto
    position relative
    .content_wrapper
      position relative
      width 100%
      height 100%
      background #fff
      border-radius 8px
      overflow-y auto
      overflow-x hidden
    .left_wrapper
      float left
      height 100%
      width 300px
      overflow-y hidden
      overflow-x hidden
      .content_wrapper
        .el-input
          //height是36   需要和下面你的48同步 48-36=12/2=6
          padding 6px 0px
    .right_wrapper
      position absolute
      right 0px
      top 0px
      bottom 0px
      // 想要的是570  但是左边有316  570+316=886
      .content_wrapper
        .btn_wrapper
          min-width 786px
          padding-bottom 6px
          border-bottom 1px solid #cccccc
        .table_wrapper
          margin-top 12px
          min-width 786px
          width 100%
</style>
