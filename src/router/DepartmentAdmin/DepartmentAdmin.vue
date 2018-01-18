<template>
  <div id="DepartAdmin_box">
    <div id="no_allow" v-if="pbAdmin.pb_admin != '0'">
      <div class="content">
        <div class="backBox">
          <a data-v-72b9704a="" onclick="window.history.go(-1)" class="comeback">返回上一步</a>
        </div>
      </div>
    </div>
    <div class="main_wrapper" v-if="pbAdmin.pb_admin == '0'">
      <div class="content_wrapper wrap_shoadow">
        <div class="btn_wrapper">
          <el-button type="primary" @click="dialogIndex=1;deptAdminDialog()" size="small" icon="iconfont iconfont icon-add">{{__.g.add}}</el-button>
          <el-button type="primary" @click="delDeptAdmins" :disabled="deptAdminsSelected.length == 0" size="small" icon="iconfont iconfont icon-shanchu">{{__.g.delete}}</el-button>
          <!--<i class="iconfont icon-icon-question icon-action pull-right" @click="toggleHelp()"></i>-->
          <!--<web-help :show="webHelp.opened" view="department_admin" :onAction="toggleHelp"></web-help>-->
        </div>
        <div class="table_wrapper">
          <el-table
            :data="deptAdmins"
            border
            ref="table"
            style="width: 100%"
            :row-class-name="tableRowClassName"
            @selection-change="selectionChane"
            v-loading="loading">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              :label="__.g.user"
              width="160">
              <template scope="scope">
                <span :title="scope.row.uName" class="text-over" style="display:inline-block;width: 100%;">{{scope.row.uName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="__.mip"
              width="160">
              <template scope="scope">
                <span :title="scope.row.uid" class="text-over" style="display:inline-block;width: 100%;">{{scope.row.uid}}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="__.g.manage_department">
              <template scope="scope">
                <span class="text-over" style="display: inline-block;width: 100%">
                  <template  v-for="(e, i) in scope.row.deptInfo">
                      <span :title="e.fullName">{{e.deptName}}
                        <span  v-show="i<scope.row.deptInfo.length-1">，</span>
                      </span>
                  </template>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="handle_status"
              :label="__.DepartmentList.handle"
              width="160">
              <template scope="scope">
                <el-button size="small" class="el-button--danger" @click="delDeptAdmin(scope.row.uid)">{{__.g.delete}}</el-button>
                <el-button size="small" class="el-button--primary" @click="dialogByEdit(scope.row.uid, scope.row.deptInfo)">{{__.g.edit}}</el-button>
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
            ref="deptPagination"
            :total="pagination.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog :title="dialogIndex == 1 ? __.g.select_user : __.DepartmentList.chooseDept" v-model="showDialog" class="dialogAddMember" @close="closeDialog">
      <div class="input-group" v-show="dialogIndex == 1">
        <span v-show="uNameKeyword" @click="uNameKeyword=''" style="position: absolute; right: 80px; font-size: 20px; cursor: pointer; top: 5px; color: #bfcbd9;z-index: 100">x</span>
        <input type="text" v-model="uNameKeyword" :placeholder="__.g.p_e_mip_a" class="form-control" @keydown.enter="searchUser">
        <span class="input-group-addon btn btn-info" @click="searchUser" :style="{padding:language=='zh'?'6px 22px':'6px 12px'}">{{__.g.search}}</span>
      </div>
      <p v-show="users.length===0 && dialogIndex == 1" style="margin-top: 16px">
        {{__.g.no_data}}
      </p>
      <ul class="userList" v-show="dialogIndex == 1" style="margin-top: 16px">
        <li style="list-style-type: none" :class="{'userActive': e.uid==uid}" v-for="e in users" @click="uid=e.uid">
          <el-radio v-model="uid" :label="e.uid" :title="e.deptName">
            <span><i class="iconfont icon-yonghu"></i>{{e.uName}}</span>
            <br>
            <span style="padding-left: 20px;">{{e.deptName}}</span>
          </el-radio>
        </li>
      </ul>

      <div style="margin-bottom: 8px;" v-show="dialogIndex == 2">
        <span style="display: inline-block;padding: 4px 0px;">{{__.g.selected}}：</span>
        <span v-for="(e, i) in deptManaged" style="background-color: rgb(18, 135, 221); color: rgb(255, 255, 255); display: inline-block; padding: 4px 8px; border-radius: 6px; margin-right:5px">
          {{deptMap[e].deptName}}<span @click="removeDept(i, e)" style="margin-left: 16px; cursor: pointer; display: inline-block;">x</span>
        </span>
      </div>
      <div class="input-group" v-show="dialogIndex == 2">
        <span v-show="deptFilter" @click="deptFilter=''" style="position: absolute; right: 80px; font-size: 20px; cursor: pointer; top: 5px; color: #bfcbd9;z-index: 100">x</span>
        <input type="text" v-model="deptFilter" :placeholder="__.DepartmentList.search_placeholder" class="form-control" @keydown.enter="searchDept">
        <span class="input-group-addon btn btn-info" @click="searchDept"  :style="{padding:language=='zh'?'6px 22px':'6px 12px'}">{{__.g.search}}</span>
      </div>
      <el-tree :data="depts"
               :props="props"
               show-checkbox
               node-key="mid"
               :default-checked-keys = "deptManaged"
               :render-content="renderContent"
               ref="deptTree"
               :load="loadNode"
               lazy
               :filter-node-method="filterNode"
               @check-change="checkChange"
               :check-strictly="true"
               v-show="dialogIndex == 2 && treeMode"
               style="margin-top: 16px; height: 220px; max-height: 300px;overflow: auto;"></el-tree>
      <el-checkbox-group v-show="dialogIndex == 2 && !treeMode" v-model="deptSelected" style="margin-top: 16px;height: 220px; max-height: 300px;overflow-y: auto;overflow-x: hidden;border: 1px solid #d1dbe5">
        <span v-show="searchResult.length==0">
          {{__.g.no_data}}
        </span>
        <el-checkbox @change="checkedChange" v-for="e in searchResult" :label="e" style="width: 100%; overflow: hidden; font-size: 14px; cursor: pointer;margin-left:15px">
          <i class="iconfont icon-fangzi" style="color: rgb(16, 148, 16); margin: 0px 3px;"></i>
          <span :title="e.deptName">{{e.deptName}}</span>
          <br>
          <span :title="e.parentName" class="text-over" style="display:inline-block;width:100%;padding-left:20px">{{e.parentName}}</span>
        </el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button v-show="dialogIndex == 1" @click="next" type="primary">{{__.g.next_step}}</el-button>
        <el-button v-show="dialogIndex == 2" @click="addDeptManager" type="primary">{{__.g.sure_q}}</el-button>
        <el-button v-show="dialogIndex == 2 && !editMode" @click="dialogIndex = 1">{{__.g.backward}}</el-button>
        <el-button @click="closeDialog">{{__.g.cancel_q}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapActions} from 'vuex'
  import lang from 'src/lang.json'
  import {requestSearchUser, requestGetAddressbook_nouser, addDeptAdmin, getDeptAdmins, delDeptAdmin, updateDeptAdmin, requestDeptSearchManage} from 'common/api/api'
  import WebHelp from 'src/components/WebHelp.vue'

  export default {
    components:{
      WebHelp,
    },
    data(){
      return ({
        'deptAdmins':[],
        showDialog: false,
        dialogIndex: 1,
        uNameKeyword: '',
        users: [],
        uid: '',
        treeMode: true,
        deptSelected: [],
        deptFilter: '',
        depts: [],
        deptManaged: [],
        deptMap: {},
        props: {
          children: 'children',
          label: 'mName',
          isLeaf: 'isLeaf'
        },
        pagination: {
          currentPage: 1,
          pageSize: 20,
          total: 20
        },
        deptAdminsSelected: [],
        loading: false,
        editMode: false,
        searchResult: [],
        webHelp: {
          opened: false
        },
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
      },
      pbAdmin () {
        return JSON.parse(window.localStorage.getItem('pbAdmin'))
      },
      token () {
        return JSON.parse(window.localStorage.getItem('loginInfo')).token
      }
    },
    methods: {
      getDeptAdmins () {
        let params = {
          index: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          token: this.token
        }
        getDeptAdmins(params).then(data => {
          try {
            /*if (data.result.length == 0 && this.pagination.currentPage > 1) {
              this.pagination.currentPage = this.pagination.currentPage - 1
              this.msg('warning', this.__.g.no_more_data)
              return
            }*/
            this.deptAdmins = data.result
            this.pagination.total = parseInt(data.total, 10)
          } catch (e) { console.log(e) }
        })
      },
      sizeChange (val) {
        this.pagination.pageSize = val
        this.getDeptAdmins()
      },
      currentChange (val) {
        if (val != this.pagination) {
          this.pagination.currentPage = val
          this.getDeptAdmins()
        }
      },
      selectionChane (val) {
        this.deptAdminsSelected = val
      },
      delDeptAdmin (id) {
        var _this = this
        this.$confirm(this.__.DepartmentList.delWarning, this.__.g.warning, {
          confirmButtonText:this.__.g.sure_q,
          cancelButtonText:this.__.g.cancel_q,
          type: 'warning'
        }).then(() => {
          let params = {
            account: id,
            token: this.token
          }
          delDeptAdmin(params).then(() => {
            this.getDeptAdmins()
            _this.msg('success', _this.__.g.handle_success)
          })
        }).catch(() => {})
      },
      delDeptAdmins () {
        let _this = this
        this.$confirm(this.__.DepartmentList.delWarning, this.__.g.warning, {
          confirmButtonText:this.__.g.sure_q,
          cancelButtonText:this.__.g.cancel_q,
          type: 'warning'
        }).then(() => {
          this.loading = true
          let promises = this.deptAdminsSelected.map((e) => {
            return new Promise((resolve, reject) => {
              let  params = {
                account: e.uid,
                token: _this.token
              }
              delDeptAdmin(params).then(data => {
                if (data.errorCode == "200") {
                  resolve()
                } else {
                  reject()
                }
              })
            })
          })
          Promise.all(promises).then((res) => {
            this.loading = false
            _this.getDeptAdmins()
            _this.msg('success', _this.__.g.complete_head + res.length + _this.__.g.complete_foot)
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {})
      },
      tableRowClassName(row, index) {
        if (index%2 === 1) {
          return 'info-row';
        } else if (index%2 === 0) {
          return 'positive-row';
        }
        return '';
      },
      deptAdminDialog () {
        this.showDialog = true
        this.getDepts()
      },
      searchUser () {
        let _this = this
        if (this.uNameKeyword == '') {
          _this.msg('warning', _this.__.GroupPermission.p_e_u_s_f)
          return
        }

        let params = {
          uName: this.uNameKeyword,
          token: this.token
        }
        requestSearchUser(params).then(data => {
          _this.users = data.result
        })
      },
      next () {
        if (this.uid == '') {
          this.msg('warning', this.__.GroupManage.s_user_f)
          return
        }
        this.dialogIndex = 2
      },
      searchDept () {
        var _this =  this
        //this.$refs.deptTree.filter(this.deptFilter)
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
            this.searchResult = data.result
            this.deptSelected = this.searchResult.filter(function (val) {
              return _this.deptManaged.indexOf(val.deptId) > -1
            })
          }
        })
      },
      getDepts () {
        let params = {
          deptId: '',
          token: this.token
        }
        requestGetAddressbook_nouser(params).then(data => {
          this.depts = data.result
        });
      },
      renderContent(h, { node, data, store }) {
        let span_manage={
          'font-size':'12px',
          'color':'#000'
        }

        return (
          <span style="span_manage">
          <i class="iconfont icon-fangzi" style="color:#109410;margin:0px 3px;"></i>
          {node.label}
          </span>
        )
      },
      loadNode (node, resolve) {
        let params = {
          deptId: node.data.mid,
          token: JSON.parse(window.localStorage.getItem('loginInfo')).token
        }
        if (node.data.mTag===2){
          requestGetAddressbook_nouser(params).then(data => {
            resolve(data.result)
          })
        } else {
          resolve([])
        }
      },
      filterNode(value, data) {
        if (!value) return true
        return data.mName.indexOf(value) != -1;
      },
      addDeptManager () {
        let params = {
          account: this.uid,
          deptList: [],
          token: this.token
        }
        /*if (this.treeMode) {
          params.deptList = this.$refs.deptTree.getCheckedNodes().map(function (val) {
            return {
              deptId: val.mid,
              deptName: val.mName
            }
          })
        } else {
          params.deptList = this.deptSelected
        }*/
        params.deptList = Object.values(this.deptMap)
        if (params.deptList.length == 0) {
          this.msg('warning', this.__.DepartmentList.chooseDept + '!')
          return
        }
        if (params.deptList.length > 20) {
          this.msg('warning', this.__.DepartmentList.deptLimit)
          return
        }
        if (!this.editMode) {
          addDeptAdmin(params).then(() => {
            this.getDeptAdmins()
            this.dialogInit()
            this.msg('success', this.__.g.saved)
          })
        } else {
          updateDeptAdmin(params).then(() => {
            this.getDeptAdmins()
            this.dialogInit()
            this.msg('success', this.__.g.saved)
          })
        }
      },
      dialogByEdit (id, deptInfo) {
        this.deptManaged = deptInfo.map((val) => {
          this.deptMap[val.deptId] = {
            deptId: val.deptId,
            deptName: val.deptName
          }
          return val.deptId
        })
        this.dialogIndex = 2
        this.uid = id
        this.editMode = true
        this.deptAdminDialog()
      },
      dialogInit () {
        this.showDialog = false
        this.dialogIndex = 1
        this.uNameKeyword = ''
        this.uid = ''
        this.users = []
        this.deptFilter = ''
        this.treeMode = true
        this.deptSelected = []
        this.deptManaged = []
        this.deptMap = {}
        this.depts = []
      },
      closeDialog () {
        this.showDialog = false
        setTimeout(() => {
          this.dialogInit()
        }, 500)
      },
      removeDept (index, e) {
        try {
          this.deptManaged.splice(index, 1)
          delete this.deptMap[e]
          let i
          for (let d of this.deptSelected) {
            if (d.deptId == e) {
              i = this.deptSelected.indexOf(d)
            }
          }
          this.deptSelected.splice(i, 1)
          this.$refs.deptTree.setCheckedKeys(this.deptManaged)
        } catch (e) { console.log(e) }
      },
      checkChange (data, checked, indeterminate) {
        try {
          if (!checked) {
            if (this.deptManaged.includes(data.mid)) {
              let index = this.deptManaged.indexOf(data.mid)
              this.deptManaged.splice(index, 1)
              delete this.deptMap[data.mid]
            }
          } else {
            this.deptManaged.push(data.mid)
            this.deptMap[data.mid] = {
              deptId: data.mid,
              deptName: data.mName
            }
          }
        } catch (e) { console.log(e) }
      },
      checkedChange (event) {
        let value = event.target._value
        try {
          if (!event.target.checked && this.deptManaged.includes(value.deptId)) {
            let index = this.deptManaged.indexOf(value.deptId)
            this.deptManaged.splice(index, 1)
            delete this.deptMap[value.deptId]
          } else {
            this.deptManaged.push(value.deptId)
            this.deptMap[value.deptId] = {
              deptId: value.deptId,
              deptName: value.deptName
            }
          }
        } catch (e) { console.log(e) }
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
      this.getDeptAdmins()
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
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  #DepartAdmin_box
    height 100%
    overflow-x auto
    overflow-y hidden
    .main_wrapper
      width 100%
      height 100%
      min-width 886px
      .content_wrapper
        position relative
        width 100%
        height 100%
        background #fff
        border-radius 8px
        overflow-y auto
        overflow-x hidden
        .btn_wrapper
          padding-bottom 6px
          border-bottom 1px solid #cccccc
        .table_wrapper
          margin-top 12px
          width 100%
  .userList
    overflow-y auto
    overflow-x hidden
    height 220px
    li
      border-bottom: 1px solid #e5e5e5
      padding-bottom 8px
      &:hover span, &.userActive span
        color #20a0ff
      span
        display inline-block
        width 520px
        white-space nowrap
        text-overflow ellipsis
        word-break break-all
        overflow hidden
</style>
