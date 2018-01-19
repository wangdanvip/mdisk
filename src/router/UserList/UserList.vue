<template>
  <div id="UserList_box" style="position: relative;">
    <!--<div id="no_allow" v-if="!isDeptAdmin">
      <div class="content">
        <div class="backBox">
          <a data-v-72b9704a="" onclick="window.history.go(-1)" class="comeback">{{i18n.g.backward}}</a>
        </div>
      </div>
    </div>-->
    <div style="position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px;">
      <!--<div id="op_iconbg" :style="op_iconbg_css" style="z-index: 30" @click="search_toggle">
        <i class="iconfont icon-formatindentincrease"></i>
      </div>-->
      <div class="left_wrapper clearFix" :style="{'width':search_w+'px'}">
        <div class="content_wrapper wrap_shoadow">
          <!--部门管理员看到的搜索部门框-->
          <!--<div class="el-input" v-if="this.pbAdmin.pb_admin!=='0'">
            <i class="el-input__icon el-icon-search" style="cursor: pointer;"></i>
            <span v-if="filterText" @click="clearFilterText" style="position: absolute; right: 30px; font-size: 20px; cursor: pointer; top: 8px; color: #bfcbd9;">x</span>
            <input type="text" :placeholder="__.DepartmentList.search_placeholder" autocomplete="off" class="el-input__inner" v-model="filterText">
          </div>-->

          <!--超级管理员看到的搜索部门框-->
          <!--<div class="el-input" v-if="this.pbAdmin.pb_admin==='0'">-->
          <div class="el-input">
            <i class="el-input__icon el-icon-search" style="cursor: pointer;" @click="submitSearchDept"></i>
            <span v-if="filterText_admin" @click="clearFilterText_admin" style="position: absolute; right: 30px; font-size: 20px; cursor: pointer; top: 8px; color: #bfcbd9;">x</span>
            <input @keydown.enter="submitSearchDept" type="text" :placeholder="__.DepartmentList.search_placeholder" autocomplete="off" class="el-input__inner" v-model="filterText_admin">
          </div>

          <div :style="{'overflow':'auto'}">
            <!--超级管理员看到的树节点-->
            <div>
              <el-tree :data="tree_search"
                       v-if="pbAdmin.pb_admin==='0'"
                       v-show="search_depts_admin_ing===false"
                       :empty-text="__.g.loading"
                       ref="userList_left_tree_admin"
                       id="userList_left_tree"
                       @node-click="left_tree_nc_admin"
                       :check-strictly="true"
                       :expand-on-click-node="false"
                       node-key="mid"
                       :props="tree_defaultProps_admin"
                       :render-content="renderContent_admin"
                       :load="loadNode"
                       lazy
                       highlight-current
                       :style="{'overflow-y':'auto','height':left_list_height+'px'}">
              </el-tree>
            </div>
            <div v-if="search_depts_admin_ing===true" :style="{height:left_list_height+'px',overflow:'auto','min-height':'40px'}">
              <div v-if="search_depts_admin.length===0">
                {{__.g.no_data}}
              </div>
              <div v-for="item in search_depts_admin" v-if="search_depts_admin.length!==0" @click="setDept(item.deptName,item.deptId)" style="width: 220px; overflow: hidden; font-size: 14px; cursor: pointer;">
                <i class="iconfont icon-fangzi" style="color: rgb(16, 148, 16); margin: 0px 6px;"></i>
                <span :title="item.deptName" :style="item.deptId===deptId?{'color':'#cf6216'}:{}">{{item.deptName}}</span>
                <span :title="item.parentName" :style="item.deptId==deptId?{'color':'#cf6216'}:{}" class="text-over" style="display:inline-block;width:100%">{{item.parentName}}</span>
              </div>
            </div>

            <!--普通部门管理员看到的树节点-->
            <el-tree :data="tree_search"
                     v-if="pbAdmin.pb_admin!=='0'"
                     v-show="search_depts_admin_ing===false"
                     :filter-node-method="filterNode"
                     :empty-text="__.g.loading"
                     ref="userList_left_tree"
                     id="userList_left_tree"
                     @node-click="left_tree_nc"
                     :check-strictly="true"
                     :default-expand-all="true"
                     node-key="deptId"
                     :props="tree_defaultProps"
                     :render-content="renderContent"
                     highlight-current
                     :style="{height:left_list_height+'px',overflow:'auto','min-height':'40px'}">
            </el-tree>
          </div>
        </div>
      </div>
      <div class="right_wrapper" :style="!search_is_hidden?{'left':'296px'}:{'left':'26px'}">
        <div class="content_wrapper wrap_shoadow">
          <div class="btn_wrapper">
            <el-button type="primary" size="small" icon="iconfont iconfont icon-iconfontsuoding" @click="setLockusers">{{__.CasualUser.lock_user}}</el-button>
            <el-button type="primary" size="small" icon="iconfont iconfont icon-jiesuo" @click="setUnlockusers">{{__.CasualUser.unlock_user}}</el-button>
            <el-button type="primary" size="small" icon="iconfont iconfont icon-shuaxin" @click="submitRefresh">{{__.g.refresh}}</el-button>
            <div class="el-input el-input--small" style="display: inline-block; width: 300px; float: right; position: relative;">
              <i class="el-input__icon el-icon-search" style="cursor: pointer" @click="submitDeptSearchUser"></i>
              <div v-if="searchName!==''" style="position: absolute; right: 30px; top: 2px; font-size: 20px; color:#bfcbd9; cursor: pointer;" @click="clearSearchName">
                x
              </div>
              <input type="text" :placeholder="__.UserList.search_user_place" autocomplete="off" class="el-input__inner" v-model="searchName" @keydown.enter="submitDeptSearchUser"/>
            </div>
          </div>
          <div class="table_wrapper">
            <!--暂时去掉表格loading效果
              v-loading="loading_for_UserList"-->
            <el-table
              ref="groupTable"
              @selection-change="handleSelectionChange"
              :data="tableUserListState"
              border
              style="width: 100%;overflow: visible;"
              :row-class-name="tableRowClassName">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="uName"
                :label="__.UserList.user_name"
                width="160">
                <template scope="scope">
                  <span :title="scope.row.uName" class="text-over" style="display:inline-block;width: 100%;">{{scope.row.uName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="uid"
                :label="__.UserList.login_name"
                width="160">
                <template scope="scope">
                  <span :title="scope.row.uid" class="text-over" style="display:inline-block;width: 100%;">{{scope.row.uid}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="capacity"
                :label="__.UserList.capacity"
                width="100">
                <template scope="scope">
                  <span :title="scope.row.capacity" class="text-over" style="display:inline-block;width: 100%;">{{scope.row.capacity !=='/' ?scope.row.capacity%1024 ? `${scope.row.capacity}G` : `${scope.row.capacity/1024}T` : scope.row.capacity}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="deptName"
                :label="__.DepartmentList.belongs_to_depart">
                <template scope="scope">
                  <span :title="scope.row.deptName | replace_deptName" class="text-over" style="display:inline-block;width: 100%;">{{scope.row.deptName | replace_deptName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :render-header="reder_head"
                :label="__.DepartmentList.status"
                width="105">
                <template scope="scope">
                  {{scope.row.isLock===0?__.g.normal:__.g.Lock}}
                </template>
              </el-table-column>
              <el-table-column
                :label="__.DepartmentList.handle"
                :width="language=='en'?200:140">
                <template scope="scope">
                  <el-button size="small" class="el-button--danger" v-if="scope.row.isLock===0" @click="setUserLock(scope.row.uid,scope.row.deptId)" :style="{width: language=='en'?'68px':''}">{{__.g.Lock}}</el-button>
                  <el-button size="small" class="el-button--primary" v-if="scope.row.isLock===1" @click="setUserUnlock(scope.row.uid,scope.row.deptId)" :style="{width: language=='en'?'68px':''}">{{__.g.Unlock}}</el-button>
                  <el-button size="small" class="el-button--primary" v-if="scope.row.capacity !=='/' && pbAdmin.pb_admin==='0'" @click="change_capacity_show(scope.row.uName,scope.row.uid,scope.row.capacity)" :style="{width: language=='en'?'75px':''}">{{__.g.change_capacity}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div>
              <div class="block" style="margin-top: 12px; text-align: right;margin-right: 36px;">
                <el-pagination
                  @current-change="right_main_handleCurrentChange"
                  :current-page="right_main_currentPage1"
                  :page-size="right_main_page_size"
                  layout="total, prev, pager, next"
                  :total="right_main_total">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>

      <el-dialog :title="__.personal_storage_management" :visible.sync="dialogFormVisible">
        <el-row type="flex" justify="space-between" style="margin-bottom:20px">
          <el-col :span="12">{{__.UserList.user_name}} : {{form.name}}</el-col>
          <el-col :span="12">{{__.mip}} : {{form.mip}}</el-col>
        </el-row>
        <el-form :model="form">
          <el-form-item :label="__.personal_capacity">
            <el-input-number v-model="form.personal_capacity" :min="1"></el-input-number>
            <el-select v-model="form.unit" style="width:60px">
              <el-option label="G" value="G"></el-option>
              <el-option label="T" value="T"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{__.cancel}}</el-button>
          <el-button type="primary" @click="changeCapacitySave">{{__.g.save}}</el-button>
        </div>
      </el-dialog>
    </div>>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapActions} from 'vuex'
  import lang from 'src/lang.json'
  import {requestGetDepartManageList,requestGetUserList,requestGetUserListInit,requestUserLock,requestUserUnlock,requestDeptSearchUser,requestGetAddressbook_nouser,requestDeptSearchManage,requestCasualLock ,changeCapacity} from 'common/api/api';

  export default {
    data(){
      return ({
        'node_list': [],
        'search_depts_admin_ing':false,
        'search_depts_admin':[],
        'data_model':'all',
        'searchName':'',
        'searchNameResult':[],
        'multipleSelection':[],
        'filterText':'',
        'filterText_admin':'',
        'loading_for_UserList':true,
        'deptId':'',
        'submitCheckList':{'normal':true,'lock':true},
        'checkList':{'normal':true,'lock':true},
        'show_filter':false,
        'left_list_height':400,
        'left_tree_selected':{'deptName':'所有管理的部门'},
        'search_is_hidden':false,
        'op_iconbg_op':{
          'left':'270px'
        },
        'op_iconbg_cl':{
          'left':'0px'
        },
        'tree_search':[],
        'tree_defaultProps': {
          children: 'children',
          label: 'deptName'
        },
        'tree_defaultProps_admin':{
          children:'children',
          label:'mName',
          isLeaf: 'isLeaf'
        },
        'tableUserListAll':[],
        'right_main_currentPage1':1,
        'right_main_page_size':20,
        'right_main_total': 20,
        form:{
          personal_capacity:1,
          unit:'G',
          name:'',
          mip:''
        },
        dialogFormVisible:false
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
      'left_tree_height'(){
        return document.body.clientHeight-250;
      },
      'tableUserListState'(){
        let arr=[];
        if(this.data_model === 'all'){
          arr=this.tableUserListAll;
        }else{
          arr=this.searchNameResult;
          if(this.submitCheckList.normal===false){
            arr=arr.filter((item) => {
              return item.isLock===1;
            })
          }
          if(this.submitCheckList.lock===false){
            arr=arr.filter((item) => {
              return item.isLock===0;
            })
          }
          this.right_main_total = arr.length
        }

        if (this.data_model != 'all') {
          arr = arr.slice((this.right_main_currentPage1 - 1) * this.right_main_page_size,
            this.right_main_currentPage1 * this.right_main_page_size)
        }

        return arr;
      },
      'pbAdmin'(){
        let pbAdmin = JSON.parse(window.localStorage.getItem('pbAdmin'));
        return pbAdmin;
      },
      'token'(){
        let token = JSON.parse(window.localStorage.getItem('loginInfo')).token;
        return token;
      },
      'isDeptAdmin'(){
        let loginInfo = JSON.parse(window.localStorage.getItem('loginInfo'));
        let pbAdmin = JSON.parse(window.localStorage.getItem('pbAdmin'));
        if(loginInfo.isDeptAdmin === '1' || pbAdmin.pb_admin === '0'){
          return true;
        }else{
          return false
        }
      },
      'op_iconbg_css'(){
        return !this.search_is_hidden?this.op_iconbg_op:this.op_iconbg_cl;
      }
    },
    methods: {
      'setDept'(deptName,depId){
        this.right_main_currentPage1 = 1
        this.left_tree_selected.mName=deptName;
        this.left_tree_selected.mid=depId;
        this.deptId=depId;
        this.checkList = {
          normal: true,
          lock: true
        }
        this.submitCheckList={'normal':true,'lock':true};
        this.loading_for_UserList=true;
        this.getUserList(depId);
        this.data_model='all';
        this.searchName='';
      },
      'submitSearchDept'(){
        let f_admin=this.filterText_admin.replace(/(^\s*)|(\s*$)/g,"");
        if(f_admin===''){
          this.search_depts_admin_ing=false;
          return ;
        }
        this.search_depts_admin_ing=true;
        let token = this.token;
        let deptName = f_admin;
        requestDeptSearchManage({deptName,token}).then(data => {
          if(data.errorCode === "200"){
          this.search_depts_admin=data.result;
        }else{
          throw "错误定位：用户列表_超级管理员搜索部门   errorCode:" + data.errorCode
        }
      })
      },
      loadNode(node, resolve) {
        let that=this;
        if(node.level!==0){
          let Params={'deptId':node.data.mid,token:this.token};
          if(node.data.mTag===2){
            requestGetAddressbook_nouser(Params).then(data => {
                if(data.errorCode === "200"){
                  resolve(data.result);
                }else{
                  throw "错误定位：用户列表_加载树节点   errorCode:" + data.errorCode
                }
                return ;
            })
          }else{
            resolve([]);
            return ;
          }
          return ;
        }
        resolve(this.tree_search);
      },
      clearSearchName(){
        this.searchName='';
        this.data_model='all';
        this.right_main_currentPage1 = 1
        this.getUserList(this.deptId)
      },
      submitDeptSearchUser(){
        let uName=this.searchName.replace(/(^\s*)|(\s*$)/g,"");
        if(uName===''){
          this.data_model='all';
          this.getUserList(this.deptId)
          return ;
        }
        let deptId=this.deptId;
        let token=this.token;
        let Params={uName,deptId,token};
        requestDeptSearchUser(Params).then((data) => {
          if(data.errorCode === "200"){
            this.searchNameResult = data.result
            this.right_main_total = data.result.length
            this.right_main_currentPage1 = 1
            this.data_model='name';
            this.loading_for_UserList=false;
          }else{
            throw "错误定位：用户列表_所搜管理部门下的某个用户   errorCode:"+data.errorCode
          }
        });
      },
      clearFilterText(){
        this.filterText='';
      },
      clearFilterText_admin(){
        this.filterText_admin='';
      },
      find_deptId(item){
        let that = this;
        if (item.children.length === 0){
          return;
        }
        item.children.forEach((obj) => {
          this.node_list.push(obj.deptId);
          that.find_deptId(obj);
        });
      },
      exit_arr(obj,arr){
        for(let i=0,len=arr.length;i<len;i++){
          if(arr[i] === obj){
            return true;
          }
        }
        return false;
      },
      filterNode(value, data) {
        let that = this;
        if(!value) return true;
        if(this.pbAdmin.pb_admin!=='0'){
          if(that.exit_arr(data.deptId,that.node_list)){
            return true;
          }else{
            if(data.deptName.indexOf(value) === -1){
              return false;
            }else{
              that.find_deptId(data);
              return true;
            }
          }
        }
      },
      submitRefresh(){
        this.loading_for_UserList=true;
        this.show_filter=false;
        if (this.searchName == '') {
          this.data_model = 'all'
          this.right_main_currentPage1 = 1
          setTimeout(() => {
            this.getUserList(this.deptId);
          },500);
        } else {
          setTimeout(() => {
            this.submitDeptSearchUser()
          },500);
        }
      },
      handleSelectionChange(val){
        this.multipleSelection=val;
      },
      setUnlockusers(){
        let that=this;
        let arr=[];
        arr=this.multipleSelection.filter((item) => {
          return item.isLock===1;
        });
        if(arr.length===0){
          that.msg('warning', that.__.UserList.s_one_lock)
          return ;
        }
        this.$confirm(this.__.g.is_sure_confirm, this.__.g.warning, {
          confirmButtonText:this.__.g.sure_q,
          cancelButtonText:this.__.g.cancel_q,
          type: 'warning'
        }).then(() => {
          this.loading_for_UserList=true;
          let promises = arr.map((item) => {
            return new Promise((resolve,reject) => {
              let Params = {'account':item.uid,'deptId':item.deptId,'token':that.token};
              requestUserUnlock(Params).then(data => {
                if(data.errorCode === "200"){
                  resolve('0');
                }else{
                  reject('1');
                  throw "错误定位：用户列表_批量锁定用户   errorCode:"+data.errorCode+" 锁定失败账号："+item.uid;
                }
              });
            })
          });
          Promise.all(promises).then(function(res){
            if(that.data_model != 'name'){
              that.getUserList(that.deptId);
            } else {
              that.submitDeptSearchUser();
            }
            that.msg('success', that.__.g.complete_head+res.length+that.__.g.complete_foot)
          }).catch(() => {
            this.loading_for_UserList = false
          })
        }).catch(() => {
        });
      },
      setLockusers(){
        let that=this;
        let arr=[];
        arr=this.multipleSelection.filter((item) => {
          return item.isLock===0;
        });
        if(arr.length===0){
          that.msg('warning', that.__.UserList.s_one_normal)
          return ;
        }
        this.$confirm(this.__.g.is_sure_confirm, this.__.g.warning, {
          confirmButtonText:this.__.g.sure_q,
          cancelButtonText:this.__.g.cancel_q,
          type: 'warning'
        }).then(() => {
          this.loading_for_UserList=true;
          let promises = arr.map((item) => {
            return new Promise((resolve,reject) => {
              let Params = {'account':item.uid,'deptId':item.deptId,'token':that.token};
              requestUserLock(Params).then(data => {
                if(data.errorCode === "200"){
                  resolve('0');
                }else{
                  reject('1');
                  throw "错误定位：用户列表_批量锁定用户   errorCode:"+data.errorCode+" 锁定失败账号："+item.uid;
                }
              });
            })
          });
          Promise.all(promises).then(function(res){
            if(that.data_model != 'name'){
              that.getUserList(that.deptId);
            } else {
              that.submitDeptSearchUser();
            }
            that.msg('success', that.__.g.complete_head+res.length+that.__.g.complete_foot)
          }).catch(() => {
            this.loading_for_UserList = false
          })
        }).catch(() => {
        });
      },
      setUserUnlock(account,deptId){
        let that = this;
        this.$confirm(this.__.g.is_sure_confirm, this.__.g.warning, {
          confirmButtonText:this.__.g.sure_q,
          cancelButtonText:this.__.g.cancel_q,
          type: 'warning'
        }).then(() => {
          this.loading_for_UserList=true;
          let token = this.token;
          let Params = {account,deptId,token};
          requestUserUnlock(Params).then(data => {
            if(data.errorCode === "200"){
              setTimeout(function(){
                if(that.data_model != 'name'){
                  that.getUserList(that.deptId);
                } else {
                  that.submitDeptSearchUser();
                }
                that.msg('success', that.__.UserList.unlock_user_s)
              },500);
            }else{
              this.loading_for_UserList = false
              throw "错误定位：用户列表_解锁用户   errorCode:"+data.errorCode+" 解锁失败账号："+account;
            }
          });
        }).catch(() => {
        });
      },
      setUserLock(account,deptId){
        let that = this;
        this.$confirm(this.__.g.is_sure_confirm, this.__.g.warning, {
          confirmButtonText:this.__.g.sure_q,
          cancelButtonText:this.__.g.cancel_q,
          type: 'warning'
        }).then(() => {
          this.loading_for_UserList=true;
          let token = this.token;
          let Params = {account,deptId,token};
          requestUserLock(Params).then(data => {
            if(data.errorCode === "200"){
              setTimeout(function(){
                if(that.data_model != 'name'){
                  that.getUserList(that.deptId);
                } else {
                  that.submitDeptSearchUser();
                }
                that.msg('success', that.__.UserList.lock_user_s)
              },500);
            }else{
              this.loading_for_UserList=false;
              throw "错误定位：用户列表_锁定用户   errorCode:"+data.errorCode+" 锁定失败账号："+account;
            }
          });
        }).catch(() => {
        });
      },
      change_capacity_show(uname,uid,capacity){
        this.form.name = uname;
        this.form.mip = uid;
        this.form.personal_capacity = capacity % 1024 ? capacity : capacity/1024;
        this.form.unit = capacity % 1024 ? 'G' : 'T';
        this.dialogFormVisible = true;
      },
      changeCapacitySave(){
        let params = {
          uid:this.form.mip,
          capacity:this.form.unit === 'G' ? this.form.personal_capacity : this.form.personal_capacity * 1024,
          token:this.token
        };
        changeCapacity(params).then(res => {
          console.log(res);
          if(this.data_model != 'name'){
            this.getUserList(this.deptId);
          } else {
            this.submitDeptSearchUser();
          }
          this.msg('success', this.__.UserList.expansion_success)
        })
        this.dialogFormVisible = false;
      },
      reder_head(h, {column, $index}){
        let __=this.__;
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
        let filter_style_n = Object.assign({}, filter_style_s, {'display': 'none'});
        let show_filter = this.show_filter;
        let handleStop = (e) => {
          e.stopPropagation();
        }
        let handleClick=() => {
          this.show_filter=!this.show_filter;
          show_filter = this.show_filter;
          window.obj_vue=this;
        };
        let checkList=this.checkList;
        let setChecked_lock=(e) => {
          e.preventDefault();
          this.checkList.lock=!this.checkList.lock;
        };
        let setChecked_normal=(e) => {
          e.preventDefault();
          this.checkList.normal=!this.checkList.normal;
        };
        let handleFilter=(e) => {
          /*此处筛选逻辑为：list接口利用接口筛选能力，请求接口。
          搜索接口此处根据checkList构造submitCheckList,触发
          计算属性tableUserListState，避免实时更新行为不一致*/
          this.right_main_currentPage1 = 1
          if(checkList.lock || checkList.normal){
            let result = {};
            for(let key in this.checkList){
              result[key] = this.checkList[key];
            }
            this.submitCheckList = result;
          }
          if (this.searchName != '') {
          } else {
            this.data_model = 'all'
            this.getUserList(this.deptId)
          }
          this.show_filter=false;
        };
        let handleReset = (e) => {
          this.right_main_currentPage1 = 1
          this.checkList={'normal':true,'lock':true};
          this.submitCheckList = {'normal':true,'lock':true};
          if (this.searchName == '') {
            this.data_model = 'all'
            this.getUserList(this.deptId)
          }
          this.show_filter=false;
        };
        return (
          <div style="position:relative; overflow:visible!important;" onClick={handleStop}>
            <span class="el-table__column-filter-trigger">
              {__.DepartmentList.status}
              <i class={!show_filter?'el-icon-arrow-down':'el-icon-arrow-down el-icon-arrow-up'} style="margin-left:6px;" onClick={handleClick}></i>
            </span>
            <div class="el-table-filter" style={!show_filter?filter_style_n:filter_style_s}>
              <div class="el-table-filter__content">
                  <div class="el-checkbox-group" id="filter_status">
                    <label class="el-checkbox">
                      <span class={!checkList.lock?"el-checkbox__input":"el-checkbox__input is-checked"} onClick={setChecked_lock}><span class="el-checkbox__inner"></span><input type="checkbox" class="el-checkbox__original" value={__.g.Lock} /></span><span class="el-checkbox__label">{__.g.Lock}</span>
                    </label>
                    <label class="el-checkbox">
                      <span class={!checkList.normal?"el-checkbox__input":"el-checkbox__input is-checked"} onClick={setChecked_normal}><span class="el-checkbox__inner"></span><input type="checkbox" class="el-checkbox__original" value={__.g.normal} /></span><span class="el-checkbox__label">{__.g.normal}</span>
                    </label>
                  </div>
              </div>
              <div class="el-table-filter__bottom"  style="background-color:#fff;">
                <button class={(!checkList.lock && !checkList.normal)?"is-disabled":""} onClick={handleFilter}>{this.i18n.g.filter}</button>
                <button onClick={handleReset}>{this.i18n.g.reset}</button>
              </div>
            </div>
          </div>
        )
      },
      right_main_handleCurrentChange(val){
        if (val != this.right_main_currentPage1) {
          this.$refs.groupTable.$vnode.child.$el.childNodes[2].scrollTop = 0
          this.right_main_currentPage1 = val
          if (this.data_model == 'all') {
            this.getUserList(this.deptId)
          }
        }
      },
      left_tree_nc_admin(data,node,self){
        if(data.mTag===2){
          if(this.left_tree_selected!==data){
            this.right_main_currentPage1 = 1
            this.left_tree_selected=data;
            this.deptId=data.mid;
            this.checkList = {
              normal: true,
              lock: true
            }
            this.submitCheckList={'normal':true,'lock':true};
            this.loading_for_UserList=true;
            this.right_main_currentPage1 = 1
            this.getUserList(data.mid);
            this.data_model='all';
            this.searchName='';
          }
        }
      },
      left_tree_nc(data,node,self){
        if(data.isManage==='1'){
          if(this.left_tree_selected!==data){
            this.right_main_currentPage1 = 1
            let deptId=data.deptId;
            this.left_tree_selected=data;
            this.checkList = {
              normal: true,
              lock: true
            }
            this.submitCheckList={'normal':true,'lock':true};
            this.deptId=data.deptId;
            this.loading_for_UserList=true;
            this.getUserList(data.deptId);
            this.data_model='all';
            this.searchName='';

            //所管理的部门点击节点查询通讯录
            if (this.pbAdmin.pb_admin != '0' && !this.search_depts_admin_ing) {
              let params = {
                deptId: this.deptId,
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
          }
        }
      },
      renderContent_admin(h, { node, data, store }) {
        let span_manage={
          'font-size':'12px',
          'color':'#000'
        };
        let span_no_manage={
          'font-size':'12px',
          'color':'rgba(0,0,0,0.3)'
        };
        return (
          <span style={data.isManage==='0'?span_no_manage:span_manage} title={node.label}>
          {data.mTag===2
            ?<i class="iconfont icon-fangzi" style="color:#109410;margin:0px 3px;"></i>
            :<i class="iconfont icon-yonghu" style="color:#094caf;margin:0px 3px;"></i>}
            {node.label}
          </span>
        );
      },
      renderContent(h, { node, data, store }) {
        let span_manage={
          'font-size':'12px',
          'color':'#000'
        };
        let span_no_manage={
          'font-size':'12px',
          'color':'rgba(0,0,0,0.3)'
        };
        return (
          <span style={data.isManage==='0'?span_no_manage:span_manage} title={node.label}>
            <i class="iconfont icon-fangzi" style="color:#109410;margin:0px 3px;"></i>
            {node.label}
          </span>
        )
      },
      search_toggle(){
        this.search_is_hidden=!this.search_is_hidden;
        this.search_is_hidden?this.$store.dispatch('set_search_w_min'):this.$store.dispatch('set_search_w_max');
      },
      tableRowClassName(row, index) {
        if (index%2 === 1) {
          return 'info-row';
        } else if (index%2 === 0) {
          return 'positive-row';
        }
        return '';
      },
      getDepartManageList(){
        let token=this.token;
        requestGetDepartManageList({token}).then(data => {
          if(data.errorCode === "200"){
            this.tree_search=data.result;
          }else{
            throw "错误定位：用户列表_管理的部门初始化   errorCode:"+data.errorCode
          }
        });
      },
      getUserList(deptId){
        let params = {
          token: this.token,
          index: this.right_main_currentPage1,
          pageSize: this.right_main_page_size
        }
        if (!this.checkList.normal) {
          params.isLock = 1
        } else if (!this.checkList.lock) {
          params.isLock = 0
        }
        this.show_filter=false;
        if(deptId == ''){
          requestGetUserListInit(params).then(data => {
            if(data.errorCode === "200"){
              this.tableUserListAll=data.result;
              this.right_main_total = parseInt(data.total, 10)
              this.loading_for_UserList=false;
            }else{
              this.loading_for_UserList=false;
              throw "错误定位：用户列表_获取所有用户列表   errorCode:"+data.errorCode
            }
          });
        }else{
          params.deptId = deptId
          requestGetUserList(params).then(data => {
            if(data.errorCode === "200"){
              this.tableUserListAll=data.result;
              this.right_main_total = parseInt(data.total, 10)
              this.loading_for_UserList=false;
            }else{
              throw "错误定位：用户列表_获取指定部门用户列表   errorCode:"+data.errorCode+" deptId:"+deptId
            }
          });
        }
      }
    },
    watch: {
      filterText(val) {
        this.node_list=[];
        let str=val.replace(/(^\s*)|(\s*$)/g,"");
        this.$refs.userList_left_tree.filter(str);
      },
      filterText_admin(val){
        if(val===''){
          this.search_depts_admin_ing=false;
        }
      }
    },
    created(){
      let that=this;
      if(this.pbAdmin.pb_admin!=='0'){
        this.getDepartManageList();
      }else{
        let Params={'deptId':'',token:that.token};
        requestGetAddressbook_nouser(Params).then(data => {
          if(data.errorCode === "200"){
            that.tree_search=data.result;
          }else{
            throw "错误定位：成员列表_树节点_初始化   errorCode:" + data.errorCode
          }
        });
      }
      this.getUserList('');
    },
    mounted(){
      if(this.search_w==='0'){
        this.search_is_hidden = true;
      }

      let elem = this.$refs.groupTable.$vnode.child.$el.childNodes[2]
      elem.style.maxHeight= (document.body.clientHeight - 250) +'px'
      this.left_list_height=document.body.clientHeight - 200

      window.onresize=() => {
        let elem = this.$refs.groupTable.$vnode.child.$el.childNodes[2]
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
  #op_iconbg
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
  div.el-input
    margin-bottom 16px
  #UserList_box
    height 100%
    overflow-x hidden
    .content_wrapper
      position relative
      width 100%
      height 100%
      background #fff
      border-radius 8px
      overflow-y hidden
    .left_wrapper
      position absolute
      left 0px
      top 0px
      bottom 0px
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
      .content_wrapper
        .btn_wrapper
          padding-bottom 6px
          border-bottom 1px solid #cccccc
          min-width 786px
        .table_wrapper
          margin-top 12px
          min-width 786px
          width 100%
</style>
