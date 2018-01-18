<template>
  <div id="GroupManage_box" style="position: relative;">
    <div id="no_allow" v-if="pbAdmin.pb_admin==='3'">
      <div class="content">
        <div class="backBox">
          <a data-v-72b9704a="" onclick="window.history.go(-1)" class="comeback">{{i18n.g.backward}}</a>
        </div>
      </div>
    </div>
    <div v-if="pbAdmin.pb_admin!=='3'" style="position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px;">
      <div id="op_iconbg" :style="op_iconbg_css" style="z-index: 30" @click="search_toggle">
        <i class="iconfont icon-formatindentincrease"></i>
      </div>
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
            <el-button style="vertical-align: middle;height: 33px" type="primary" size="small" icon="iconfont iconfont icon-add" @click="dialogAddMember=true;getAddressbookInit('');" :disabled="groupId_for_members===''">{{__.g.add_user}}</el-button>
            <el-button style="vertical-align: middle;height: 33px" type="primary" size="small" icon="iconfont iconfont icon-yichu" :disabled="groupId_for_members==='' || multipleSelection.length===0" @click="submitDeleteGroupMembers">{{__.g.remove}}</el-button>
            <el-button style="vertical-align: middle;height: 33px" type="primary" size="small" icon="iconfont iconfont icon-shuaxin" @click="submitGroupGetMembers" :disabled="groupId_for_members===''">{{__.g.refresh}}</el-button>
            <div style="float: right; max-width:300px; white-space:nowrap; height: 46px; line-height: 46px; overflow: hidden;  font-size: 13px; font-weight: bold; padding-right: 8px;  vertical-align: bottom;" v-if="groupId_for_members!==''" :title="'ID:'+groupId_for_members+'  '+gName_for_members">
              {{__.GroupManage.current_group}}：<span style="color:#20a0ff;">ID：{{groupId_for_members}} <span style="margin-left: 16px;">{{gName_for_members}}</span></span>
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
              border
              :row-class-name="tableRowClassName"
              style="font-size: 12px">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                :label="__.g.user"
                width="105">
                <template scope="scope">
                  <span :title="scope.row.mName" class="text-over" style="display:inline-block;width: 100%;">{{scope.row.mName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="__.mip"
                width="105">
                <template scope="scope">
                  <span :title="scope.row.mid" class="text-over" style="display:inline-block;width: 100%;">{{scope.row.mid}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="__.g.list">
                <template scope="scope">
                  <el-checkbox checked disabled></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                prop="pb_down"
                :label="__.g.download"
                min-width="90">
                <template scope="scope">
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_down" v-if="scope.row.isMaster!==1 && (pbAdmin.pb_admin!=='0' && !isGruopMaster)" :disabled="scope.row.isAdmin===1"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_down" v-if="scope.row.isMaster!==1 && (pbAdmin.pb_admin==='0' || isGruopMaster)"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" checked disabled  v-if="scope.row.isMaster===1"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                prop="pb_upload"
                :label="__.g.upload">
                <template scope="scope">
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_upload" v-if="scope.row.isMaster!==1 && (pbAdmin.pb_admin!=='0' && !isGruopMaster)" :disabled="scope.row.isAdmin===1"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_upload" v-if="scope.row.isMaster!==1 && (pbAdmin.pb_admin==='0' || isGruopMaster)"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" checked disabled  v-if="scope.row.isMaster===1"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                prop="pb_delete"
                :label="__.g.delete">
                <template scope="scope">
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_delete" v-if="scope.row.isMaster!==1 && (pbAdmin.pb_admin!=='0' && !isGruopMaster)" :disabled="scope.row.isAdmin===1"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_delete" v-if="scope.row.isMaster!==1 && (pbAdmin.pb_admin==='0' || isGruopMaster)"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" checked disabled  v-if="scope.row.isMaster===1"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                prop="pb_rename"
                :label="__.g.rename">
                <template scope="scope">
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_rename" v-if="scope.row.isMaster!==1 && (pbAdmin.pb_admin!=='0' && !isGruopMaster)" :disabled="scope.row.isAdmin===1"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_rename" v-if="scope.row.isMaster!==1 && (pbAdmin.pb_admin==='0' || isGruopMaster)"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" checked disabled  v-if="scope.row.isMaster===1"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                prop="pb_share"
                :label="__.g.share">
                <template scope="scope">
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_share" v-if="scope.row.isMaster!==1 && (pbAdmin.pb_admin!=='0' && !isGruopMaster)" :disabled="scope.row.isAdmin===1"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_share" v-if="scope.row.isMaster!==1 && (pbAdmin.pb_admin==='0' || isGruopMaster)"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" checked disabled  v-if="scope.row.isMaster===1"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                prop="pb_admin"
                :label="__.g.admin">
                <template scope="scope">
                  <el-checkbox v-if="scope.row.mTag===2" disabled></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_admin" v-if="scope.row.mTag===1 && scope.row.isMaster!==1 && pbAdmin.pb_admin!=='0'" :disabled="!isGruopMaster"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" v-model="scope.row.pb_admin" v-if="scope.row.mTag===1 && scope.row.isMaster!==1 && pbAdmin.pb_admin==='0'"></el-checkbox>
                  <el-checkbox @change="checkRow(scope.row)" checked disabled v-if="scope.row.isMaster===1"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                prop="handle_status"
                :label="__.DepartmentList.handle"
                width="105">
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
                  layout="prev, slot, next"
                  :total="right_main_total">
                    <span class="pagination_slot">
                      {{right_main_currentPage1}}
                    </span>
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
            <span>{{__.GroupManage.gName}}：</span>
            <el-input v-model="create_gName" :placeholder="__.g.p_enter_name" style="width: 425px" :maxlength="15" @keydown.enter.native="submitCreateGroup" @change="gName_error=''" @blur="gNameCheck"></el-input>
          </div>
          <div style="padding-left: 80px;color: red">
            {{gName_error}}
          </div>
          <div class="hr_wrapper">
            <span>{{__.GroupManage.gCapacity}}：</span>
            <span style="width: 390px;">
              <div class="block">
                <el-slider
                  :disabled="pbAdmin.pb_admin!=='0'"
                  :min="minCapacity"
                  :max="maxCapacity"
                  v-model="create_capacity"
                  show-input
                  style="display: inline-block;width: 380px;">
                </el-slider>
              </div>
            </span>
            <span style="display: inline-block; font-size: 21px;">G</span>
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
            <span>{{__.GroupManage.gName}}：</span>
            <el-input v-model="updata_gName" :placeholder="__.g.p_enter_name" style="width: 425px" :maxlength="15" @change="update_error=''" @blur="update_check" @keydown.enter.native="submitGroupUpdate"></el-input>
          </div>
          <div style="padding-left: 80px;color: red">
            {{update_error}}
          </div>
          <div class="hr_wrapper">
            <span>{{__.GroupManage.gCapacity}}：</span>
            <span style="width: 390px;">
              <div class="block">
                <el-slider
                  :disabled="pbAdmin.pb_admin!=='0'"
                  :min="minCapacity"
                  :max="maxCapacity"
                  v-model="updata_capacity"
                  show-input
                  style="display: inline-block;width: 380px;">
                </el-slider>
              </div>
            </span>
            <span style="display: inline-block; font-size: 21px;">G</span>
          </div>
          <div class="hr_wrapper">
            {{__.g.Master}}：{{select_group.masterName}}
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
        <el-row>
          <el-col :span="16">
            <div class="form-group">
              <div class="input-group">
                <span v-show="uName" @click="uName='';show_tree=true" style="position: absolute; right: 80px; font-size: 20px; cursor: pointer; top: 5px; color: #bfcbd9;z-index: 100">x</span>
                <input  v-model="uName" type="text" :placeholder="__.g.p_e_mip_a" class="form-control" @keydown.enter="submitSearchUser">
                <span class="input-group-addon btn btn-info" @click="submitSearchUser" :style="{padding:language=='zh'?'6px 22px':'6px 12px'}">{{__.g.search}}</span>
              </div>
            </div>
            <div v-show="show_tree">
              <el-tree
                ref="tree"
                node-key="mid"
                :check-strictly="true"
                :accordion="true"
                :auto-expand-parent="false"
                :expand-on-click-node="false"
                highlight-current
                :render-content="renderContent"
                :data="tree_depart"
                :props="tree_depart_props"
                @check-change="checkChange"
                :load="loadNode"
                lazy
                show-checkbox
                style="height:220px;margin-top: 16px; max-height: 300px;overflow: auto;">
              </el-tree>
            </div>
            <div class="userList resetUserList" v-show="!show_tree">
              <div>
                <div class="item clearFix" :class="index===user_selected?{'userActive':true}:{'userActive':false}" v-for="(item,index) in userList_data" @click="user_selected=index">
                  <div class="item_left"><el-radio class="radio" v-model="user_selected" :label="index"></el-radio></div>
                  <div class="item_right" :title="item.deptName">
                    <div class="name"><i class="iconfont icon-yonghu"></i>{{item.uName}}</div>
                    <div class="department">{{item.deptName}}</div>
                  </div>
                </div>
              </div>
              <div v-show="userList_data.length==0">
                {{i18n.no_search_user}}
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <ul>
              <li v-for="e in treeResult">
                {{e.label}}
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
        tree: {},
        treeResult: [],
        node: null,
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
        'maxCapacity':30,
        'create_gName':'',
        'create_capacity':5,
        'updata_gName':'',
        'updata_capacity':5,
        'select_group':'',
        'uName':'',
        'userList_data':[],
        'user_selected':'',
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
        userMap: {}
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
      renderContent(h, { node, data, store }) {
      return (
        <span class={data.mTag===2?'deptNode':''}>
        {data.mTag===2
          ?<i class="iconfont icon-fangzi" style="color:#109410;margin:0px 3px;"></i>
          :<i class="iconfont icon-yonghu" style="color:#094caf;margin:0px 3px;"></i>}
          {node.label}
      </span>
      )

      /*let users = []
      let checkUser = (e) => {
        e.preventDefault()
        console.log(e)
        let i = users.indexOf(mid)
        if (i == -1) {
          users.push(mid)
        } else {
          users.splice(i, 1)
        }
        return i == -1
      }*/
        /*return (
          <span>{data.mTag ==2
            ? <span><i class="iconfont icon-fangzi" style="color:#109410;margin:0px 3px;"></i>{node.label}</span>
            : <label class="el-checkbox">
              <span class={ "el-checkbox__input"} onClick={checkUser}><span class="el-checkbox__inner"></span><input type="checkbox" class="el-checkbox__original"/></span><span class="el-checkbox__label">
                <i class="iconfont icon-yonghu" style="color:#094caf;margin:0px 3px;"></i>
                {node.label}
              </span>
              </label>}
          </span>
        )*/
      },
      checkChange (data, checked, indeterminate) {
        try {
          let tree = this.tree
          this.findNode(tree, data.mid)
          let node = this.node
          if (node.childNodes) {
            if (!node.indeterminate) {
              this.trimChild(node, checked)
            }
          }
          if (node.parent) {
            this.trimParent(node)
          }
          this.treeResult = []
          this.getResult(this.tree)
        } catch (e) { console.log(e) }
      },
      findNode(tree, mid) {
        if ((tree[0] && tree[0].mid == mid) || (tree.data && tree.data.mid == mid)) {
          this.node = tree
          return
        }
        if (tree.childNodes) {
          let childNodes = tree.childNodes
          for (let i = 0; i < childNodes.length; i += 1) {
            if (childNodes[i].data.mid == mid) {
              this.node = childNodes[i]
              return
            }
            if (childNodes[i].childNodes) {
              this.findNode(childNodes[i], mid)
            }
          }
        }
      },
      trimParent(p) {
        let bool = false
        let parent = p.parent
        let childNodes = parent.childNodes
        for (let i = 0; i < childNodes.length; i += 1) {
          if (childNodes[i].checked == false) {
            parent.checked = false
            bool = true
          } else {
            parent.indeterminate = true
          }
        }
        if (!bool) {
          parent.checked = true
          parent.indeterminate = false
        }
        if (parent.parent) {
          this.trimParent(parent)
        }
      },
      trimChild(p, checked) {
        let childNodes = p.childNodes
        for (let i = 0; i < childNodes.length; i += 1) {
          childNodes[i].checked = checked
          if (childNodes[i].childNodes) {
            this.trimChild(childNodes[i], checked)
          }
        }
      },
      getResult(tree) {
        if (tree.childNodes) {
          let childNodes = tree.childNodes
          for (let i = 0; i < childNodes.length ; i += 1) {
            if (childNodes[i].checked) {
              this.treeResult.push(childNodes[i])
            } else {
              if (childNodes[i].childNodes) {
                this.getResult(childNodes[i])
              }
            }
          }
        }
      },
      right_main_handleCurrentChange(val){
        this.$refs.groupTable.$vnode.child.$el.childNodes[2].scrollTop=0;
        this.right_main_currentPage1=val;
      },
      loadNode(node, resolve) {
        if (node.level == 1) {
          this.tree = node
        }
        let that = this;
        if(node.level!==0){
          if(node.data.mTag===2){
            let Params={'deptId':node.data.mid,token:that.token};
            requestGetAddressbook(Params).then(data => {
              if(data.errorCode === "200"){
                resolve(data.result);
                if (node.checked) {
                  let childNodes = node.childNodes
                  for (let i = 0; i < childNodes.length; i += 1) {
                    childNodes[i].checked = true
                  }
                }
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
      addMaster(){
        let that = this;
        let groupId = this.groupId_for_members;
        let mid = this.userList_data[that.user_selected].uid;
        let mName = this.userList_data[that.user_selected].uName;
        let mList = [];
        if(this.table_members[0].mid===JSON.parse(window.localStorage.getItem('loginInfo')).uid){
          mList = [{
            "mid":mid,
            "mName":mName,
            "pb_list":"1",
            "pb_view":"1",
            "pb_down":"1",
            "pb_upload":"1",
            "pb_delete":"1",
            "pb_rename":"1",
            "pb_share":"1",
            "isAdmin":that.add_admin_checked?"1":"2",
            "mTag":"1"
          }]
        }else{
          mList = [{
            "mid":mid,
            "mName":mName,
            "pb_list":"1",
            "pb_view":"1",
            "pb_down":"1",
            "pb_upload":"1",
            "pb_delete":"1",
            "pb_rename":"1",
            "pb_share":"1",
            "isAdmin":"2",
            "mTag":"1"
          }]
        }
        let token = this.token;
        let Params = {groupId,mList,token};
        requestAddGroupMember(Params).then(data => {
          if(data.errorCode === "200"){
            that.getGroupMembers();
            that.dialogAddMember=false;
            that.uName='';
            that.userList_data=[];
            that.user_selected='';
            that.msg('success', that.__.GroupManage.add_group_member_s)
          }else{
            throw "错误定位：群主管理_添加成员   errorCode:"+data.errorCode
          }
        });
      },
      submitAddMaster(){
        let that = this;
        if(!this.show_tree){
          if(this.user_selected===''){
            this.msg('warning', this.__.GroupManage.s_user_f)
          }else{
            let res=this.table_members.some(function(item){
              return item.mid===that.userList_data[that.user_selected].uid;
            });
            if(res){
              this.msg('warning', this.__.g.isExist)
            }else{
              this.addMaster();
            }
          }
        }else{
          let len=this.$refs.tree.getCheckedNodes().length;
          if(len===0){
            this.$notify({
              title: this.__.g.warning,
              message: this.__.GroupManage.s_user_or_dp_f,
              offset: 100,
              type:'warning'
            })
          }else{
            let arr=[];
            this.$refs.tree.getCheckedNodes().forEach((item) => {
              let uid=item.mid;
              let res=this.table_members.some(function(item){
                return item.mid===uid;
              });
              if(!res){
                arr.push(item);
              }
            });
            if(arr.length===0){
              this.$notify({
                title: this.__.g.warning,
                message: this.__.g.isExist,
                offset: 100,
                type:'warning'
              });
              return ;
            }
            let promises = arr.map((item) => {
              return new Promise((resolve,reject) => {
                let groupId = this.groupId_for_members;
                let mList = [{
                  "mid":item.mid,
                  "mName":item.mName,
                  "pb_list":"1",
                  "pb_view":"1",
                  "pb_down":"1",
                  "pb_upload":"1",
                  "pb_delete":"1",
                  "pb_rename":"1",
                  "pb_share":"1",
                  "isAdmin":"2",
                  "mTag":item.mTag.toString()
                }]
                let token = this.token;
                let Params = {groupId,mList,token};
                requestAddGroupMember(Params).then(data => {
                  if(data.errorCode === "200"){
                    resolve('0');
                  }else{
                    reject('1');
                    throw "错误定位：群主管理_添加成员_通讯录方式添加   errorCode:"+data.errorCode
                  }
                });
              })
            });
            Promise.all(promises).then((res) => {
              that.getGroupMembers();
              let count = 0;
              res.forEach((item) => {
                if(item==='0'){
                  count++;
                }
              });
              that.msg('success', that.__.GroupManage.add_txl_s_head+count+that.__.GroupManage.add_txl_s_foot)
              that.$refs.tree.setCheckedKeys([]);
              that.dialogAddMember=false;
            }).catch(
            );
          }
        }
      },
      getAddressbookInit(id){
        let that=this;
        let Params={'deptId':id,token:that.token};
        requestGetAddressbook(Params).then(data => {
          if(data.errorCode === "200"){
            that.tree_depart = data.result;
            that.tree = that.tree_depart
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
            that.userList_data=data.result;
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
        let that=this;
        let groupId=this.groupId_for_members;
        let token=this.token;
        requestGroupGetMembers({groupId,token}).then(data => {
          if(data.errorCode === "200"){
            that.right_main_total=data.result.length;
            that.table_members=data.result;
            that.loading_for_GroupManage=false;
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
        let that = this;
        let Params={'groupId':this.select_group.groupId,'gName':this.updata_gName,'capacity':this.updata_capacity,'token':this.token};
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
        $('.v-modal').hide();
      },
      closeMemberDialog () {
        $('.v-modal').hide();
        this.dialogAddMember = false
        this.uName = ""
        this.userList_data = []
        this.user_selected = ""
        this.users = []
        this.userMap = {}
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
      }
    },
    created(){
      (this.pbAdmin.pb_admin!=='3')&&(this.getManageList());
    },
    watch: {
      search_gName(){
        this.select_group='';
      }
    },
    mounted(){
      if(this.search_w==='0'){
        this.search_is_hidden = true;
      }
      if(this.pbAdmin.pb_admin!=='3'){
        let elem = this.$refs.groupTable.$vnode.child.$el.childNodes[2];
        elem.style.maxHeight=(document.body.clientHeight- 250)+'px'
        this.left_list_height=document.body.clientHeight - 230

        window.onresize=() => {
          let elem = this.$refs.groupTable.$vnode.child.$el.childNodes[2]
          elem.style.maxHeight=(document.body.clientHeight - 250)+'px'
          this.left_list_height=document.body.clientHeight - 230
        }
      }
    },
    destroyed() {
      window.onresize = null
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

  .userList
    height 300px
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
        width 500px
        .name>i
          margin-right 8px
        .department
          white-space nowrap
          text-overflow ellipsis
          word-break break-all
          overflow hidden
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
      font-size 12px
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
      overflow-y auto
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
          min-width 990px
</style>
