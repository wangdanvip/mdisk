<template>
  <div id="GroupAdmin_box">
    <!--<div id="no_allow" v-if="pbAdmin.pb_admin!=='0'">
      <div class="content">
        <div class="backBox">
          <a data-v-72b9704a="" onclick="window.history.go(-1)" class="comeback">{{i18n.g.backward}}</a>
        </div>
      </div>
    </div>-->
    <div class="main_wrapper">
      <div class="content_wrapper wrap_shoadow">
        <div class="btn_wrapper">
          <el-button type="primary" size="small" icon="iconfont iconfont icon-add" @click="dialogAddUser=true">{{__.g.add}}</el-button>
          <el-button type="primary" size="small" icon="iconfont iconfont icon-shanchu" @click="deleteMasters" :disabled="canDelete">{{__.g.delete}}</el-button>
          <el-button type="primary" size="small" icon="iconfont iconfont icon-shuaxin" @click="refresh">{{__.g.refresh}}</el-button>
        </div>
        <div class="table_wrapper">
          <!--暂时取消表格loading效果s
            v-loading="main_table_load"
            :element-loading-text="__.g.data_loading"-->
          <el-table
            ref="table"
            @selection-change="handleSelectionChange"
            class="no_wrap"
            :data="tableData_for_pages"
            highlight-current-row
            border
            style="width: 100%"
            :empty-text="__.g.no_data"
            :row-class-name="tableRowClassName">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="uName"
              width="200"
              :label="__.g.user">
              <template scope="scope">
                <span :title="scope.row.uName" class="text-over" style="display:inline-block;width: 100%;">{{scope.row.uName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="__.GroupPermission.create_group">
              <template scope="scope">
                <span :title="scope.row.gNames" class="text-over" style="display:inline-block;width: 100%;">{{scope.row.gNames}}</span>
              </template>
            </el-table-column>
            <el-table-column
              :render-header="reder_head"
              width="140"
              :label="__.DepartmentList.status">
              <template scope="scope">
                <div v-if="scope.row.d_state==='1'">{{__.GroupPermission.has_group}}</div>
                <div v-if="scope.row.d_state==='0'">{{__.GroupPermission.no_group}}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="handle_status"
              :label="__.DepartmentList.handle"
              width="290"
              @click="handleEdit(scope.$index, scope.row)">
              <template scope="scope">
                <el-button size="small" class="el-button--danger" v-if="scope.row.gNames" @click="to_trans(scope.row.masterId)" :style="{width: language == 'en' ? '188px' : '80.5px'}">{{__.GroupPermission.transfer_group_manager}}</el-button>
                <el-button size="small" class="el-button--danger" v-if="!scope.row.gNames" @click="delereMaster(scope.row.masterId)" :style="{width: language == 'en' ? '188px' : '80.5px'}">{{__.GroupPermission.delete_group_manager}}</el-button>
                <el-button size="small" class="el-button--primary" @click="viewMasterDetail(scope.row.masterId)">{{__.g.view}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div>
            <div class="block" style="margin-top: 12px; text-align: right;margin-right: 36px;">
              <el-pagination
                v-if="showPage"
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

    <el-dialog :title="__.g.add_user_o" v-model="dialogAddUser" :close-on-click-modal	="false" @open="openLog" @close="closeLog"  custom-class="logAddUser" id="logAddUser">
      <span>
        <p style="color:red">*{{__.GroupPermission.add_user_cr_pr}}</p>
        <div class="form-group" style="margin-top: 16px;">
          <div class="input-group">
            <span v-show="uName" @click="uName=''" style="position: absolute; right: 80px; font-size: 20px; cursor: pointer; top: 5px; color: #bfcbd9;z-index: 100">x</span>
            <input id="userName" v-model="uName" type="text" :placeholder="__.g.p_e_mip_a" class="form-control" @keydown.enter="searchUser">
            <span class="input-group-addon btn btn-info" @click="searchUser" :style="{padding:language=='zh'?'6px 22px':'6px 12px'}">{{__.g.search}}</span>
          </div>
          <div v-if="userList_data.length===0" style="margin-top: 16px">
            {{__.g.no_data}}
          </div>
          <div class="userList">
            <div class="item clearFix" :class="index===user_selected?{'userActive':true}:{'userActive':false}" v-for="(item,index) in userList_data" @click="user_selected=index">
              <div class="item_left"><el-radio class="radio" v-model="user_selected" :label="index"></el-radio></div>
              <div class="item_right" :title="item.deptName">
                <div class="name"><i class="iconfont icon-yonghu"></i>{{item.uName}}</div>
                <div class="department">{{item.deptName}}</div>
              </div>
            </div>
          </div>
        </div>
      </span>
      <span slot="footer" class="dialog-footer clearFix">
        <el-button type="primary" @click="addUser">{{__.g.sure_q}}</el-button>
        <el-button @click="dialogAddUser = false">{{__.g.cancel_q}}</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="dialogIndex===1?__.g.GroupPermission:__.g.select_user" v-model="dialogViewOwner" :close-on-click-modal	="false" @open="openLog" @close="closeLog"  custom-class="logViewOwner" id="logViewOwner">
      <span class="pageBox" id="mainViewOwner" v-show="dialogIndex===1">
        <div class="wrapper_owner">
          <div class="top_box"><i class="iconfont icon-yonghu"></i>{{ownerDetail.uName}}</div>
          <div class="bottom_box">{{ownerDetail.deptName}}</div>
        </div>
        <div class="wrapper_groups">
          <p>{{__.GroupPermission.manage_groups}}：</p>
          <div v-if="!ownerDetail.gList">
            {{__.GroupPermission.no_groups}}
          </div>
          <div class="item_g" v-for="item in ownerDetail.gList">
            <span>id：{{item.groupId}}</span> | <span class="folder"></span> <span>{{item.gName}}</span>
          </div>
        </div>
      </span>
      <span class="pageBox" id="selectTans" v-show="dialogIndex===2">
        <div class="form-group" style="margin-top: 16px;">
          <div class="input-group">
            <span v-show="uName" @click="uName=''" style="position: absolute; right: 80px; font-size: 20px; cursor: pointer; top: 5px; color: #bfcbd9;z-index: 100">x</span>
            <input  v-model="uName" type="text" :placeholder="__.g.p_e_mip_a" class="form-control" @keydown.enter="searchUser">
            <span class="input-group-addon btn btn-info" @click="searchUser" :style="{padding:language=='zh'?'6px 22px':'6px 12px'}">{{__.g.search}}</span>
          </div>
          <div v-if="userList_data.length===0" style="margin-top: 16px">
            {{__.g.no_data}}
          </div>
          <div class="userList resetUserList">
            <div class="item clearFix" :class="index===user_selected?{'userActive':true}:{'userActive':false}" v-for="(item,index) in userList_data" @click="user_selected=index">
              <div class="item_left"><el-radio class="radio" v-model="user_selected" :label="index"></el-radio></div>
              <div class="item_right" :title="item.deptName">
                <div class="name"><i class="iconfont icon-yonghu"></i>{{item.uName}}</div>
                <div class="department">{{item.deptName}}</div>
              </div>
            </div>
          </div>
        </div>
      </span>
      <span slot="footer" class="dialog-footer clearFix">
        <div v-show="dialogIndex===1">
          <el-button type="primary" :disabled="!ownerDetail.gList" @click="dialogIndex=2">{{__.transfer}}</el-button>
          <el-button @click="dialogViewOwner = false">{{__.g.close}}</el-button>
        </div>
        <div v-show="dialogIndex===2">
          <el-button type="primary" @click="submitTrans">{{__.confirm}}</el-button>
          <el-button @click="dialogViewOwner = false">{{__.g.cancel_q}}</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapActions} from 'vuex'
  import lang from 'src/lang.json'
  import { requestSearchUser,requestAddUser,requestGetMasterList,requestGetMasterDetail,requestTransferMaster,requestDeleteMaster } from 'common/api/api';
  import $ from 'common/js/jquery-vendor.js'

  export default {
    data(){
      return ({
        'right_main_currentPage1':1,
        'right_main_page_size':20,
        'main_table_load':true,
        'tableData':[],
        'ownerDetail':'',
        'dialogAddUser':false,
        'dialogViewOwner':false,
        'user_radio':'',
        'uName':'',
        'userList_data':[],
        //用于选择用户  添加群主的   也用户转移群主时  给未来群主
        'user_selected':'',
        //用于转移群主的时候   知道现在群主ID
        'masterId':'',
        'dialogIndex':1,
        //总表格选中的
        'multipleSelection':'',
        'canDelete':true,
        'show_filter':false,
        'submitCheckList':{'has_group':true,'no_group':true},
        'checkList':{'has_group':true,'no_group':true}
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
      'pbAdmin'(){
        let pbAdmin = JSON.parse(window.localStorage.getItem('pbAdmin'));
        return pbAdmin;
      },
      'table_for_status'(){
        let arr=[];
        arr=this.tableData.concat();
        if(this.submitCheckList.has_group===false){
          arr=arr.filter((item) => {
            return item.d_state==='0';
          });
        }
        if(this.submitCheckList.no_group===false){
          arr=arr.filter((item) => {
            return item.d_state==='1';
          });
        }
        return arr;
      },
      'tableData_for_pages'(){
        let start=(this.right_main_currentPage1-1)*this.right_main_page_size;
        let end=this.right_main_currentPage1*this.right_main_page_size;
        let data=this.table_for_status.slice(start,end);
        return data;
      },
      'right_main_total'(){
        return this.table_for_status.length;
      },
      'showPage'(){
        if(this.tableData.length>0){
          return true;
        }else{
          return false;
        }
      }
    },
    methods: {
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
        let handleClick=(event) => {
          this.show_filter=!this.show_filter;
          show_filter = this.show_filter;
          window.obj_vue=this;
        };
        let checkList=this.checkList;
        let setChecked_no_group=(e) => {
          e.preventDefault();
          this.checkList.no_group=!this.checkList.no_group;
        };
        let setChecked_has_group=(e) => {
          e.preventDefault();
          this.checkList.has_group=!this.checkList.has_group;
        };
        let handleFilter=(e) => {
          this.right_main_currentPage1 = 1
          if(checkList.no_group || checkList.has_group){
            let result = {};
            for(let key in this.checkList){
              result[key] = this.checkList[key];
            }
            this.submitCheckList = result;
            this.show_filter=false;
          }
        };
        let handleReset = (e) => {
          this.right_main_currentPage1 = 1
          this.checkList={'has_group':true,'no_group':true};
          this.submitCheckList = {'has_group':true,'no_group':true};
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
          <span class={!checkList.no_group?"el-checkbox__input":"el-checkbox__input is-checked"} onClick={setChecked_no_group}><span class="el-checkbox__inner"></span><input type="checkbox" class="el-checkbox__original" value={__.GroupPermission.no_group} /></span><span class="el-checkbox__label">{__.GroupPermission.no_group}</span>
        </label>
        <label class="el-checkbox">
          <span class={!checkList.has_group?"el-checkbox__input":"el-checkbox__input is-checked"} onClick={setChecked_has_group}><span class="el-checkbox__inner"></span><input type="checkbox" class="el-checkbox__original" value={__.GroupPermission.has_group} /></span><span class="el-checkbox__label">{__.GroupPermission.has_group}</span>
        </label>
        </div>
        </div>
        <div class="el-table-filter__bottom"  style="background-color:#fff;">
          <button class={(!checkList.has_group && !checkList.no_group)?"is-disabled":""} onClick={handleFilter}>{this.i18n.g.filter}</button>
          <button onClick={handleReset}>{this.i18n.g.reset}</button>
          </div>
          </div>
          </div>
        );
      },
      right_main_handleCurrentChange(val){
        this.$refs.table.$vnode.child.$el.childNodes[2].scrollTop=0;
        this.right_main_currentPage1=val;
      },
      loadTable(){
        let token=JSON.parse(window.localStorage.getItem('loginInfo')).token;
        requestGetMasterList({token}).then(data => {
          if (data.errorCode === "200") {
            this.tableData = data.result;
            this.main_table_load = false;
          } else {
            throw "错误定位：群主权限_获取群主列表   errorCode:" + data.errorCode
          }
        });
      },
      delereMaster(masterId){
        let that = this;
        this.masterId = masterId;
        let token = JSON.parse(window.localStorage.getItem('loginInfo')).token;
        let Params = {masterId,token};

        this.$confirm(this.__.g.s_t_del, this.__.g.Tips, {
          confirmButtonText:this.__.g.sure_q,
          cancelButtonText:this.__.g.cancel_q,
          type: 'warning'
        }).then(() => {
          requestDeleteMaster(Params).then((data) => {
            if(data.errorCode === "200"){
              that.msg('success', that.__.GroupPermission.d_m_success)
              that.loadTable();
            }else{
              throw "错误定位：群主权限_删除单个群主   errorCode:"+data.errorCode
            }
          });
        }).catch(() => {
        });
      },
      deleteMasters(){
        let that=this;
        let arr=this.multipleSelection.map((item) => {
          return item.masterId
        });
        let token = JSON.parse(window.localStorage.getItem('loginInfo')).token;

        this.$confirm(this.__.g.s_t_del, this.__.g.Tips, {
          confirmButtonText:this.__.g.sure_q,
          cancelButtonText:this.__.g.cancel_q,
          type: 'warning'
        }).then(() => {
          this.main_table_load=true;
          let arr_promise=arr.map((item) => {
            return new Promise((resolve,reject) => {
              requestDeleteMaster({"masterId":item,"token":token}).then(data => {
                if(data.errorCode === "200"){
                  resolve('success');
                }else{
                  reject('false');
                  throw "错误定位：删除出错的群主masterId为:"+item;
                }
              });
            })
          });
          Promise.all(arr_promise).then(function(res){
            that.loadTable();
            that.msg('success', that.__.GroupPermission.d_ms_is_s_head+res.length+that.__.GroupPermission.d_ms_is_s_foot)
          }).catch(function(){
            that.loadTable();
            that.msg('warning', that.__.GroupPermission.d_m_is_wrong)
          });
        }).catch(() => {
        });
      },
      to_trans(masterId){
        this.masterId = masterId;
        this.dialogIndex=2;
        this.dialogViewOwner=true;
      },
      handleSelectionChange(val){
        this.multipleSelection=val;
      },
      refresh(){
        this.right_main_currentPage1 = 1
        let that = this;
        this.main_table_load=true;
        that.loadTable();
        /*setTimeout(function(){
          that.loadTable();
        },1000);*/
      },
      tableRowClassName(row, index) {
        if (index%2 === 1) {
          return 'info-row';
        } else if (index%2 === 0) {
          return 'positive-row';
        }
        return '';
      },
      openLog(){
        $('.v-modal').show();
      },
      closeLog(){
        $('.v-modal').hide();
        this.dialogIndex=1;
        this.user_selected='';
        this.userList_data='';
        this.uName='';
      },
      searchUser(){
        let that = this;
        let uName = this.uName;
        if(uName===''){
          that.msg('warning', that.__.GroupPermission.p_e_u_s_f)
          return ;
        }
        this.user_selected = '';
        this.userList_data = '';
        let token = JSON.parse(window.localStorage.getItem('loginInfo')).token;
        let Params = {uName,token};
        requestSearchUser(Params).then(data => {
          if(data.errorCode === "200"){
            that.userList_data=data.result;
          }else{
            throw "错误定位：群主权限_搜索用户   errorCode:"+data.errorCode
          }
        });
      },
      addUser(){
        var that=this;
        if(this.user_selected===''){
          that.msg('warning', that.__.GroupPermission.p_s_u)
          return ;
        }
        let [
          uid,
          uName,
          deptName,
          token
        ]=[
          that.userList_data[that.user_selected].uid,
          that.userList_data[that.user_selected].uName,
          that.userList_data[that.user_selected].deptName,
          JSON.parse(window.localStorage.getItem('loginInfo')).token
        ];
        let Params = {uid,uName,deptName,token};
        requestAddUser(Params).then(data => {
          if(data.errorCode === "200"){
            that.msg('success', that.__.GroupPermission.c_g_m_m_s_a)
            that.dialogAddUser=false;
            that.loadTable();
          }else{
            throw "错误定位：群主权限_添加用户   errorCode:"+data.errorCode
          }
        });
      },
      viewMasterDetail(masterId){
        let that = this;
        this.masterId = masterId;
        let token=JSON.parse(window.localStorage.getItem('loginInfo')).token;
        let Params = {masterId,token};
        requestGetMasterDetail(Params).then(data => {
          if(data.errorCode === "200"){
            that.ownerDetail=data.result;
            this.dialogViewOwner=true
          }else{
            throw "错误定位：群主权限_查看群主   errorCode:"+data.errorCode
          }
        });
      },
      submitTrans(){
        var that = this;
        if(this.user_selected===''){
          that.msg('warning', that.__.GroupPermission.p_s_trans)
          return ;
        }

        let masterId=this.masterId;
        let uName=that.userList_data[that.user_selected].uName;
        let uid=that.userList_data[that.user_selected].uid;
        let deptName=that.userList_data[that.user_selected].deptName;
        let token = JSON.parse(window.localStorage.getItem('loginInfo')).token;

        let Params = {masterId,uName,uid,deptName,token};
        requestTransferMaster(Params).then(data => {
          if(data.errorCode === "200"){
            that.msg('success', that.__.GroupPermission.trans_g_success)
            that.dialogViewOwner=false;
            that.loadTable();
          }else{
            throw "错误定位：群主权限_转移群主   errorCode:"+data.errorCode
          }
        });
      }
    },
    watch: {
      // 如果 question 发生改变，这个函数就会运行
      multipleSelection: function () {
        if(this.multipleSelection.length===0){
          this.canDelete=true;
          return ;
        }else{
          for(let i=0,len=this.multipleSelection.length;i<len;i++){
            let item=this.multipleSelection[i];
            if(item.d_state==='1'){
              this.canDelete=true;
              return ;
            }
          }
          this.canDelete=false;
        }
      }
    },
    created(){
    },
    mounted(){
      this.loadTable()
      let elem = this.$refs.table.$vnode.child.$el.childNodes[2];
      elem.style.maxHeight=(document.body.clientHeight - 250) + 'px'

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
  .userList
    height 220px
    overflow auto
    margin-top 16px
    .item
      border-bottom: 1px solid #e5e5e5
      padding-bottom 8px
      cursor pointer
      &.userActive
        color #20a0ff
      &:hover .department,&:hover .name
        color #20a0ff
      .item_left
        float left
        width 40px
        text-align center
      .item_right
        float right
        width 370px
        .name>i
          margin-right 8px
        .department
          white-space nowrap
          text-overflow ellipsis
          word-break break-all
          overflow hidden
  .resetUserList
    height 210px
    padding-bottom 30px

  .pageBox
    display block
    height 249px
    margin-top -10px
  #mainViewOwner
    line-height 2
    .wrapper_owner
      border-bottom: 1px solid #e5e5e5
      padding-bottom 8px
      .top_box>i
        margin-right 12px
    .wrapper_groups
      padding-top 8px
      max-height 190px
      overflow auto
      .item_g
        height 28px
        line-height 28px
        margin 8px 0px
        &>span:first-child
          display inline-block
          width 80px
        &>span:last-child
          display inline-block
          vertical-align top
          width 370px
          white-space nowrap
          text-overflow ellipsis
          word-break break-all
          overflow hidden
        span.folder
          margin-left 16px
          display inline-block
          vertical-align top
          width 27px
          height 28px
          line-height 28px
          background url('./img/folder_icon.png')
  #selectTans
    overflow-y hidden
  #GroupAdmin_box
    height 100%
    overflow-x auto
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
        .btn_wrapper
          padding-bottom 6px
          border-bottom 1px solid #cccccc
        .table_wrapper
          margin-top 12px
          width 100%
  .dialog-footer
    .el-button
      text-align center
      padding-left 0!important
      padding-right 0!important
</style>
