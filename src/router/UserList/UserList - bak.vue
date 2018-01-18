<template>
  <div id="UserList_box" style="position: relative;">
    <div id="no_allow" v-if="!isDeptAdmin">
      <div class="content">
        <div class="backBox">
          <a data-v-72b9704a="" onclick="window.history.go(-1)" class="comeback">返回上一步</a>
        </div>
      </div>
    </div>
    <div  v-if="isDeptAdmin" style="position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px;">
      <div id="op_iconbg" :style="op_iconbg_css" style="z-index: 30" @click="search_toggle">
        <i class="iconfont icon-formatindentincrease"></i>
      </div>
      <div class="left_wrapper clearFix" :style="{'width':search_w+'px'}">
        <div class="content_wrapper wrap_shoadow">
          <!--部门管理员看到的搜索部门框-->
          <div class="el-input" v-if="this.pbAdmin.pb_admin!=='0'">
            <i class="el-input__icon el-icon-search" style="cursor: pointer;"></i>
            <span v-if="filterText" @click="clearFilterText" style="position: absolute; right: 30px; font-size: 20px; cursor: pointer; top: 8px; color: #bfcbd9;">x</span>
            <input type="text" :placeholder="__.DepartmentList.search_placeholder" autocomplete="off" class="el-input__inner" v-model="filterText">
          </div>

          <!--超级管理员看到的搜索部门框-->
          <div class="el-input" v-if="this.pbAdmin.pb_admin==='0'">
            <i class="el-input__icon el-icon-search" style="cursor: pointer;" @click="submitSearchDept"></i>
            <span v-if="filterText_admin" @click="clearFilterText_admin" style="position: absolute; right: 30px; font-size: 20px; cursor: pointer; top: 8px; color: #bfcbd9;">x</span>
            <input @keydown.enter="submitSearchDept" type="text" :placeholder="__.DepartmentList.search_placeholder" autocomplete="off" class="el-input__inner" v-model="filterText_admin">
          </div>
          </el-input>
          <div style="font-size:10px; margin-bottom: 8px; color:#1287dd; font-weight:500">
            <span style="vertical-align: middle;">{{__.g.selected}}：</span>

            <!--部门管理员看到的当前选中节点-->
            <span style="vertical-align: middle;background-color:#1287dd; font-size: 0px; color:#fff; display: inline-block; padding: 4px 8px; border-radius: 6px;" v-if="this.pbAdmin.pb_admin!=='0'">
              <span v-if="left_tree_selected.deptName==='所有管理的部门'" style="font-size: 12px;">{{__.g.manage_dptm_default}}</span>
              <span v-if="left_tree_selected.deptName!=='所有管理的部门'" style="position: relative;" :title="left_tree_selected.mName">
                <span :title="left_tree_selected.deptName" style="font-size: 12px;display:inline-block;width:9em;word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{left_tree_selected.deptName}}</span>
                <!--<span style="font-size: 12px;">&nbsp;&nbsp;</span>-->
                <span style="font-size: 12px; vertical-align: top;cursor: pointer;text-align:right;" @click="resetTableUserListAll">x</span>
              </span>
              <!--<div v-if="left_tree_selected.deptName!=='所有管理的部门'" style="cursor: pointer; display: inline-block; text-align:right; width: 14px; height: 14px;" @click="resetTableUserListAll">-->
                <!--x-->
              <!--</div>-->

              <!--<span v-if="left_tree_selected.deptName!=='所有管理的部门'" :title="left_tree_selected.mName" style="max-width: 110px;overflow: hidden; display: inline-block; height: 17px;">-->
                <!--<span :title="left_tree_selected.deptName">{{left_tree_selected.deptName}}</span>-->
              <!--</span>-->
              <!--<div v-if="left_tree_selected.deptName!=='所有管理的部门'" style="cursor: pointer; display: inline-block; text-align:right; width: 14px; height: 14px;" @click="resetTableUserListAll">-->
                <!--x-->
              <!--</div>-->
            </span>

            <!--超级管理员看到的当前选中节点-->
            <span style="vertical-align: middle;background-color:#1287dd; font-size: 0px;  color:#fff; display: inline-block; padding: 4px 8px; border-radius: 6px;"  v-if="this.pbAdmin.pb_admin==='0'">
              <span v-if="left_tree_selected.mid===undefined || left_tree_selected.mid==='' || left_tree_selected.mid==='00017661'" style="font-size: 12px;">{{__.g.manage_dptm_default}}</span>
              <span v-if="!(left_tree_selected.mid===undefined || left_tree_selected.mid==='' || left_tree_selected.mid==='00017661')" :title="left_tree_selected.mName">
                <span :title="left_tree_selected.mName" style="font-size: 12px;display:inline-block;width:9em;word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{left_tree_selected.mName}}</span>
                <span style="font-size: 12px; vertical-align: top;cursor: pointer;text-align:right;" @click="resetTableUserListAll">x</span>
              </span>
            </span>

            <!--<span style="vertical-align: middle;background-color:#1287dd; font-size: 0px;  color:#fff; display: inline-block; padding: 4px 8px; border-radius: 6px;"  v-if="this.pbAdmin.pb_admin==='0'">-->
              <!--<span v-if="left_tree_selected.mid===undefined || left_tree_selected.mid==='' || left_tree_selected.mid==='00017661'">{{__.g.manage_dptm_default}}</span>-->
              <!--<span v-if="!(left_tree_selected.mid===undefined || left_tree_selected.mid==='' || left_tree_selected.mid==='00017661')" :title="left_tree_selected.mName" style="max-width: 110px;overflow: hidden; display: inline-block; height: 17px;">{{left_tree_selected.mName}}</span>-->
              <!--<div v-if="!(left_tree_selected.mid===undefined || left_tree_selected.mid==='' || left_tree_selected.mid==='00017661')" style="cursor: pointer; display: inline-block; text-align:right; width: 14px; height: 14px;" @click="resetTableUserListAll">-->
                <!--x-->
              <!--</div>-->
            <!--</span>-->


          </div>
          <div :style="{'height':left_list_height+'px','overflow':'auto'}">
            <!--超级管理员看到的树节点-->
            <div>
              <el-tree :data="tree_search"
                       v-if="pbAdmin.pb_admin==='0' && search_depts_admin_ing===false"
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
                       :style="{'overflow-y':'auto','height':left_tree_height+'px'}">
              </el-tree>
            </div>
            <div v-if="search_depts_admin_ing===true">
              <div v-if="search_depts_admin.length===0">
                {{__.g.no_data}}
              </div>
              <div v-for="item in search_depts_admin" v-if="search_depts_admin.length!==0" @click="setDept(item.deptName,item.deptId)" style="width: 220px; overflow: hidden; height: 28px; line-height: 28px; font-size: 14px; cursor: pointer;">
                <i class="iconfont icon-fangzi" style="color: rgb(16, 148, 16); margin: 0px 6px;"></i>
                <span :style="item.deptId===deptId?{'color':'#cf6216'}:{}">{{item.deptName}}</span>
              </div>
            </div>

            <!--<el-tree :data="tree_search"-->
                     <!--v-if="pbAdmin.pb_admin==='0'"-->
                     <!--:filter-node-method="filterNode"-->
                     <!--:empty-text="__.g.loading"-->
                     <!--ref="userList_left_tree"-->
                     <!--id="userList_left_tree"-->
                     <!--@node-click="left_tree_nc"-->
                     <!--:check-strictly="true"-->
                     <!--:default-expand-all="false"-->
                     <!--node-key="deptId"-->
                     <!--:props="tree_defaultProps"-->
                     <!--:render-content="renderContent"-->
                     <!--:load="loadNode"-->
                     <!--lazy-->
                     <!--style="overflow-y:auto; min-height: 40px;">-->
            <!--</el-tree>-->
            <!--普通部门管理员看到的树节点-->
            <el-tree :data="tree_search"
                     v-if="pbAdmin.pb_admin!=='0'"
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
                     style="overflow-y:auto; min-height: 40px; width: 258px;">
            </el-tree>
            <!--:default-expanded-keys="['00017661']"-->
          </div>
        </div>
      </div>
      <div class="right_wrapper" :style="!search_is_hidden?{'left':'296px'}:{'left':'26px'}">
        <div class="content_wrapper wrap_shoadow">
          <div class="btn_wrapper">
            <el-button type="primary" size="small" icon="iconfont iconfont icon-iconfontsuoding" @click="setLockusers">{{__.CasualUser.lock_user}}</el-button>
            <el-button type="primary" size="small" icon="iconfont iconfont icon-jiesuo" @click="setUnlockusers">{{__.CasualUser.unlock_user}}</el-button>
            <!--<el-button type="primary" size="small" icon="iconfont iconfont icon-shanchu">{{__.g.delete}}</el-button>-->
            <el-button type="primary" size="small" icon="iconfont iconfont icon-shuaxin" @click="submitRefresh">{{__.g.refresh}}</el-button>
            <div class="el-input" style="display: inline-block; width: 300px; float: right; position: relative; margin-top: 8px;">
              <i class="el-input__icon el-icon-search" style="cursor: pointer" @click="submitDeptSearchUser"></i>
              <div v-if="searchName!==''" style="width: 20px; height: 20px; position: absolute; right: 38px; top: -6px; font-size: 20px; color:#bfcbd9; cursor: pointer;" @click="clearSearchName">
                x
              </div>
              <input type="text" :placeholder="__.UserList.search_user_place" autocomplete="off" class="el-input__inner" v-model="searchName" @keydown.enter="submitDeptSearchUser"/>
            </div>
          </div>
          <div class="table_wrapper">
            <el-table
              ref="groupTable"
              @selection-change="handleSelectionChange"
              :data="tableUserListForPages"
              v-loading="loading_for_UserList"
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
              </el-table-column>
              <el-table-column
                prop="uid"
                :label="__.UserList.login_name"
                width="160">
              </el-table-column>
              <el-table-column
                prop="deptName"
                :label="__.DepartmentList.belongs_to_depart">
                <template scope="scope">
                  <span :title="scope.row.deptName | replace_deptName">{{scope.row.deptName | replace_deptName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :render-header="reder_head"
                :label="__.DepartmentList.status"
                width="130">
                <template scope="scope">
                  {{scope.row.isLock===0?__.g.normal:__.g.Lock}}
                </template>
              </el-table-column>
              <el-table-column
                :label="__.DepartmentList.handle"
                width="100"
                @click="handleEdit(scope.$index, scope.row)">
                <template scope="scope">
                  <el-button size="small" class="el-button--danger" v-if="scope.row.isLock===0" @click="setUserLock(scope.row.uid,scope.row.deptId)">{{__.g.Lock}}</el-button>
                  <el-button size="small" class="el-button--primary" v-if="scope.row.isLock===1" @click="setUserUnlock(scope.row.uid,scope.row.deptId)">{{__.g.Unlock}}</el-button>
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
    </div>>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapActions} from 'vuex'
  import lang from 'src/lang.json'
  import { requestGetDepartManageList,requestGetUserList,requestGetUserListInit,requestUserLock,requestUserUnlock,requestDeptSearchUser,requestGetAddressbook_nouser,requestDeptSearchManage,requestCasualLock } from 'common/api/api';

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
        'right_main_page_size':20
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
        }

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
        return arr;
      },
      'tableUserListForPages'(){
        let start=(this.right_main_currentPage1-1)*this.right_main_page_size;
        let end=this.right_main_currentPage1*this.right_main_page_size;
        return this.tableUserListState.slice(start,end);
      },
      'right_main_total'(){
        return this.tableUserListState.length;
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
        this.left_tree_selected.mName=deptName;
        this.left_tree_selected.mid=depId;
        this.deptId=depId;
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
      },
      submitDeptSearchUser(){
        let uName=this.searchName.replace(/(^\s*)|(\s*$)/g,"");
        if(uName===''){
          this.data_model='all';
          return ;
        }
        let deptId=this.deptId;
        let token=this.token;
        let Params={uName,deptId,token};
        requestDeptSearchUser(Params).then((data) => {
          if(data.errorCode === "200"){
            this.searchNameResult=data.result;
            this.data_model='name';
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
        setTimeout(() => {
          this.getUserList(this.deptId);
        },500);
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
          that.$notify({
            title: that.__.g.warning,
            message: that.__.UserList.s_one_lock,
            offset: 100,
            type:'warning'
          });
          return ;
        }
        this.$confirm(this.__.g.is_sure_confirm, this.__.g.Tips, {
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
            that.getUserList(that.deptId);
            if(that.data_model==='name'){
              that.submitDeptSearchUser();
            }
            that.$notify({
              title: that.__.g.success,
              message: that.__.g.complete_head+res.length+that.__.g.complete_foot,
              offset: 100,
              type:'success'
            });
          });
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
          that.$notify({
            title: that.__.g.warning,
            message: that.__.UserList.s_one_normal,
            offset: 100,
            type:'warning'
          });
          return ;
        }
        this.$confirm(this.__.g.is_sure_confirm, this.__.g.Tips, {
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
            that.getUserList(that.deptId);
            if(that.data_model==='name'){
              that.submitDeptSearchUser();
            }
            that.$notify({
              title: that.__.g.success,
              message: that.__.g.complete_head+res.length+that.__.g.complete_foot,
              offset: 100,
              type:'success'
            });
          });
        }).catch(() => {
        });
      },
      setUserUnlock(account,deptId){
        let that = this;
        this.$confirm(this.__.g.is_sure_confirm, this.__.g.Tips, {
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
                that.getUserList(that.deptId);
                if(that.data_model==='name'){
                  that.submitDeptSearchUser();
                }
                that.$notify({
                  title: that.__.g.success,
                  message: that.__.UserList.unlock_user_s,
                  offset: 100,
                  type:'success'
                });
              },500);
            }else{
              throw "错误定位：用户列表_解锁用户   errorCode:"+data.errorCode+" 解锁失败账号："+account;
            }
          });
        }).catch(() => {
        });
      },
      setUserLock(account,deptId){
        let that = this;
        this.$confirm(this.__.g.is_sure_confirm, this.__.g.Tips, {
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
                that.getUserList(that.deptId);
                if(that.data_model==='name'){
                  that.submitDeptSearchUser();
                }
                that.$notify({
                  title: that.__.g.success,
                  message: that.__.UserList.lock_user_s,
                  offset: 100,
                  type:'success'
                });
              },500);
            }else{
              throw "错误定位：用户列表_锁定用户   errorCode:"+data.errorCode+" 锁定失败账号："+account;
            }
          });
        }).catch(() => {
        });
      },
      reder_head(h, {column, $index}){
        let __=this.__;
        let filter_style_n={
          'position': 'absolute',
          'top': '40px',
          'left': '-18px',
          'right': '-18px',
          'transform-origin': 'center top 0px',
          'z-index': '2001',
          'background-color':'#fff',
          'display':'none'
        };
        let filter_style_s={
          'position': 'absolute',
          'top': '40px',
          'left': '-18px',
          'right': '-18px',
          'transform-origin': 'center top 0px',
          'z-index': '2001',
          'background-color':'#fff',
          'display':'block'
        };
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
          if(checkList.lock || checkList.normal){
            let result = {};
            for(let key in this.checkList){
              result[key] = this.checkList[key];
            }
            this.submitCheckList = result;
            this.show_filter=false;
          }
        };
        let handleReset = (e) => {
          this.checkList={'normal':true,'lock':true};
          this.submitCheckList = {'normal':true,'lock':true};
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
                <button class={(!checkList.lock && !checkList.normal)?"is-disabled":""} onClick={handleFilter}>筛选</button>
                <button onClick={handleReset}>重置</button>
              </div>
            </div>
          </div>
        );
      },
      right_main_handleCurrentChange(val){
//        console.log(this.$refs.groupTable.$vnode.child.$el.childNodes[2]);
        this.$refs.groupTable.$vnode.child.$el.childNodes[2].scrollTop=0;
        this.right_main_currentPage1=val;
      },
      resetTableUserListAll(){
        this.left_tree_selected={'deptName':'所有管理的部门'};
        this.submitCheckList={'normal':true,'lock':true};
        this.deptId='';
        this.loading_for_UserList=true;
        this.getUserList('');
        this.data_model='all';
        this.searchName='';
      },
      left_tree_nc_admin(data,node,self){
        if(data.mTag===2){
          if(this.left_tree_selected!==data){
            this.left_tree_selected=data;
            this.deptId=data.mid;
            this.submitCheckList={'normal':true,'lock':true};
            this.loading_for_UserList=true;
            this.getUserList(data.mid);
            this.data_model='all';
            this.searchName='';
          }
        }
      },
      left_tree_nc(data,node,self){
        if(data.isManage==='1'){
          if(this.left_tree_selected!==data){
            let deptId=data.deptId;
            this.left_tree_selected=data;
            this.submitCheckList={'normal':true,'lock':true};
            this.deptId=data.deptId;
            this.loading_for_UserList=true;
            this.getUserList(data.deptId);
            this.data_model='all';
            this.searchName='';
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
        );
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
        let token=this.token;
        this.show_filter=false;
        if(deptId===''){
          requestGetUserListInit({token}).then(data => {
            if(data.errorCode === "200"){
              this.tableUserListAll=data.result;
              this.loading_for_UserList=false;
            }else{
              throw "错误定位：用户列表_获取所有用户列表   errorCode:"+data.errorCode
            }
          });
        }else{
          requestGetUserList({deptId,token}).then(data => {
            if(data.errorCode === "200"){
              this.tableUserListAll=data.result;
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

      if(this.isDeptAdmin){
        let elem = this.$refs.groupTable.$vnode.child.$el.childNodes[2];
        elem.style.maxHeight=(document.body.clientHeight-340)+'px';
//        elem.style.minHeight='112px';
        this.left_list_height=document.body.clientHeight-250;

        window.onresize=() => {
          let elem = this.$refs.groupTable.$vnode.child.$el.childNodes[2];
          elem.style.maxHeight=(document.body.clientHeight-340)+'px';
//          elem.style.minHeight='112px';
          this.left_list_height=document.body.clientHeight-250;
        }
      }

    }
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
      font-size 20px
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
          line-height 48px
          padding-bottom 6px
          border-bottom 1px solid #cccccc
          min-width 786px
        .table_wrapper
          margin-top 12px
          min-width 786px
          width 100%
</style>
