<template>
  <div id="GroupManage_box" style="position: relative;">
    <!--<div id="no_allow" v-if="pbAdmin.pb_admin==='3'">
      <div class="content">
        <div class="backBox">
          <a data-v-72b9704a="" onclick="window.history.go(-1)" class="comeback">{{i18n.g.backward}}</a>
        </div>
      </div>
    </div>-->
    <!--<div v-if="pbAdmin.pb_admin!=='3'" style="position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px;">-->
    <div style="position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px;">
      <!--<div id="op_iconbg" :style="op_iconbg_css" style="z-index: 30" @click="search_toggle">
        <i class="iconfont icon-formatindentincrease"></i>
      </div>-->
      <div id="left_wrapper_main" class="left_wrapper clearFix" :style="{'width':search_w+'px'}">
        <div class="content_wrapper wrap_shoadow">
          <div data-v-1371f2b4="" class="el-input">
            <i class="el-input__icon el-icon-search" style="cursor: pointer;"></i>
            <input type="text" v-model="search_gName" :placeholder="__.GroupManage.search_placeholder" autocomplete="off" class="el-input__inner">
          </div>
          <div class="group_btns">
            <el-button size="small" type="primary" @click="showAddGroup" :disabled="pbAdmin.pb_admin==='2'">{{__.g.add}}</el-button>
            <el-button size="small" type="primary" @click="showUpdate" v-if="pbAdmin.pb_admin==='0'">{{__.g.edit}}</el-button>
            <el-button size="small" type="primary" @click="submitDeleteGroup" v-if="pbAdmin.pb_admin==='0'">{{__.g.delete}}</el-button>
            <el-button size="small" type="primary" @click="showUpdate" :disabled="left_group_isMaster" v-if="pbAdmin.pb_admin!=='0'">{{__.g.edit}}</el-button>
            <el-button size="small" type="primary" @click="submitDeleteGroup" :disabled="left_group_isMaster" v-if="pbAdmin.pb_admin!=='0'">{{__.g.delete}}</el-button>
          </div>
          <div class="group_list" :style="{'height':left_list_height+'px','font-size':'12px'}">
            <div class="group_list_item" :class="index===select_group.index?{'active':true}:{'active':false}" v-for="(item,index) in filterGroupManageList" @click="setSelectGroup(index,item),submitGetMembers(item.groupId,item.gName)" :title="'ID:'+item.groupId+'  '+item.gName">
              <i class="iconfont icon-group"></i>
              <span class="id">ID:{{item.groupId}}</span>
              <span class="gName">{{item.gName}}</span>
              <span class="pIcon" v-if="login_uid===item.masterUid">{{__.g.Master}}</span>
            </div>
          </div>
        </div>
      </div>
      <div  class="right_wrapper" id="right_wrapper_main" :style="!search_is_hidden?{'left':'296px'}:{'left':'26px'}">
        <div class="content_wrapper wrap_shoadow">
          <div class="btn_wrapper">
            <el-button style="vertical-align: middle;height: 33px" type="primary" size="small" icon="iconfont iconfont icon-iconfontsuoding" :disabled="groupId_for_members===''" @click="submitUpdateMemberPb">{{__.g.save}}</el-button>
            <el-button style="vertical-align: middle;height: 33px" type="primary" size="small" icon="iconfont iconfont icon-add" @click="addDialog" :disabled="groupId_for_members===''">{{__.g.add_user}}</el-button>
            <el-button style="vertical-align: middle;height: 33px" type="primary" size="small" icon="iconfont iconfont icon-yichu" :disabled="groupId_for_members==='' || multipleSelection.length===0" @click="submitDeleteGroupMembers">{{__.g.remove}}</el-button>
            <el-button style="vertical-align: middle;height: 33px" type="primary" size="small" icon="iconfont iconfont icon-shuaxin" @click="submitGroupGetMembers" :disabled="groupId_for_members===''">{{__.g.refresh}}</el-button>
            <!--成员搜索-->
            <div class="el-input pull-right el-input--small" style="width:300px;">
              <i @click="getGroupMembers" class="el-input__icon el-icon-search" style="cursor: pointer;"></i>
              <span v-show="keywords" @click="keywords=''" style="position: absolute; right: 30px; font-size: 20px; cursor: pointer; top: 2px; color: #bfcbd9;">x</span>
              <input @keydown.enter="getGroupMembers" type="text" :placeholder="i18n.g.p_e_mip_a" autocomplete="off" class="el-input__inner" v-model="keywords">
            </div>
            <div style="float: right;max-width: 300px; white-space:nowrap; height: 46px; line-height: 46px; overflow: hidden;  font-size: 13px; padding-right: 8px;  vertical-align: bottom;text-overflow: ellipsis;word-break:break-all;color:#20a0ff;" v-if="groupId_for_members!==''" :title="'ID:'+groupId_for_members+'  '+gName_for_members">
              <span style="color:#333; font-weight: bold;">{{__.GroupManage.current_group + i18n.colon}}</span>ID{{i18n.colon + groupId_for_members}} <span style="margin-left: 16px;">{{gName_for_members}}</span>
            </div>
          </div>
          <div class="table_wrapper">
            <!--暂时取消表格loading
              v-loading="loading_for_GroupManage"-->
            <el-table
              id="manage_table"
              ref="groupTable"
              @selection-change="handleSelectionChange"
              :data="table_members_for_pages"
              :empty-text="__.g.no_data"
              style="width: 100%"
              :max-height="maxHeight"
              border
              :row-class-name="tableRowClassName">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                :label="__.g.user"
                :label-class-name="language == 'en' ? 'column-extend' : ''"
                width="120">
                <template scope="scope">
                  <span :title="scope.row.mName" class="text-over" style="display:inline-block;width: 100%;">{{scope.row.mName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="__.mip"
                :label-class-name="language == 'en' ? 'column-extend' : ''"
                width="120">
                <template scope="scope">
                  <span :title="scope.row.mid" class="text-over" style="display:inline-block;width: 100%;">{{scope.row.mid}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="__.g.list"
                :label-class-name="language == 'en' ? 'column-extend' : ''"
                min-width="65">
                <template scope="scope">
                  <el-checkbox checked disabled></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                :label="__.g.move"
                :label-class-name="language == 'en' ? 'column-extend' : ''"
                min-width="65">
                <template scope="scope">
                  <el-checkbox v-model="scope.row.pb_move" disabled></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                :label="__.g.copy"
                :label-class-name="language == 'en' ? 'column-extend' : ''"
                min-width="65">
                <template scope="scope">
                  <el-checkbox v-model="scope.row.pb_copy" disabled></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                prop="pb_down"
                :label="__.g.download"
                :label-class-name="language == 'en' ? 'column-extend' : ''"
                :min-width="language == 'en' ? 80 : 65">
                <template scope="scope">
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_down" v-if="scope.row.isMaster!==1 && (pbAdmin.pb_admin!=='0' && !isGruopMaster)" :disabled="scope.row.isAdmin===1"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_down" v-if="scope.row.isMaster!==1 && (pbAdmin.pb_admin==='0' || isGruopMaster)"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" checked disabled  v-if="scope.row.isMaster===1"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                prop="pb_upload"
                :label="__.g.upload"
                :label-class-name="language == 'en' ? 'column-extend' : ''"
                min-width="65">
                <template scope="scope">
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_upload" v-if="scope.row.isMaster!==1 && (pbAdmin.pb_admin!=='0' && !isGruopMaster)" :disabled="scope.row.isAdmin===1"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_upload" v-if="scope.row.isMaster!==1 && (pbAdmin.pb_admin==='0' || isGruopMaster)"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" checked disabled  v-if="scope.row.isMaster===1"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                prop="pb_delete"
                :label="__.g.delete"
                :label-class-name="language == 'en' ? 'column-extend' : ''"
                min-width="65">
                <template scope="scope">
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_delete" v-if="scope.row.isMaster!==1 && (pbAdmin.pb_admin!=='0' && !isGruopMaster)" :disabled="scope.row.isAdmin===1"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_delete" v-if="scope.row.isMaster!==1 && (pbAdmin.pb_admin==='0' || isGruopMaster)"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" checked disabled  v-if="scope.row.isMaster===1"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                prop="pb_rename"
                :label="__.g.rename"
                :label-class-name="language == 'en' ? 'column-extend' : ''"
                min-width="80">
                <template scope="scope">
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_rename" v-if="scope.row.isMaster!==1 && (pbAdmin.pb_admin!=='0' && !isGruopMaster)" :disabled="scope.row.isAdmin===1"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_rename" v-if="scope.row.isMaster!==1 && (pbAdmin.pb_admin==='0' || isGruopMaster)"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" checked disabled  v-if="scope.row.isMaster===1"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                prop="pb_share"
                :label="__.g.share"
                :label-class-name="language == 'en' ? 'column-extend' : ''"
                min-width="65">
                <template scope="scope">
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_share" v-if="scope.row.isMaster!==1 && (pbAdmin.pb_admin!=='0' && !isGruopMaster)" :disabled="scope.row.isAdmin===1"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_share" v-if="scope.row.isMaster!==1 && (pbAdmin.pb_admin==='0' || isGruopMaster)"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" checked disabled  v-if="scope.row.isMaster===1"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                prop="pb_admin"
                :label="__.g.admin"
                :label-class-name="language == 'en' ? 'column-extend' : ''"
                min-width="80">
                <template scope="scope">
                  <el-checkbox v-if="scope.row.mTag===2" disabled></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_admin" v-if="scope.row.mTag===1 && scope.row.isMaster!==1 && pbAdmin.pb_admin!=='0'" :disabled="!isGruopMaster"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_admin" v-if="scope.row.mTag===1 && scope.row.isMaster!==1 && pbAdmin.pb_admin==='0'"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" checked disabled v-if="scope.row.isMaster===1"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                :label="__.DepartmentList.handle"
                :label-class-name="language == 'en' ? 'column-extend' : ''"
                :width="language == 'zh' ? 85 : 105">
                <template scope="scope">
                  <el-tag type="primary"  v-if="scope.row.isMaster===1">{{__.g.Master}}</el-tag>
                  <el-tag style="padding:0" type="primary"  v-if="scope.row.isMaster!==1 && scope.row.isAdmin===1 && (pbAdmin.pb_admin!=='0' && !isGruopMaster)">{{__.g.admin}}</el-tag>
                  <el-button size="small" class="el-button--danger" v-if="scope.row.isMaster!==1 && scope.row.isAdmin===1 && (pbAdmin.pb_admin==='0' || isGruopMaster)" @click="submitDeleteGroupMember(scope.row)">
                    {{__.g.remove}}
                  </el-button>
                  <el-button size="small" class="el-button--danger" v-if="scope.row.isMaster!==1 && scope.row.isAdmin!==1" @click="submitDeleteGroupMember(scope.row)">
                    {{__.g.remove}}
                  </el-button>
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
      <!--新建群组-->
      <el-dialog size="tiny" :title="__.GroupManage.create_group" v-model="dialogCreateGroup" :close-on-click-modal="false" @open="openLog" @close="closeLog" class="dialogCreateGroup">
        <div class="content_box" id="dialogCreateGroup">
          <div class="hr_wrapper">
            <span style="width:120px;"><span class="red">*</span>{{__.GroupManage.gName + i18n.colon}}</span>
            <el-input v-model="create_gName" :placeholder="__.g.p_enter_name" style="width: 410px" :maxlength="15" @keydown.enter.native="submitCreateGroup" @change="gName_error=''" @blur="gNameCheck"></el-input>
          </div>
          <div style="padding-left: 120px;color: red">
            {{gName_error}}
          </div>
          <div class="hr_wrapper">
            <span style="width:120px;"><span class="red">*</span>{{__.GroupManage.gCapacity + i18n.colon}}</span>
            <span style="width: 390px;">
              <div class="block">
                <el-select v-model="create_capacity">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </span>
          </div>
          <div class="hr_wrapper">
            <span style="width:120px;margin-left: 12px">{{__.g.master_name + i18n.colon}}</span>
            {{login_account}}
          </div>
        </div>
        <span slot="footer" class="dialog-footer clearFix">
          <div>
            <el-button type="primary" @click="submitCreateGroup">{{__.g.sure_q}}</el-button>
            <el-button @click="dialogCreateGroup=false">{{__.g.close}}</el-button>
          </div>
        </span>
      </el-dialog>
      <!--更新群组-->
      <el-dialog size="tiny" :title="__.GroupManage.update_group" v-model="dialogUpdateGroup" :close-on-click-modal="false" @open="openLog" @close="closeLog" class="dialogUpdateGroup">
        <div class="content_box" id="dialogUpdateGroup">
          <div class="hr_wrapper">
            <span style="width:120px;"><span class="red">*</span>{{__.GroupManage.gName + i18n.colon}}</span>
            <el-input v-model="updata_gName" :placeholder="__.g.p_enter_name" style="width: 410px" :maxlength="15" @change="update_error=''" @blur="update_check" @keydown.enter.native="submitGroupUpdate"></el-input>
          </div>
          <div style="padding-left: 120px;color: red">
            {{update_error}}
          </div>
          <div class="hr_wrapper">
            <span style="width:120px;"><span class="red">*</span>{{__.GroupManage.gCapacity + i18n.colon}}</span>
            <span style="width: 390px;">
              <div class="block">
                <el-input-number
                  v-model="updata_capacity"
                  ref="update_capacity"
                  v-if="pbAdmin.pb_admin == '0'"
                  @change = 'capacity_check'
                  :min="minCapacity"
                  :max="maxCapacity">
                </el-input-number>
                <!--<el-input v-model="updata_capacity" ref="update_capacity" v-if="pbAdmin.pb_admin == '0'" style="width:180px;" @change="capacity_check"></el-input>-->
                <select v-model="unit" v-if="pbAdmin.pb_admin == '0'" class="select" @change="select_unit">
                  <option value="G">G</option>
                  <option value="T">T</option>
                </select>
                <span v-if="pbAdmin.pb_admin != '0'">{{updata_capacity + 'G'}}</span>
              </div>
            </span>
          </div>
          <div class="hr_wrapper">
            <span style="width:120px;padding-left: 12px">{{__.g.master_name + i18n.colon}}</span>
            {{select_group.masterUid}}
          </div>
        </div>
        <span slot="footer" class="dialog-footer clearFix">
          <div>
            <el-button type="primary" @click="submitGroupUpdate">{{__.g.sure_q}}</el-button>
            <el-button @click="dialogUpdateGroup=false">{{__.g.close}}</el-button>
          </div>
        </span>
      </el-dialog>
      <!--添加成员-->
      <el-dialog size="tiny" :title="__.g.add_user" v-model="dialogAddMember" :close-on-click-modal="false" @open="openLog" @close="closeMemberDialog" class="dialogAddMember">
        <el-row :gutter="10">
          <el-col :span="16">
            <div class="form-group">
              <div class="input-group">
                <span v-show="uName" @click="uName='';show_tree=true" style="position: absolute; right: 80px; font-size: 20px; cursor: pointer; top: 3px; color: #bfcbd9;z-index: 100">x</span>
                <input  v-model="uName" type="text" :placeholder="__.g.p_e_mip_a" class="form-control" @keydown.enter="submitSearchUser">
                <span class="input-group-addon btn btn-info" @click="submitSearchUser" :style="{padding:language=='zh'?'6px 22px':'6px 12px'}">{{__.g.search}}</span>
              </div>
            </div>
            <div v-show="show_tree">
              <el-tree
                ref="tree"
                node-key="mid"
                @node-click="nodeClick"
                :check-strictly="true"
                :accordion="true"
                :auto-expand-parent="false"
                :expand-on-click-node="false"
                highlight-current
                :render-content="renderContent"
                :data="tree_depart"
                :props="tree_depart_props"
                :load="loadNode"
                lazy
                style="height:280px;margin-top: 16px; max-height: 300px;overflow: auto;">
              </el-tree>
            </div>

            <div v-show="!show_tree" class="search_user">
              <span v-show="userList_data.length==0">
                {{__.g.no_data}}
              </span>
              <label v-for="(u, i) in userList_data" class="el-checkbox">
                <span :class="toggle_class(u)" @click.prevent="select_user(u)"><span class="el-checkbox__inner"></span><input type="checkbox" class="el-checkbox__original"/></span><span class="el-checkbox__label">
                  <i class="iconfont icon-yonghu" style="color:#094caf;margin:0px 3px;"></i>
                  <span>{{u.mName}}</span>
                  <br>
                  <span :title="u.deptName" class="text-over" style="display:inline-block;width:100%;padding-left:20px">{{u.deptName}}</span>
                </span>
              </label>
            </div>
          </el-col>
          <el-col :span="8" class="userList">
            <div>{{i18n.g.selected + i18n.colon + "(" + users.length + "/2000" + ")"}}
              <el-tooltip class="item" effect="light" :content="i18n.g_members_tip" placement="bottom-start">
                <i class="iconfont icon-icon-question icon-action"></i>
              </el-tooltip>
            </div>
            <ul>
              <li v-for="m in users">
                <span :title="m.mid">{{m.mName}}</span>
                <i v-if="!m.disabled" class="iconfont icon-wu" style="float: right;cursor: pointer" @click="toggle_user(m)"></i>
              </li>
            </ul>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer clearFix">
          <div>
            <el-button type="primary" @click="submitAddMaster">{{__.g.sure_q}}</el-button>
            <el-button @click="closeMemberDialog">{{__.g.close}}</el-button>
          </div>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapActions} from 'vuex'
  import { requestGetManageList,requestGroupCreat,requestGroupUpdate,requestGroupDelete,requestGroupGetMembers,requestSearchUser,requestAddGroupMember,requestDeleteGroupMember,requestUpdateGroupPb,requestGetCapacity,requestGetAddressbook } from 'common/api/api';
  import lang from 'src/lang.json'
  import $ from 'common/js/jquery-vendor.js'

  export default {
    data(){
      let i18n = this.i18n
      return ({
        'right_main_currentPage1':1,
        'right_main_total':20,
        'right_main_page_size':20,
        'tree_root_id':'',
        'tree_depart_props':{
          children: 'children',
          label: 'mName',
          isLeaf: 'isLeaf'
        },
        'tree_depart': [],
        'search_is_hidden':false,
        'left_list_height':'400',
        'search_gName':'',
        'multipleSelection':[],
        'add_admin_checked':false,
        'loading_for_GroupManage':false,
        'gName_for_members':'',
        'groupId_for_members':'',
        'table_members':[],
        'minCapacity':1,
        'maxCapacity': 2048,
        'create_gName':'',
        'create_capacity':5,
        'updata_gName':'',
        'updata_capacity':5,
        'select_group':'',
        'uName':'',
        'userList_data':[],
        'dialogCreateGroup':false,
        'dialogUpdateGroup':false,
        'dialogAddMember':false,
        'groupManageList':'',
        'op_iconbg_op':{
          'left':'270px'
        },
        'op_iconbg_cl':{
          'left':'0px'
        },
        show_tree: true,
        gName_error: '',
        update_error: '',
        users: [],
        maxHeight: 0,
        keywords: '',
        options: [{
          value: 5,
          label: '5G'
        }, {
          value: 10,
          label: '10G'
        }],
        unit: 'G',
        unit_options: [{
          value: 'G',
          label: 'G'
        }, {
          value: 'T',
          label: 'T'
        }],
        login_account: '',
        useCapacity: 0,
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
      'showPage'(){
        if(this.table_members.length>0){
          return true;
        }else{
          return false;
        }
      },
      'table_members_for_pages'(){
        let start=(this.right_main_currentPage1-1)*this.right_main_page_size;
        let end=this.right_main_currentPage1*this.right_main_page_size;
        let data=this.table_members.slice(start,end);
        return data;
      },
      op_iconbg_css(){
        return !this.search_is_hidden?this.op_iconbg_op:this.op_iconbg_cl;
      },
      'pbAdmin'(){
        let pbAdmin = JSON.parse(window.localStorage.getItem('pbAdmin'));
        return pbAdmin;
      },
      'token'(){
        let token = JSON.parse(window.localStorage.getItem('loginInfo')).token;
        return token;
      },
      'login_uid'(){
        let login_uid = JSON.parse(window.localStorage.getItem('loginInfo')).uid;
        return login_uid;
      },
      'login_name'(){
        let name = JSON.parse(window.localStorage.getItem('loginInfo')).userName;
        return name;
      },
      'isGruopMaster'(){
        if(this.table_members.length!==0){
          return this.table_members[0].mid===JSON.parse(window.localStorage.getItem('loginInfo')).uid;
        }else{
          return false;
        }
      },
      'left_group_isMaster'(){
        if(this.login_uid===this.select_group.masterUid){
          return false;
        }else{
          return true;
        }
      },
      'filterGroupManageList'(){
        let that = this;
        if(this.groupManageList!==''){
          return this.groupManageList.filter((item) => {
            return item.gName.indexOf(that.search_gName)!==-1;
          })
       }
       return this.groupManageList;
      }
    },
    methods: {
      addDialog() {
        this.dialogAddMember = true
        this.users = this.table_members.map(m => {
          return {
            mid: m.mid,
            mName: m.mName,
            mTag: m.mTag,
            isLeaf: 1,
            disabled: true
          }
        })
        this.getAddressbookInit('')
      },
      nodeClick(data, n, e) {
        let childNodes = n.childNodes.filter(c => {
          return c.data && c.data.mTag == 1
        })
        let count = 0
        let len = childNodes.length
        for (let i = 0; i < len; i += 1) {
          if (this.getKey(childNodes[i].data) > -1) {
            count += 1
          }
        }
        if (count < len && (len - count + this.users.length > 2000)) {
          this.msg('warning', this.i18n.g_members_limit)
          return
        }
        for (let i = 0; i < len; i += 1) {
          this.toggle_user(childNodes[i].data, count < childNodes.length)
        }
      },
      getKey(m) {
        let users = this.users
        let key = -1
        for (let i = 0; i < users.length; i += 1) {
          if (users[i].mid == m.mid) {
            key = i
          }
        }
        return key
      },
      toggle_user(m, flag) {
        if (m.disabled) {
          return
        }
        let users = this.users
        let key = this.getKey(m)
        if (key < 0) {
          if (users.length >= 2000) {
            this.msg('warning', this.i18n.g_members_limit)
            return
          }
          users.unshift(m)
        } else {
          !users[key].disabled && !flag && users.splice(key, 1)
        }
      },
      toggle_class(m) {
        let users = this.users
        let key = this.getKey(m)
        if (key < 0) {
          return "el-checkbox__input"
        } else {
          if (users[key].disabled) {
            return "el-checkbox__input is-checked is-disabled"
          } else {
            return "el-checkbox__input is-checked"
          }
        }
      },
      select_user(u) {
        let m = {
          mid: u.mid,
          mName: u.mName,
          mTag: 1,
          isLeaf: true
        }
        this.toggle_user(m)
      },
      renderContent(h, { node, data, store }) {
        let checkUser = (e, data) => {
          e.preventDefault()
          this.toggle_user(data)
        }
        let toggleClass = this.toggle_class
        return (
          <span>{data.mTag ==2
            ? <span><i class="iconfont icon-fangzi" style="color:#109410;margin:0px 3px;"></i>{node.label}</span>
            : <label class="el-checkbox">
              <span class={toggleClass(data)} onClick={e => { checkUser(e, data) }}><span class="el-checkbox__inner"></span><input type="checkbox" class="el-checkbox__original"/></span><span class="el-checkbox__label">
                <i class="iconfont icon-yonghu" style="color:#094caf;margin:0px 3px;"></i>
                {node.label}
              </span>
              </label>}
          </span>
        )
      },
      right_main_handleCurrentChange(val){
        this.$refs.groupTable.$vnode.child.$el.childNodes[2].scrollTop=0;
        this.right_main_currentPage1=val;
      },
      loadNode(node, resolve) {
        let that = this;
        if(node.level!==0){
          if(node.data.mTag===2){
            let Params={'deptId':node.data.mid,token:that.token};
            requestGetAddressbook(Params).then(data => {
              if(data.errorCode === "200"){
                resolve(data.result);
              }else{
                throw "错误定位：群主管理_获取通讯录加载   errorCode:" + data.errorCode
              }
              return ;
            });
          }else{
            resolve([]);
            return ;
          }
          return ;
        }
        resolve(this.tree_depart);
      },
      search_toggle(){
        this.search_is_hidden=!this.search_is_hidden;
        this.search_is_hidden?this.$store.dispatch('set_search_w_min'):this.$store.dispatch('set_search_w_max');
      },
      checkRow(scope){
        this.$refs.groupTable.toggleRowSelection(scope,true);
      },
      submitDeleteGroupMembers(){
        let that = this;
        let arr_master=[];
        let arr_admin=[];
        this.multipleSelection.map((item) => {
          if(item.isMaster ===1){
            arr_master.push('1');
          }
        });
        if(arr_master.length!==0){
          this.msg('warning', this.__.GroupManage.master_remove_noAllow)
          return ;
        }

        if(that.pbAdmin.pb_admin!=='0'  &&  !that.isGruopMaster){
          this.multipleSelection.map((item) => {
            if(item.isAdmin===1 || item.isMaster ===1){
              arr_admin.push('1');
            }
          });
          if(arr_admin.length!==0){
            this.msg('warning', this.__.GroupManage.master_admin_noAllow)
            return ;
          }
        }

        this.$confirm(this.__.g.s_t_del, this.__.g.warning, {
          confirmButtonText:this.__.g.sure_q,
          cancelButtonText:this.__.g.cancel_q,
          type: 'warning'
        }).then(() => {
          this.loading_for_GroupManage=true;
          let promises=this.multipleSelection.map((item) => {
            return new Promise((resolve,reject) => {
              let [groupId,mid,mTag,token]=[that.groupId_for_members,item.mid,item.mTag,JSON.parse(window.localStorage.getItem('loginInfo')).token];
              let params={groupId,mid,mTag,token};
              requestDeleteGroupMember(params).then(data => {
                if(data.errorCode === "200"){
                  resolve('0');
                }else{
                  reject('1');
                  throw "错误定位：群主管理_批量移除成员   移除出错的mid:"+item.mid
                }
              });
            });
          });
          Promise.all(promises).then(function(res){
            that.getGroupMembers();
            that.msg('success', that.__.GroupManage.d_m_is_s_head+res.length+that.__.GroupManage.d_ms_is_s_foot)
          }).catch(function(){
            that.getGroupMembers();
            that.msg('warning', that.__.GroupManage.d_m_is_wrong)
          });
        }).catch(() => {
        });
      },
      submitDeleteGroupMember(item){
        let [groupId,mid,mTag,token]=[this.groupId_for_members,item.mid,item.mTag,JSON.parse(window.localStorage.getItem('loginInfo')).token];
        if(this.pbAdmin.pb_admin==='0' || this.isGruopMaster){
          let params={groupId,mid,mTag,token};
          this.$confirm(this.__.g.s_t_del, this.__.g.warning, {
            confirmButtonText:this.__.g.sure_q,
            cancelButtonText:this.__.g.cancel_q,
            type: 'warning'
          }).then(() => {
            this.deleteGroupMember(params);
          }).catch(() => {
          });
          return ;
        }
        if(item.isAdmin===1){
          this.msg('warning', this.__.GroupManage.group_admin_fail_delete)
          return ;
        }else{
          let params={groupId,mid,mTag,token};
          this.$confirm(this.__.g.s_t_del, this.__.g.warning, {
            confirmButtonText:this.__.g.sure_q,
            cancelButtonText:this.__.g.cancel_q,
            type: 'warning'
          }).then(() => {
            this.deleteGroupMember(params);
          }).catch(() => {
          });
        }
      },
      handleSelectionChange(val){
        this.multipleSelection=val;
      },
      submitUpdateMemberPb(){
        let that=this;
        if(this.multipleSelection.length===0){
          that.msg('warning', that.__.GroupManage.select_changes)
          return ;
        }
        if(this.multipleSelection.length===1 && this.multipleSelection[0].isMaster===1){
          that.msg('warning', that.__.GroupManage.unnecess)
          return ;
        }
        this.loading_for_GroupManage=true;
        let groupId=this.groupId_for_members;
        let mTag='1';
        let token=JSON.parse(window.localStorage.getItem('loginInfo')).token;
        let arr_promise=this.multipleSelection.map((item) => {
          let mid=item.mid;
          let pb_down=item.pb_down?'1':'0';
          let pb_upload=item.pb_upload?'1':'0';
          let pb_delete=item.pb_delete?'1':'0';
          let pb_rename=item.pb_rename?'1':'0';
          let pb_share=item.pb_share?'1':'0';
          let isAdmin=item.pb_admin?'1':'2';
          mTag = item.mTag
          let Params={};
          if(that.isGruopMaster || that.pbAdmin.pb_admin==='0'){
            Params={groupId,mTag,token,mid,pb_down,pb_upload,pb_delete,pb_rename,pb_share,isAdmin};
          }else{
            Params={groupId,mTag,token,mid,pb_down,pb_upload,pb_delete,pb_rename,pb_share};
          }
          if(!item.isMaster!==1){
            return new Promise((resolve,reject) => {
              requestUpdateGroupPb(Params).then(data => {
                if(data.errorCode === "200"){
                  resolve('success');
                }else{
                  reject('false');
                  throw "错误定位：保存出错的用户mid为"+item.mid;
                }
              });
            })
          }
        });
        Promise.all(arr_promise).then(function(res){
          that.getGroupMembers();
          that.msg('success', that.format(that.i18n.GroupManage.up_pb_foot, res.length))
        }).catch(function(){
          that.getGroupMembers();
          that.msg('warning', that.__.GroupManage.up_pb_is_wrong)
        });
      },
      submitGroupGetMembers(){
        this.right_main_currentPage1 = 1
        this.loading_for_GroupManage=true;
        setTimeout(() => {
          this.getGroupMembers()
        },500);
      },
      submitAddMaster(){
        let that = this;
        let addUsers = this.users.filter((u) => {
          return !u.disabled
        })
        let len = addUsers.length;
        if (len == 0) {
          this.msg('warning', this.__.GroupManage.s_user_or_dp_f)
          return
        }
        let mList = addUsers.map((u) => {
          return {
            "mid":u.mid,
            "mName":u.mName,
            "pb_list":"1",
            "pb_view":"1",
            "pb_down":"1",
            "pb_upload":"1",
            "pb_delete":"1",
            "pb_rename":"1",
            "pb_share":"1",
            "isAdmin":"2",
            "mTag": u.mTag
          }
        })
        let groupId = this.groupId_for_members
        let token = this.token
        let Params = {groupId, mList, token}
        requestAddGroupMember(Params).then(data => {
          if(data.errorCode == "200"){
            that.getGroupMembers()
            that.msg('success', that.__.GroupManage.add_txl_s_head + len + that.__.GroupManage.add_txl_s_foot)
            that.dialogAddMember=false
          }
        }).catch(() => {
        })
      },
      getAddressbookInit(id){
        let that=this;
        let Params={'deptId':id,token:that.token};
        requestGetAddressbook(Params).then(data => {
          if(data.errorCode === "200"){
            that.tree_depart = data.result;
            that.tree_root_id = data.result[0].mid;
          }else{
              throw "错误定位：群主管理_获取通讯录_初始化   errorCode:" + data.errorCode
          }
        });
      },
      deleteGroupMember(Params){
        let that=this;
        requestDeleteGroupMember(Params).then(data => {
          if(data.errorCode === "200"){
            that.getGroupMembers();
            that.msg('success', that.__.GroupManage.delete_group_member_s)
          }else{
            throw "错误定位：群主管理_移除成员   errorCode:"+data.errorCode
          }
        });
      },
      submitSearchUser(){
        let that = this;
        let uName = this.uName;
        if(uName===''){
          this.userList_data=[];
          this.show_tree = true
          return ;
        }
        this.show_tree = false
        this.user_selected = '';
        this.userList_data = '';
        let token = JSON.parse(window.localStorage.getItem('loginInfo')).token;
        let Params = {uName,token};
        requestSearchUser(Params).then(data => {
          if(data.errorCode === "200"){
            that.userList_data = data.result.map((u) => {
              return {
                mid: u.uid,
                mName: u.uName,
                deptName: u.deptName,
                mTag: 1
              }
            })
          }else{
            throw "错误定位：群主权限_搜索用户   errorCode:"+data.errorCode
          }
        });
      },
      submitGetMembers(groupId,gName){
        this.right_main_currentPage1=1;
        this.groupId_for_members=groupId;
        this.gName_for_members=gName;
        this.getGroupMembers();
      },
      setSelectGroup(index,item){
        this.select_group={
          'capacity':item.capacity,
          'masterUid':item.masterUid,
          'masterName':item.masterName,
          'groupId':item.groupId,
          'gName':item.gName,
          'index':index
        }
      },
      getGroupMembers(){
        let that = this
        let params = {
          groupId: this.groupId_for_members,
          token: this.token,
          index: 1,
          pageSize: 2000
        }
        let keywords = this.keywords.replace(/(^\s*)|(\s*$)/g,"")
        if (keywords != '') {
          params.keywords = keywords
        }
        requestGroupGetMembers(params).then(data => {
          if(data.errorCode === "200"){
            that.table_members = data.result
            that.right_main_total = data.result.length
            that.loading_for_GroupManage=false
          }else{
            throw "错误定位：群主管理_查看群组成员   errorCode:"+data.errorCode
          }
        });
      },
      getManageList(){
        let token=this.token;
        requestGetManageList({token}).then(data => {
          if(data.errorCode === "200"){
            this.groupManageList=data.result
          }else{
            throw "错误定位：群主管理_获取用户管理的群组列表   errorCode:"+data.errorCode
          }
        });
      },
      createGroup(){
        let that = this;
        let Params={'gName':this.create_gName,'capacity':this.create_capacity,'token':this.token};
        requestGroupCreat(Params).then(data => {
          if(data.errorCode === "200"){
            this.getManageList();
            this.msg('success', that.__.GroupManage.create_group_s)
            this.create_gName='';
            this.create_capacity=5;
          }else{
            throw "错误定位：群主管理_创建群组   errorCode:"+data.errorCode
          }
        });
      },
      groupUpdate(){
        //this.updata_capacity = Math.round(this.updata_capacity)
        let that = this;
        let Params = {
          'groupId':this.select_group.groupId,
          'gName':this.updata_gName,
          'capacity': this.unit == 'T' ? this.updata_capacity*1024 : this.updata_capacity,
          'token':this.token};
        requestGroupUpdate(Params).then(data => {
          if(data.errorCode === "200"){
            that.dialogUpdateGroup=false;
            that.getManageList();
            that.msg('success', that.__.GroupManage.update_group_s)
            that.select_group='';
          }else{
            throw "错误定位：群主管理_编辑群组   errorCode:"+data.errorCode
          }
        });
      },
      groupDelete(){
        let that = this;
        let Params={'groupId':this.select_group.groupId,'token':this.token};
        requestGroupDelete(Params).then(data => {
          if(data.errorCode === "200"){
            that.getManageList();
            that.msg('success', that.__.GroupManage.delete_group_s)
            that.select_group='';
            that.groupId_for_members='';
            that.gName_for_members='';
            that.table_members=[];
          }else{
            throw "错误定位：群主管理_删除群组   errorCode:"+data.errorCode
          }
        });
      },
      submitDeleteGroup(){
        let that=this;
        if(this.select_group===''){
          this.msg('warning', this.__.GroupManage.select_group_first)
          return ;
        }

        this.$confirm(that.__.g.s_t_del, that.__.g.warning, {
          confirmButtonText:that.__.g.sure_q,
          cancelButtonText:that.__.g.cancel_q,
          type: 'warning'
        }).then(() => {
          this.groupDelete();
        }).catch(() => {
        });
      },
      submitGroupUpdate(){
        this.update_check()
        if (this.update_error == '') {
          this.groupUpdate()
        }
      },
      showAddGroup(){
        this.dialogCreateGroup=true;
      },
      submitCreateGroup(){
        this.gNameCheck()
        if (this.gName_error == '') {
          this.dialogCreateGroup=false;
          this.createGroup()
        }
      },
      showUpdate(){
        let that = this;
        if(this.select_group===''){
          this.msg('warning', that.__.GroupManage.select_group_first)
          return ;
        }
        let Params={'groupId':this.select_group.groupId,'token':this.token};
        requestGetCapacity(Params).then(data => {
          if(data.errorCode === "200"){
            this.useCapacity = data.result.useCapacity
            if(data.result.useCapacity*1===0){
              that.minCapacity=data.result.useCapacity*1+1;
            }else{
              that.minCapacity=data.result.useCapacity*1;
            }
          }else{
            throw "错误定位：群主管理_获取群组实际使用容量   errorCode:"+data.errorCode
          }
        });
        this.updata_gName=this.select_group.gName;
        this.updata_capacity=this.select_group.capacity*1;
        this.dialogUpdateGroup=true;
      },
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
      },
      openLog(){
        $('.v-modal').show();
      },
      closeLog(){
        this.create_gName = ''
        this.gName_error = ''
        this.update_error = ''
        this.create_capacity = 5
        this.unit = 'G'
        this.maxCapacity = 2048
        this.minCapacity = 0
        $('.v-modal').hide();
      },
      closeMemberDialog () {
        $('.v-modal').hide();
        this.dialogAddMember = false
        this.uName = ""
        this.userList_data = []
        this.user_selected = ""
        this.users = []
        this.tree_depart = []
        this.show_tree = true
      },
      gNameCheck () {
        this.create_gName = this.create_gName.replace(/(^\s*)|(\s*$)/g, "")
        let reg = /[\\/:*?"<>|]/
        if(this.create_gName == '' || this.create_gName.length > 15){
          this.gName_error = this.i18n.gName_length
          return
        }
        if (reg.test(this.create_gName)) {
          this.gName_error = this.i18n.no_special
        }
      },
      update_check () {
        this.updata_gName = this.updata_gName.replace(/(^\s*)|(\s*$)/g, "")
        let reg = /[\\/:*?"<>|]/
        if(this.updata_gName == '' || this.updata_gName.length > 15){
          this.update_error = this.i18n.gName_length
          return
        }
        if (reg.test(this.updata_gName)) {
          this.update_error = this.i18n.no_special
        }
      },
      capacity_check() {
        try {
          this.$nextTick(function () {
            if (!Number.isInteger(this.updata_capacity)) {
              this.$refs.update_capacity.currentValue = Math.floor(this.updata_capacity)
              this.updata_capacity = Math.floor(this.updata_capacity)
            }
          })
        } catch (e) { console.log(e) }
      },
      select_unit() {
        let unit = this.unit
        if (unit == 'G') {
          this.maxCapacity = 2048
          this.minCapacity = Math.ceil(this.useCapacity)
        } else {
          this.maxCapacity = 2
          this.minCapacity = Math.ceil(this.useCapacity/1024)
          this.updata_capacity > 2 && (this.updata_capacity = 2)
        }
      },
    },
    created(){
      this.login_account = JSON.parse(window.localStorage.getItem('loginInfo')).userAccount || ''
      this.getManageList()
    },
    watch: {
      search_gName(){
        this.select_group='';
      },
    },
    mounted(){
      if(this.search_w==='0'){
        this.search_is_hidden = true;
      }
      let elem = this.$refs.groupTable.$vnode.child.$el.childNodes[2]
      let header_elem = this.$refs.groupTable.$vnode.child.$el.childNodes[1]
      header_elem.style.overflow = 'hidden'
      //elem.style.overflowX = 'auto'
      //elem.style.maxHeight=(document.body.clientHeight- 250)+'px'
      this.maxHeight = document.body.clientHeight- 210
      this.left_list_height=document.body.clientHeight - 230

      /*window.onresize=() => {
       let elem = this.$refs.groupTable.$vnode.child.$el.childNodes[2]
       this.maxHeight = document.body.clientHeight- 210
       this.left_list_height=document.body.clientHeight - 230
       }*/
    },
    destroyed() {
      window.onresize = null
    },
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .el-table__header-wrapper
    overflow hidden
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
  .search_user
    height 280px
    margin-top 16px
    max-height 300px
    overflow-x hidden
    overflow-y auto
    box-sizing border-box
    border 1px solid #d1dbe5
    .el-checkbox
      width 100%
      overflow hidden
      margin-left 15px
  .userList
    height 330px
    border 1px solid #d1dbe5
    border-radius 5px
    ul
      overflow-y auto
      height 235px
      li
        padding 5px
        list-style-type none
        text-indent 10px
        color #3aa2eb
    div
      padding 5px
      text-indent 10px
      box-sizing border-box
      border-bottom 1px solid #d1dbe5
  #dialogCreateGroup
    div.hr_wrapper
      height 36px
      line-height 36px
      margin-bottom 12px
      vertical-align top
      >span
        vertical-align top
        display inline-block
  #dialogUpdateGroup
    div.hr_wrapper
      height 36px
      line-height 36px
      margin-bottom 12px
      vertical-align top
      >span
        vertical-align top
        display inline-block
  div.el-input
    margin-bottom 16px
  #GroupManage_box
    height 100%
    overflow hidden
    .content_wrapper
      position relative
      width 100%
      height 100%
      background #fff
      border-radius 8px
      overflow-x auto!important
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
        .group_btns
          text-align left
          margin-left 8px
          margin-bottom 16px
        .group_list
          font-size 14px
          line-height 1.5
          margin-left 8px
          overflow hidden
          overflow-y auto
          user-select:none;
          .group_list_item
            cursor pointer
            margin-left 8px
            width 240px
            >span,i
              vertical-align middle
            span.id
              display inline-block
              width 60px
            span.gName
              display inline-block
              width 80px
              white-space nowrap
              text-overflow ellipsis
              word-break break-all
              overflow hidden
            span.pIcon
              /*color purple*/
              border 1px solid #fff
              border-radius 4px
              padding 3px 4px
              background #00bcd4
              color #fff

            i
              font-size 21px
              margin-right 8px
          .group_list_item:hover,.group_list_item.active
            color #aa3b2d
            line-height 1.5

    .right_wrapper
      position absolute
      right 0px
      top 0px
      bottom 0px
      // 想要的是570  但是左边有316  570+316=886
      .content_wrapper
        .btn_wrapper
          vertical-align top
          padding-bottom 6px
          border-bottom 1px solid #cccccc
        .table_wrapper
          margin-top 12px
          width 100%
</style>
