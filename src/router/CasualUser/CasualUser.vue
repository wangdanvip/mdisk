<template>
  <div id="CasualUser_box" style="position: relative;">
    <!--<div id="no_allow" v-if="!isDeptAdmin">
      <div class="content">
        <div class="backBox">
          <a data-v-72b9704a="" onclick="window.history.go(-1)" class="comeback">{{i18n.g.backward}}</a>
        </div>
      </div>
    </div>-->
    <div class="main_wrapper" style="position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px;">
      <div class="content_wrapper wrap_shoadow">
        <div class="btn_wrapper">
          <el-button type="primary" size="small" icon="iconfont iconfont icon-add" @click="showAddDialog">{{__.g.add}}</el-button>
          <el-button type="primary" size="small" icon="iconfont iconfont icon-iconfontsuoding" @click="submitLockCasualUsers">{{__.CasualUser.lock_user}}</el-button>
          <el-button type="primary" size="small" icon="iconfont iconfont icon-jiesuo" @click="submitUnlockCasualUsers">{{__.CasualUser.unlock_user}}</el-button>
          <el-button type="primary" size="small" icon="iconfont iconfont icon-shanchu" @click="submitDeleteCasualUsers">{{__.g.delete}}</el-button>
          <el-button type="primary" size="small" icon="iconfont iconfont icon-shuaxin" @click="submitRefresh">{{__.g.refresh}}</el-button>

          <div class="el-input el-input--small" style="display: inline-block; width: 300px; float: right; position: relative;">
            <i class="el-input__icon el-icon-search" style="cursor: pointer" @click="submitSearchUser"></i>
            <div v-if="searchName!==''" style="position: absolute; right: 30px; top: 2px; font-size: 20px; color:#bfcbd9; cursor: pointer;" @click="clearSearchName">
              x
            </div>
            <input type="text" :placeholder="__.UserList.search_user_place" autocomplete="off" class="el-input__inner" v-model="searchName" @keydown.enter="submitSearchUser"/>
          </div>

        </div>
        <div class="table_wrapper">
          <!--暂时去掉表格遮罩效果
            v-loading="loading_for_CasualList"-->
          <el-table
            id="casualTabel"
            :data="tableUserListForPages"
            ref="groupTable"
            @selection-change="handleSelectionChange"
            border
            style="width: 100%;overflow: visible;"
            :row-class-name="tableRowClassName">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="name"
              :label="__.UserList.user_name"
              width="150">
              <template scope="scope">
                <span class="text-over" style="width: 100%;display: inline-block" :title="scope.row.name">{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="account"
              :label="__.UserList.login_name"
              width="150">
              <template scope="scope">
                <span class="text-over" style="width: 100%;display: inline-block" :title="scope.row.account">{{scope.row.account}}</span>
              </template>
            </el-table-column>
            <el-table-column
            :label="__.CasualUser.permission">
            <template scope="scope">
              <span :title="trim(scope.row.pb)" class="text-over" style="display: inline-block;width: 100%">{{trim(scope.row.pb)}}</span>
            </template>
          </el-table-column>
            <el-table-column
              prop="creater"
              :label="__.creator"
              width="150">
            </el-table-column>
            <el-table-column
              :render-header="reder_head"
              :label="__.DepartmentList.status"
              label-class-name="filter"
              width="126">
              <template scope="scope">
                <span v-if="scope.row.status==='0'">{{__.g.normal}}</span>
                <span v-if="scope.row.status==='1'">{{__.g.Lock}}</span>
                <span v-if="scope.row.status==='2'">{{__.g.due}}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="170"
              :label="__.CasualUser.r_time">
              <template scope="scope">
                <span>{{scope.row.validdate | calValidDate}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="handle_status"
              :label="__.DepartmentList.handle"
              :width="language == 'zh' ? 120 : 190"
              align="center"
              @click="handleEdit(scope.$index, scope.row)">
              <template scope="scope">
                <el-tooltip placement="bottom" effect="light" class="test">
                  <div slot="content">
                    <div class="casualTooltip">
                      <div @click="dialogEditClick('1',scope.row.casualId)">{{i18n.account_detial}}</div>
                      <div @click="dialogEditClick('2',scope.row.casualId)">{{i18n.change_r_time}}</div>
                      <div @click="dialogEditClick('3',scope.row.casualId)">{{i18n.change_space}}</div>
                      <div @click="dialogEditClick('4',scope.row.casualId)">{{i18n.change_auth}}</div>
                      <div v-if="scope.row.status==='0'" @click="dialogEditClick('51',scope.row.casualId,scope.row.deptId,scope.row.account)">{{__.g.Lock}}</div>
                      <div v-if="scope.row.status==='1'" @click="dialogEditClick('52',scope.row.casualId,scope.row.deptId,scope.row.account)">{{__.g.Unlock}}</div>
                      <div @click="dialogEditClick('6',scope.row.casualId)">{{i18n.reset_pwd}}</div>
                      <div @click="dialogEditClick('7',scope.row.casualId,scope.row.deptId, scope.row.account)">{{__.g.delete}}</div>
                    </div>
                  </div>
                  <i class="iconfont icon-chilun" style="font-size: 20px; cursor: pointer;"></i>
                </el-tooltip>
                <!--<div @mouseleave="actionIndex=null" style="position: relative">
                  <i class="iconfont icon-chilun" @click="actionIndex=scope.$index" style="font-size: 20px; cursor: pointer;"></i>
                  <div class="casualTooltip" v-show="actionIndex==scope.$index">
                    <div @click="dialogEditClick('1',scope.row.casualId)">{{i18n.account_detial}}</div>
                    <div @click="dialogEditClick('2',scope.row.casualId)">{{i18n.change_r_time}}</div>
                    <div @click="dialogEditClick('3',scope.row.casualId)">{{i18n.change_space}}</div>
                    <div @click="dialogEditClick('4',scope.row.casualId)">{{i18n.change_auth}}</div>
                    <div v-if="scope.row.status==='0'" @click="dialogEditClick('51',scope.row.casualId,scope.row.deptId,scope.row.account)">{{__.g.Lock}}</div>
                    <div v-if="scope.row.status==='1'" @click="dialogEditClick('52',scope.row.casualId,scope.row.deptId,scope.row.account)">{{__.g.Unlock}}</div>
                    <div @click="dialogEditClick('6',scope.row.casualId)">{{i18n.reset_pwd}}</div>
                    <div @click="dialogEditClick('7',scope.row.casualId,scope.row.deptId, scope.row.account)">{{__.g.delete}}</div>
                  </div>
                </div>-->
              </template>
            </el-table-column>
          </el-table>
          <div>
            <div class="block" style="margin-top: 12px; text-align: right;margin-right:36px;">
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
      <!--添加临时用户-->

      <el-dialog id="addCasualUser" size="tiny" :title="__.CasualUser.addCasualUser" v-model="dialogAddMember" :close-on-click-modal="false" @open="openLog" @close="closeLog" class="dialogAddMember">
        <span class="pageBox" style="clear: both;">
          <div class="page_01" v-if="dialogAddMember_step===1">
            <div>
              <span class="red">*</span>{{i18n.UserList.user_name + i18n.colon}}
              <div class="input_wrapper">
                <el-input v-model="name" size="small" :placeholder="i18n.name_placeholder" style="width: 410px;" @change="addNameChange" @blur="addNameBlur"></el-input>
              </div>
            </div>
            <div v-if="name_state==='2'">
              <div class="input_wrapper">
                <span class="red">{{i18n.name_required}}</span>
              </div>
            </div>
            <div>
              <span class="red">*</span>{{i18n.origin_account + i18n.colon}}
              <div class="input_wrapper">
                <el-input v-model="account" size="small" :placeholder="i18n.account_placeholder" style="width: 410px;" :maxlength="15" @keyup.native="only_num_az" @change="addAccountChange" @blur="addAccountBlur"></el-input>
              </div>
            </div>
            <div v-if="account_state==='2'">
              <div class="input_wrapper">
                <span class="red">{{i18n.account_illegal}}</span>
              </div>
            </div>
            <div v-if="account_state=='4'">
              <div class="input_wrapper">
                <span class="red">{{i18n.account_existed}}</span>
              </div>
            </div>
            <div>
              <span class="red">*</span>{{i18n.origin_pwd + i18n.colon}}
              <div class="input_wrapper">
                <el-input v-model="password" size="small" :placeholder="i18n.pwd_placeholder" style="width: 410px;" :maxlength="15" @keyup.native="only_num_az" @change="addPwChange" @blur="addPwBlur"></el-input>
              </div>
            </div>
            <div v-if="pw_state==='2'">
              <div class="input_wrapper">
                <span class="red">{{i18n.pwd_illegal}}</span>
              </div>
            </div>
            <div>
              <span class="red">*</span>{{i18n.valid_period + i18n.colon}}
              <div class="input_wrapper">
                <el-input-number ref="period"  @change="addPeriodKU('period')" @afterpaste.native="addPeriodAfp" v-model="period" :min="period_min" :max="period_max" size="small" style="width: 160px;"></el-input-number>
                <select v-model="unit" class="select" style="height: 32px;">
                  <option value="0">{{i18n.day}}</option>
                  <option value="1">{{i18n.mouth}}</option>
                </select>
              </div>
            </div>
            <div>
              <span class="red">*</span>{{i18n.storage + i18n.colon}}
              <div class="input_wrapper">
                <el-input-number ref="capacity" @change="addPeriodKU('capacity')" @afterpaste.native="addPeriodAfp" v-model="capacity" :min="1" :max="10" size="small" style="width: 160px;"></el-input-number>
                <span style="vertical-align: top; font-size: 16px;">G</span>
              </div>
            </div>
            <div class="no_require">
              <span class="red">*</span>{{i18n.mail + i18n.colon}}
              <div class="input_wrapper">
                <el-input v-model="mail" size="small" :placeholder="i18n.mail_placeholder" style="width: 410px;" @change="addMailChange" @blur="addMailBlur"></el-input>
              </div>
            </div>
            <div v-if="mail_state==='2'">
              <div class="input_wrapper">
                <span class="red">{{i18n.mail_illegal}}</span>
              </div>
            </div>
            <div class="no_require">
              <span class="red">*</span>{{i18n.phone + i18n.colon}}
              <div class="input_wrapper">
                <el-input v-model="mobile" size="small" :placeholder="i18n.phone_placeholder" style="width: 410px;"></el-input>
              </div>
            </div>
            <div class="no_require">
              <span class="red">*</span>{{i18n.check + ' ' + i18n.CasualUser.permission + i18n.colon}}<br/>
            </div>
            <div class="no_require" style="clear: both; height: 30px;">
              <span class="red">*</span>
              <el-checkbox v-model="upload">{{i18n.g.upload}}</el-checkbox>
              <el-checkbox v-model="down">{{i18n.g.download}}</el-checkbox>
              <el-checkbox v-model="share">{{i18n.g.share}}</el-checkbox>
              <el-checkbox v-model="rename">{{i18n.g.rename}}</el-checkbox>
              <!--<el-checkbox v-model="view">{{i18n.g.preview}}</el-checkbox>-->
              <el-checkbox v-model="move">{{i18n.g.move}}</el-checkbox>
              <el-checkbox v-model="copy">{{i18n.g.copy}}</el-checkbox>
              <el-checkbox v-model="delete_pb">{{i18n.g.delete}}</el-checkbox>
            </div>
          </div>
          <div class="page_02" v-if="dialogAddMember_step===2">
            <!--部门管理员界面-->
            <div>
              <div style="margin-bottom: 8px;">
                <span style="display: inline-block;padding: 4px 0px;">{{__.g.selected}}：</span>
                <span v-if="AddSelectedDeptName!==''" style="background-color: rgb(18, 135, 221); color: rgb(255, 255, 255); display: inline-block; padding: 4px 8px; border-radius: 6px;">
                  {{AddSelectedDeptName}}   <span @click="clearAddSelectedDept" style="margin-left: 16px; cursor: pointer; display: inline-block;">x</span>
                </span>
              </div>
              <div class="el-input">
                <i class="el-input__icon el-icon-search" style="cursor: pointer;" @click="submitSearchDept"></i>
                <span v-if="filterText_admin" @click="clearFilterText_admin" style="position: absolute; right: 30px; font-size: 20px; cursor: pointer; top: 2px; color: #bfcbd9;">x</span>
                <input type="text" :placeholder="__.DepartmentList.search_placeholder" autocomplete="off" class="el-input__inner" v-model="filterText_admin" @keydown.enter="submitSearchDept">
              </div>
              <!--普通部门管理员看到的树节点-->
              <el-tree :data="tree_search"
                       v-if="pbAdmin.pb_admin!=='0'"
                       v-show="search_depts_admin_ing===false"
                       ref="casualUser_tree"
                       :filter-node-method="filterNode"
                       @node-click="AddTree_nc"
                       :empty-text="__.g.loading"
                       :check-strictly="true"
                       :default-expand-all="true"
                       node-key="deptId"
                       :props="tree_defaultProps"
                       :render-content="renderContent"
                       highlight-current
                       style="overflow-y:auto; min-height: 220px; max-height: 340px;margin-top: 16px;">
              </el-tree>
              <!--超级管理员界面-->
              <el-tree :data="tree_search"
                       v-if="pbAdmin.pb_admin==='0'"
                       v-show="search_depts_admin_ing===false"
                       :empty-text="__.g.loading"
                       :check-strictly="true"
                       :expand-on-click-node="false"
                       node-key="mid"
                       :render-content="renderContent_admin"
                       :props="tree_defaultProps_admin"
                       :load="loadNode"
                       lazy
                       @node-click="add_tree_nc_admin"
                       highlight-current
                       style="overflow-y:auto; min-height: 220px; max-height: 340px;margin-top: 16px;">
                </el-tree>
                <div v-show = "search_depts_admin_ing===true" style="margin-top: 16px;height: 220px; max-height: 300px;overflow-y: auto;overflow-x: hidden;border: 1px solid #d1dbe5">
                  <div v-if="search_depts_admin.length == 0">
                    {{__.g.no_data}}
                  </div>
                  <div v-if="search_depts_admin.length != 0">
                    <div v-for="item in search_depts_admin" style="cursor: pointer;" @click="setDept(item.deptName,item.deptId)">
                      <i class="iconfont icon-fangzi" style="color: rgb(16, 148, 16); margin: 0px 6px;"></i>
                      <span :style="item.deptId===deptId?{'color':'#cf6216'}:{}">{{item.deptName}}</span>
                      <span :title="item.parentName" :style="item.deptId==deptId?{'color':'#cf6216'}:{}" class="text-over" style="display:inline-block;width:100%">{{item.parentName}}</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </span>
        <span slot="footer" class="dialog-footer clearFix">
          <div v-if="dialogAddMember_step===1">
            <el-button type="primary" @click="next">{{__.g.next_step}}</el-button>
            <el-button @click="dialogAddMember=false">{{__.g.close}}</el-button>
          </div>
          <div v-if="dialogAddMember_step===2">
            <el-button type="primary" @click="dialogAddMember_step=1">{{__.g.backward}}</el-button>
            <el-button :disabled="!dialogAddMember_CanCreated" type="primary" @click="submitAddCasual">{{__.g.sure_q}}</el-button>
          </div>
        </span>
      </el-dialog>

      <el-dialog size="tiny" :title="dialogEditTitle" v-model="dialogEditMember" :close-on-click-modal="false" @open="openLog" @close="closeLog" class="dialogEditMember">
        <span class="pageBox">
          <div v-if="dialogEdit_state==='1'">
              <div style="width: 100%;" id="dialogEdit_state_01">
                <div class="dialogEdit_state_01_two" :title="dialogEditDate.name">{{i18n.UserList.user_name + i18n.colon}}<span>{{dialogEditDate.name}}</span></div>
                <div class="dialogEdit_state_01_two">{{i18n.mail + i18n.colon}}<span>{{dialogEditDate.mail}}</span></div>
                <div class="dialogEdit_state_01_two">{{i18n.origin_account + i18n.colon}}<span>{{dialogEditDate.account}}</span></div>
                <div class="dialogEdit_state_01_two">{{i18n.phone + i18n.colon}}<span>{{dialogEditDate.mobile}}</span></div>
                <div class="dialogEdit_state_01_single">{{i18n.origin_pwd + i18n.colon}}<span>{{dialogEditDate.password}}</span>
                  <i class="iconfont icon-bianji" @click="dialogEditTitle=i18n.reset_pwd,dialogEdit_state='6'" style="cursor: pointer; font-size: 21px; color:#20a0ff"></i>
                </div>
                <div class="dialogEdit_state_01_single">{{i18n.expire_date + i18n.colon}}<span>{{dialogEditDate.period}}</span>
                  <i class="iconfont icon-bianji" @click="dialogEditTitle=i18n.change_r_time,dialogEdit_state='2'" style="cursor: pointer; font-size: 21px; color:#20a0ff"></i>
                </div>
                <div class="dialogEdit_state_01_single">{{i18n.storage + i18n.colon}}<span>{{dialogEditDate.capacity}}G</span>
                  <i class="iconfont icon-bianji" @click="dialogEditTitle=i18n.change_space,dialogEdit_state='3'" style="cursor: pointer; font-size: 21px; color:#20a0ff"></i>
                </div>
                <div class="dialogEdit_state_01_single">{{i18n.CasualUser.permission + i18n.colon}}<span>{{dialogEdit_pb_text}}</span>
                  <i class="iconfont icon-bianji" @click="dialogEditTitle=i18n.change_auth,dialogEdit_state='4'" style="cursor: pointer; font-size: 21px; color:#20a0ff"></i>
                </div>
                <div class="dialogEdit_state_01_single">{{i18n.DepartmentList.belongs_to_depart + i18n.colon}}<span>{{dialogEditDate.deptName}}</span>
                  <i class="iconfont icon-bianji" @click="dialogEditTitle=i18n.change_dept,dialogEdit_state='8',AddSelectedDeptName=dialogEditDate.deptName,deptId=dialogEditDate.deptId" style="cursor: pointer; font-size: 21px; color:#20a0ff"></i>
                </div>
                <div style="clear: both;"></div>
              </div>
          </div>

          <div v-if="dialogEdit_state==='2'">
            <div>{{i18n.valid_period + i18n.colon}}
              <div style="display: inline-block; width: 370px; line-height: 30px; margin-bottom: 21px;">
                {{dialogEditDate.period}}
              </div>
            </div>
            <div style="line-height: 30px;">{{i18n.alter + i18n.colon}}
              <div style="display: inline-block; width: 370px; line-height: 30px; vertical-align: top;">
                <el-input-number ref="period"  @change="addPeriodKU('period')" @afterpaste.native="addPeriodAfp" v-model="period" :min="period_min" :max="period_max" size="small" style="width: 160px;"></el-input-number>
                <select v-model="unit" class="select" style="height: 32px">
                  <option value="0">{{i18n.day}}</option>
                  <option value="1">{{i18n.mouth}}</option>
                </select>
              </div>
            </div>
          </div>

          <div v-if="dialogEdit_state==='3'">
            <div style="line-height: 30px; margin-bottom: 16px;">{{i18n.current_storage + i18n.colon}}
              <div style="display: inline-block; width: 370px; line-height: 30px; vertical-align: top;">
                {{dialogEditDate.capacity}}
                <span style="vertical-align: top;">G</span>
              </div>
            </div>
            <div style="line-height: 30px;">{{i18n.storage + i18n.colon}}
              <div style="display: inline-block; width: 370px; line-height: 30px; vertical-align: top;">
                <el-input-number ref="capacity"  @change="addPeriodKU('capacity')" @afterpaste.native="addPeriodAfp" v-model="capacity" :min="1" :max="10" size="small" style="width: 160px;"></el-input-number>
                <!--<el-input-number v-model="capacity" @change="handleChange" :min="1" :max="10"></el-input-number>-->
                <span style="vertical-align: top;">G</span>
              </div>
            </div>
          </div>

          <div v-if="dialogEdit_state==='4'">
            <div style="margin-bottom: 16px;">
              {{i18n.check + ' ' + i18n.CasualUser.permission + i18n.colon}}<br/>
            </div>
            <div class="no_require">
              <el-checkbox v-model="upload">{{i18n.g.upload}}</el-checkbox>
              <el-checkbox v-model="down">{{i18n.g.download}}</el-checkbox>
              <el-checkbox v-model="share">{{i18n.g.share}}</el-checkbox>
              <el-checkbox v-model="rename">{{i18n.g.rename}}</el-checkbox>
              <!--<el-checkbox v-model="view">{{i18n.g.preview}}</el-checkbox>-->
              <el-checkbox v-model="move">{{i18n.g.move}}</el-checkbox>
              <el-checkbox v-model="copy">{{i18n.g.copy}}</el-checkbox>
              <el-checkbox v-model="delete_pb">{{i18n.g.delete}}</el-checkbox>
            </div>
          </div>

          <div v-if="dialogEdit_state==='6'">
            <div><span style="display: inline-block;width: 110px">{{i18n.new_pwd + i18n.colon}}</span>
              <div style="display: inline-block; width: 370px; line-height: 30px; margin-bottom: 21px;">
                <el-input :maxlength="15" @keyup.native="only_num_az" :placeholder="i18n.pwd_placeholder" size="small" v-model="pw1"></el-input>
              </div>
            </div>
            <div><span style="display: inline-block;width: 110px">{{i18n.confirm_pwd + i18n.colon}}</span>
              <div style="display: inline-block; width: 370px; line-height: 30px;">
                <el-input :maxlength="15" @keyup.native="only_num_az" :placeholder="i18n.confirm_pwd" size="small" v-model="pw2"></el-input>
              </div>
            </div>
          </div>

          <div v-if="dialogEdit_state==='8'">
            <div>
              <div style="margin-bottom: 8px;">
                <span style="display: inline-block;padding: 4px 0px;">{{__.g.selected}}：</span>
                <span v-if="AddSelectedDeptName!==''" style="background-color: rgb(18, 135, 221); color: rgb(255, 255, 255); display: inline-block; padding: 4px 8px; border-radius: 6px;">
                  {{AddSelectedDeptName}}   <span @click="clearAddSelectedDept" style="margin-left: 16px; cursor: pointer; display: inline-block;">x</span>
                </span>
              </div>
              <div class="el-input">
                <i class="el-input__icon el-icon-search" style="cursor: pointer;" @click="submitSearchDept"></i>
                <span v-if="filterText_admin" @click="clearFilterText_admin" style="position: absolute; right: 30px; font-size: 20px; cursor: pointer; top: 2px; color: #bfcbd9;">x</span>
                <input type="text" :placeholder="__.DepartmentList.search_placeholder" autocomplete="off" class="el-input__inner" v-model="filterText_admin" @keydown.enter="submitSearchDept">
              </div>
              <!--普通部门管理员看到的树节点-->
              <el-tree :data="tree_search"
                       v-if="pbAdmin.pb_admin!=='0'"
                       v-show="search_depts_admin_ing===false"
                       ref="casualUser_tree"
                       :filter-node-method="filterNode"
                       @node-click="AddTree_nc"
                       :empty-text="__.g.loading"
                       :check-strictly="true"
                       :default-expand-all="true"
                       :expand-on-click-node="false"
                       node-key="deptId"
                       :props="tree_defaultProps"
                       :render-content="renderContent"
                       highlight-current
                       style="overflow-y:auto; min-height: 220px; max-height: 340px;margin-top:16px;">
              </el-tree>
              <!--超级管理员看到的树节点-->
              <el-tree :data="tree_search"
                       v-if="pbAdmin.pb_admin==='0'"
                       v-show="search_depts_admin_ing===false"
                       :empty-text="__.g.loading"
                       :check-strictly="true"
                       :expand-on-click-node="false"
                       node-key="mid"
                       :render-content="renderContent_admin"
                       :props="tree_defaultProps_admin"
                       :load="loadNode"
                       lazy
                       @node-click="add_tree_nc_admin"
                       highlight-current
                       style="overflow-y:auto; min-height: 220px; max-height: 340px;margin-top:16px;">
                </el-tree>
                <div v-if="search_depts_admin_ing===true" style="margin-top: 16px;height: 220px; max-height: 300px;overflow-y: auto;overflow-x: hidden;border: 1px solid #d1dbe5">
                  <div v-if="search_depts_admin.length===0" style="margin-top: 12px;">
                    {{__.g.no_data}}
                  </div>
                  <div v-if="search_depts_admin.length!==0">
                    <div v-for="item in search_depts_admin" style="cursor: pointer;" @click="setDept(item.deptName,item.deptId)">
                      <i class="iconfont icon-fangzi" style="color: rgb(16, 148, 16); margin: 0px 6px;"></i>
                      <span :style="item.deptId===deptId?{'color':'#cf6216'}:{}">{{item.deptName}}</span>
                      <span :title="item.parentName" :style="item.deptId==deptId?{'color':'#cf6216'}:{}" class="text-over" style="display:inline-block;width:100%">{{item.parentName}}</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </span>
        <span slot="footer" class="dialog-footer clearFix">
          <div v-if="dialogEdit_state==='1'">
            <el-button  @click="dialogEditMember=false">{{__.g.close}}</el-button>
          </div>

          <div v-if="dialogEdit_state==='2'">
            <el-button  type="primary" @click="updatePeriod">{{__.g.save}}</el-button>
            <el-button  @click="dialogEditMember=false">{{__.g.close}}</el-button>
          </div>

          <div v-if="dialogEdit_state==='3'">
            <el-button  type="primary" @click="updateCapacity">{{__.g.save}}</el-button>
            <el-button  @click="dialogEditMember=false">{{__.g.close}}</el-button>
          </div>

          <div v-if="dialogEdit_state==='4'">
            <el-button  type="primary" @click="updatePb">{{__.g.save}}</el-button>
            <el-button  @click="dialogEditMember=false">{{__.g.close}}</el-button>
          </div>

          <div v-if="dialogEdit_state==='6'">
            <el-button  :disabled="!dialogEdit_state_6_isOk" type="primary" @click="updatePw">{{__.g.save}}</el-button>
            <el-button  @click="dialogEditMember=false">{{__.g.close}}</el-button>
          </div>

          <div v-if="dialogEdit_state==='8'">
            <el-button :disabled="!dialogEdit_state_8_isOk" type="primary" @click="updateDept">{{__.g.save}}</el-button>
            <el-button  @click="dialogInit">{{__.g.close}}</el-button>
          </div>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapActions} from 'vuex'
  import { requestGetCasualList,requestAccountIsExist,requestGetDepartManageList,requestAddCasual,requestCasualLock,requestCasualUnlock,requestDeleteCasual,requestGetAddressbook_nouser,requestDeptSearchManage,requestGetCasualDetail,requestUpdatePw,requestUpdatePeriod,requestUpdateCapacity,requestUpdatePb,requestUpdateDept } from 'common/api/api'
  import $ from 'common/js/jquery-vendor.js'
  import lang from 'src/lang.json'

  export default {
    data(){
      return ({
        'show_filter':false,
        'node_list':[],
        'dialogEditMember':false,
        'dialogEditTitle':'',
        'dialogEdit_state':'1',
        'dialogEditDate':'',
        'pw1':'',
        'pw2':'',
        // 添加临时用户数据
        'dialogAddMember':false,
        'dialogAddMember_step':1,
        // 添加临时用户成员
        'name':'',
        'account':'',
        'password':'',
        'period':'180',
        //unit 0对应天  1对应月
        'unit':'0',
        'capacity':'5',
        'mail':'',
        'mobile':'',
        'deptId':'',
        //  添加零食用户成员_权限
        'upload':true,
        'down':true,
        'share':true,
        'rename':true,
        'view':true,
        'move':true,
        'copy':true,
        'delete_pb':true,
        //  账号是否合法状态
        //  0 初始化状态
        //  1 有所改变,未知
        //  2 检测了，没通过
        //  3 检测了，通过了
        'name_state':'0',
        'account_state':'0',
        'pw_state':'0',
        'mail_state':'3',
        // 部门管理员用于过滤树节点
        'filterText':'',
        'tree_search':'',
        'tree_defaultProps': {
          children: 'children',
          label: 'deptName'
        },
        'AddSelectedDeptName':'',
          // 超级管理员的节点树
        'tree_defaultProps_admin':{
          children:'children',
          label:'mName',
          isLeaf: 'isLeaf'
        },
        'search_depts_admin':[],
        'search_depts_admin_ing':false,
        //思路：开始请求  tableDataAll  赋值
        //真正的表格数据 tableData_all_name  基于
        //data_model 为 all 或者 name    于tableDataAll过滤得到
        //tableData_all_name   最终的表格数据 基于
        //submitCheckList  过滤筛选状态得到
        'tableDataAll':[],//初始化直接赋值
        //  'tableData_all_name':[], //根据data_model  缓存计算得到
        //根据 submitCheckList 缓存计算得到  也是最终绑定在table上的
        'filterText_admin':'',
        'searchNameResult':[],
        'multipleSelection':[],
        'loading_for_CasualList':true,
        'data_model':'all',
        'searchName':'',
        'submitCheckList':{'normal':true,'lock':true,'due':true},
        'checkList':{'normal':true,'lock':true,'due':true},
        // 'submitCheckList_time':{'prematurity':true,'due':true},
        // 'checkList_time':{'prematurity':true,'due':true},
        'right_main_currentPage1':1,
        'right_main_page_size':20,
        authMap: {
          upload: this.i18n.g.upload,
          down: this.i18n.g.download,
          share: this.i18n.g.share,
          rename: this.i18n.g.rename,
          view: this.i18n.g.preview,
          move: this.i18n.g.move,
          copy: this.i18n.g.copy,
          delete: this.i18n.g.delete
        },
        actionIndex: 'meiyou'
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
      'token'(){
        let token = JSON.parse(window.localStorage.getItem('loginInfo')).token;
        return token;
      },
      'pbAdmin'(){
        let pbAdmin = JSON.parse(window.localStorage.getItem('pbAdmin'));
        return pbAdmin;
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
      'dialogAddMember_CanNext'(){
        if(this.name_state==='3' && this.account_state==='3' && this.pw_state==='3' && this.mail_state==='3'){
          return true;
        }else{
          return false;
        }
      },
      'dialogAddMember_CanCreated'(){
        if(this.deptId===''){
          return false;
        }else{
          return true;
        }
      },
      'tableData_all_name'(){
        let arr=[];
        let arr1=[];
        let arr2=[];
        let arr3=[];
        if(this.data_model==='all'){
          arr=this.tableDataAll.concat();
        }else{
          arr=this.searchNameResult.concat();
        }

        if(this.submitCheckList.normal){
          arr1=arr.filter((item) => {
            return item.status == '0'
          });
        }
        if(this.submitCheckList.lock){
          arr2=arr.filter((item) => {
            return item.status == '1'
          });
        }
        if(this.submitCheckList.due){
          arr3=arr.filter((item) => {
            return item.status == '2'
          });
        }
        return arr1.concat(arr2,arr3);
      },
      'tableUserListForPages'(){
        let start=(this.right_main_currentPage1-1)*this.right_main_page_size;
        let end=this.right_main_currentPage1*this.right_main_page_size;
        return this.tableData_all_name.slice(start,end);
      },
      'right_main_total'(){
        return this.tableData_all_name.length;
      },
      'dialogEdit_pb_text'(){
        let arr=[];
        if(this.dialogEditDate.pb!==undefined){
          if(this.dialogEditDate.pb.upload==='1'){
            arr.push(this.i18n.g.upload);
          }
          if(this.dialogEditDate.pb.down==='1'){
            arr.push(this.i18n.g.download);
          }
          if(this.dialogEditDate.pb.share==='1'){
            arr.push(this.i18n.g.share);
          }
          if(this.dialogEditDate.pb.rename==='1'){
            arr.push(this.i18n.g.rename);
          }
          if(this.dialogEditDate.pb.view==='1'){
            arr.push(this.i18n.g.preview);
          }
          if(this.dialogEditDate.pb.move==='1'){
            arr.push(this.i18n.g.move);
          }
          if(this.dialogEditDate.pb.copy==='1'){
            arr.push(this.i18n.g.copy);
          }
          if(this.dialogEditDate.pb.delete==='1'){
            arr.push(this.i18n.g.delete);
          }
        }
        return arr.join("，");
      },
      'dialogEdit_state_6_isOk'(){
        this.pw1 = this.pw1.replace(/[\W]/g,'')
        this.pw2 = this.pw2.replace(/[\W]/g,'')
        return this.pw1!=='' && this.pw2!=='' && this.pw1.length>=8 && this.pw2.length>=8 && this.pw1==this.pw2;
      },
      'dialogEdit_state_8_isOk'(){
        return this.deptId!=='';
      },
      'period_min'(){
        if(this.unit === '0'){
          return 1;
        }else{
          return 1;
        }
      },
      'period_max'(){
        if(this.unit === '0'){
          return 365;
        }else{
          return 12;
        }
      },
    },
    methods: {
      trimDate (d) {
        try {
          let arr = []
          arr.push(d.substring(0,4))
          arr.push(d.substring(5, 7))
          arr.push(d.substring(8, 10))
          arr = arr.concat(d.substring(11).split(":"))
          return new Date(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5])
        } catch (e) { console.log(e) }
      },
      trim (o) {
        return Object.keys(o).filter((v) => {
          return o[v] == '1'
        }).map((v) => {
            return this.authMap[v]
        }).join()
      },
      'updatePb'(){
        let that=this;
        requestUpdatePb({
          'upload':this.upload?'1':'0',
          'down':this.down?'1':'0',
          'share':this.share?'1':'0',
          'rename':this.rename?'1':'0',
          'view':this.down?'1':'0',
          'move':this.move?'1':'0',
          'copy':this.copy?'1':'0',
          'delete':this.delete_pb?'1':'0',
          'casualId':this.dialogEditDate.casualId,
          'deptId':this.dialogEditDate.deptId,
          'token':this.token
        }).then(data => {
          if(data.errorCode === "200"){
            that.dialogEditMember=false;
            that.loading_for_CasualList=true;
            that.axios_GetCasualList();
            that.msg('success', that.__.g.handle_success)
          }else{
            that.msg('warning', that.__.g.handle_fail)
            return ;
          }
        });
      },
      'updateCapacity'(){
        let that=this;
        requestUpdateCapacity({
          'capacity': Math.round(this.capacity),
          'casualId':this.dialogEditDate.casualId,
          'casualUser':this.dialogEditDate.account,
          'deptId':this.dialogEditDate.deptId,
          'token':this.token}).then(data => {
          if(data.errorCode === "200"){
            that.dialogEditMember=false;
            that.loading_for_CasualList=true;
            that.axios_GetCasualList();
            that.msg('success', that.__.g.handle_success)
          }
        });
      },
      'updatePeriod'(){
        let that=this;
            requestUpdatePeriod({'period': Math.round(this.period),'unit':this.unit,'casualId':this.dialogEditDate.casualId,'deptId':this.dialogEditDate.deptId,'token':this.token}).then(data => {
              if(data.errorCode === "200"){
                that.dialogEditMember=false;
                that.loading_for_CasualList=true;
                that.axios_GetCasualList();
                that.msg('success', that.__.g.handle_success)
              }else{
                that.msg('warning', that.__.g.handle_fail)
                return ;
              }
        });
      },
      'updateDept'(){
        let that=this;
        requestUpdateDept({'deptId':this.deptId,'casualId':this.dialogEditDate.casualId,'token':this.token}).then(data => {
          if(data.errorCode === "200"){
            that.dialogEditMember=false;
            that.loading_for_CasualList=true;
            that.axios_GetCasualList();
            that.msg('success', that.__.g.handle_success)
          }else{
            that.msg('warning', that.__.g.handle_fail)
            return ;
          }
        });
      },
      'updatePw'(){
        let that=this;
        if(this.pw1.length<8){
          this.msg('warning', that.__.g.pw_less_8)
          return ;
        }
        requestUpdatePw({'password':this.pw1,'casualId':this.dialogEditDate.casualId,'deptId':this.dialogEditDate.deptId,'token':this.token}).then(data => {
          if(data.errorCode === "200"){
            that.dialogEditMember=false;
            that.loading_for_CasualList=true;
            that.axios_GetCasualList();
            that.msg('success', that.__.g.handle_success)
          }else{
            that.msg('warning', that.__.g.handle_fail)
            return ;
          }
        });
      },
      'getCasualDetail'(casualId){
        requestGetCasualDetail({'casualId':casualId,'token':this.token}).then(data => {
          if(data.errorCode === "200"){
            this.dialogEditDate=data.result;
            this.upload=(data.result.pb.upload==='1');
            this.down=(data.result.pb.down==='1');
            this.share=(data.result.pb.share==='1');
            this.rename=(data.result.pb.rename==='1');
            this.view=(data.result.pb.view==='1');
            this.move=(data.result.pb.move==='1');
            this.copy=(data.result.pb.copy==='1');
            this.delete_pb=(data.result.pb.delete==='1');
            this.dialogEditMember=true;
          }else{
            throw "错误定位：临时用户_查看临时用户详情  errorCode:" + data.errorCode+" casualId"+casualId
          }
        });
      },
      'dialogEditClick'(val,casualId,deptId,account){
        //1 账号详情
        //2 修改有效期
        //3 修改空间
        //4 修改权限
        //5 锁定/解锁
        //6 重置密码
        //7 删除
        //8 更改部门
        let that=this;
        if(val==='1'){
          this.dialogEditTitle = this.i18n.account_detial;
          this.dialogEdit_state=val;
          this.getCasualDetail(casualId);
        }else if(val==='2'){
          this.dialogEditTitle = this.i18n.change_r_time
          this.dialogEdit_state=val;
          this.getCasualDetail(casualId);
        }else if(val==='3'){
          this.dialogEditTitle = this.i18n.change_space;
          this.dialogEdit_state=val;
          this.getCasualDetail(casualId);
        }else if(val==='4'){
          this.dialogEditTitle = this.i18n.change_auth;
          this.dialogEdit_state=val;
          this.getCasualDetail(casualId);
        }else if(val==='51'){
        //锁定操作
          that.$confirm(this.__.g.is_sure_confirm, this.__.g.warning, {
            confirmButtonText:this.__.g.sure_q,
            cancelButtonText:this.__.g.cancel_q,
            type: 'warning'
          }).then(() => {
            let Params={'account':account,'deptId':deptId,'token':this.token};
            requestCasualLock(Params).then(data => {
              if(data.errorCode === "200"){
                that.dialogEditMember=false;
                that.loading_for_CasualList=true;
                that.axios_GetCasualList();
                that.msg('success', that.__.g.handle_success)
              }else{
                that.msg('warning', that.__.g.handle_fail)
                return ;
              }
            });
          }).catch(() => {
          });
        }else if(val==='52'){
          // 解锁操作
          that.$confirm(this.__.g.is_sure_confirm, this.__.g.warning, {
            confirmButtonText:this.__.g.sure_q,
            cancelButtonText:this.__.g.cancel_q,
            type: 'warning'
          }).then(() => {
            let Params={'account':account,'deptId':deptId,'token':this.token};
            requestCasualUnlock(Params).then(data => {
              if(data.errorCode === "200"){
                that.dialogEditMember=false;
                that.loading_for_CasualList=true;
                that.axios_GetCasualList();
                that.msg('success', that.__.g.handle_success)
              }else{
                that.msg('warning', that.__.g.handle_fail)
                return ;
              }
            });
          }).catch(() => {
          });
        }else if(val==='6'){
          this.dialogEditTitle = this.i18n.reset_pwd;
          this.dialogEdit_state=val;
          this.getCasualDetail(casualId);
        }else if(val==='7'){
          that.$confirm(this.__.g.s_t_del, this.__.g.warning, {
            confirmButtonText:this.__.g.sure_q,
            cancelButtonText:this.__.g.cancel_q,
            type: 'warning'
          }).then(() => {
            let Params={'casualId':casualId,'deptId':deptId,'token':this.token, 'casualUser': account};
            requestDeleteCasual(Params).then(data => {
              if(data.errorCode === "200"){
                that.dialogEditMember=false;
                that.loading_for_CasualList=true;
                that.axios_GetCasualList();
                that.msg('success', that.__.g.handle_success)
              }else{
                that.msg('warning', that.__.g.handle_fail)
                return ;
              }
            });
          }).catch(() => {
          });
        }
      },
      right_main_handleCurrentChange(val){
        this.$refs.groupTable.$vnode.child.$el.childNodes[2].scrollTop=0;
        this.right_main_currentPage1=val;
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
        let handleClick=(event) => {
//          this.show_filter_time=false;
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
        let setChecked_due=(e) => {
          e.preventDefault();
          this.checkList.due=!this.checkList.due;
        };
        let handleFilter=(e) => {
          this.right_main_currentPage1 = 1
          if(checkList.lock || checkList.normal || checkList.due){
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
          this.checkList={'normal':true,'lock':true,'due':true};
          this.submitCheckList = {'normal':true,'lock':true,'due':true};
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
                  <label class="el-checkbox">
                    <span class={!checkList.due?"el-checkbox__input":"el-checkbox__input is-checked"} onClick={setChecked_due}><span class="el-checkbox__inner"></span><input type="checkbox" class="el-checkbox__original" value={__.g.due} /></span><span class="el-checkbox__label">{__.g.due}</span>
                  </label>
                </div>
              </div>
          <div class="el-table-filter__bottom"  style="background-color:#fff;">
            <button class={(!checkList.lock && !checkList.normal && !checkList.due)?"is-disabled":""} onClick={handleFilter}>{this.i18n.g.filter}</button>
            <button onClick={handleReset}>{this.i18n.g.reset}</button>
          </div>
          </div>
          </div>
        );
      },
      'showAddDialog'(){
        this.dialogAddMember=true;
      },
      'setDept'(deptName,deptId){
        this.AddSelectedDeptName=deptName;
        this.deptId=deptId;
      },
      'addNameChange'(val){
        this.name_state='1';
      },
      'addNameBlur'(e){
        //this.name=e.target.value;
        if(!this.name){
          this.name_state='2';
          return ;
        }
        this.name_state='3';
      },
      'only_num_az'(e){
        e.target.value=e.target.value.replace(/[\W]/g,'');
      },
      'addAccountChange'(val){
        this.account_state='1';
      },
      'addAccountBlur'(e, p){
        this.account = this.account.replace(/[\W]/g,'')
        if(this.account.length<8 || this.account.length>15){
          this.account_state='2';
          return ;
        }
        requestAccountIsExist({'account':this.account,'token':this.token}).then(data => {
          if(data.errorCode === "200"){
            if(data.result.exist===0){
              this.account_state='3';
            }else{
              this.account_state='4';
            }
            if (p && this.dialogAddMember_CanNext) {
              this.dialogAddMember_step=2
            }
          }else{
            this.account_state='4';
          }
        });
      },
      'addPwChange'(val){
        this.pw_state='1';
      },
      'addPwBlur'(e){
        this.password = this.password.replace(/[\W]/g,'')
        if(this.password.length<8 || this.password.length>15){
          this.pw_state='2';
          return ;
        }
        this.pw_state='3';
      },
      'addPeriodKU'(key){
        //e.target.value=e.target.value.replace(/\D/g,'');
        try {
          this.$nextTick(function () {
            if (!Number.isInteger(this[key])) {
              this.$refs[key].currentValue = Math.floor(this[key])
              this[key] = Math.floor(this[key])
            }
          })
        } catch (e) { console.log(e) }
      },
      'addPeriodAfp'(e){
        e.target.value=e.target.value.replace(/\D/g,'')
      },
      'addMailChange'(val){
        if(!val){
          this.mail_state='3';
          return ;
        }
        this.mail_state='1';
      },
      'addMailBlur'(e){
        if(e.target.value===''){
          this.mail_state='3';
          return ;
        }
        let reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        let result = reg.test(e.target.value);
        if(result){
          this.mail_state='3';
        }else{
          this.mail_state='2';
        }
      },
      clearFilterText(){
        this.filterText='';
      },
      clearFilterText_admin(){
        this.filterText_admin='';
        this.search_depts_admin_ing=false;
      },
      getDepartManageList(){
        let token=this.token;
        requestGetDepartManageList({token}).then(data => {
          if(data.errorCode === "200"){
            this.tree_search=data.result;
          }else{
            throw "错误定位：临时用户_管理的部门初始化   errorCode:"+data.errorCode
          }
        });
      },
      // 部门管理员树方法
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
          <span style={data.isManage==='0'?span_no_manage:span_manage}>
            <i class="iconfont icon-fangzi" style="color:#109410;margin:0px 3px;"></i>
            {node.label}
          </span>
        );
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
      AddTree_nc(data,node,self){
        if(data.isManage==="1" && this.deptId != data.deptId){
          this.AddSelectedDeptName=data.deptName;
          this.deptId=data.deptId;

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
      },
      // 超级管理员树方法
      add_tree_nc_admin(data,node,self){
        this.AddSelectedDeptName=data.mName;
        this.deptId=data.mid;
      },
      'submitSearchDept'(){
        let fT = this.filterText_admin.replace(/(^\s*)|(\s*$)/g,"");
        if(fT===''){
          this.search_depts_admin_ing=false;
          return ;
        }
        this.search_depts_admin_ing=true;
        let token = this.token;
        let deptName = fT;
        requestDeptSearchManage({deptName,token}).then(data => {
          if(data.errorCode === "200"){
            this.search_depts_admin=data.result;
          }else{
            throw "错误定位：临时用户_超级管理员搜索部门   errorCode:" + data.errorCode
          }
        })
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
          <span style={data.isManage==='0'?span_no_manage:span_manage}>
              {data.mTag===2
                ?<i class="iconfont icon-fangzi" style="color:#109410;margin:0px 3px;"></i>
                :<i class="iconfont icon-yonghu" style="color:#094caf;margin:0px 3px;"></i>}
              {node.label}
          </span>
        );
      },
      loadNode(node, resolve) {
        let Params={'deptId':node.data.mid,token:this.token};
        if(node.level!==0){
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
      clearAddSelectedDept(){
        this.search_depts_admin_ing=false;
        this.AddSelectedDeptName='';
        this.deptId='';
      },
      handleSelectionChange(val){
        this.multipleSelection=val;
      },
      submitAddCasual(){
        this.axiosAddCasual();
      },
      reserAdd(){
        this.dialogAddMember_step=1;
        this.name='';
        this.account='';
        this.password='';
        this.period='180';
        this.unit='0';
        this.capacity='5';
        this.mail='';
        this.mobile='';
        this.deptId='';
        this.upload=true;
        this.down=true;
        this.share=true;
        this.rename=true;
        this.view=true;
        this.move=true;
        this.copy=true;
        this.delete_pb=true;
        this.name_state='0';
        this.account_state='0';
        this.pw_state='0';
        this.mail_state='3';
        this.filterText='';
        this.AddSelectedDeptName='';
      },
      axiosAddCasual(){
        let that = this;
        let Params={
          'name':that.name,
          'account':that.account,
          'password':that.password,
          'period': Math.round(that.period),
          'unit':that.unit,
          'capacity': Math.round(that.capacity),
          'mail':that.mail,
          'mobile':that.mobile,
          'deptId':that.deptId,
          'upload':that.upload?'1':'0',
          'down':that.down?'1':'0',
          'share':that.share?'1':'0',
          'rename':that.rename?'1':'0',
          'view':that.down?'1':'0',
          'copy':that.copy?'1':'0',
          'move':that.move?'1':'0',
          'delete':that.delete_pb?'1':'0',
          'token':that.token
        };
        requestAddCasual(Params).then(data => {
          if(data.errorCode === '200'){
            that.dialogAddMember=false;
            that.reserAdd();
            that.axios_GetCasualList();
            that.msg('success', that.__.CasualUser.add_member_s)
          }else{
            throw "错误定位：临时用户_添加临时用户成员 errorCode:"+data.errorCode;
          }
        });
      },
      submitDeleteCasualUsers(){
        let that=this;
        let arr=this.multipleSelection;
        if(arr.length===0){
          that.msg('warning', that.__.GroupManage.s_user_f)
          return ;
        }
        this.$confirm(this.__.g.s_t_del, this.__.g.warning, {
          confirmButtonText:this.__.g.sure_q,
          cancelButtonText:this.__.g.cancel_q,
          type: 'warning'
        }).then(() => {
          that.loading_for_CasualList=true;
          let promises = arr.map((item) => {
            return new Promise((resolve,reject) => {
              let Params={'casualId':item.casualId,'deptId':item.deptId,'token':that.token, 'casualUser': item.account};
              requestDeleteCasual(Params).then(data => {
                if(data.errorCode === '200'){
                  resolve('0');
                }else{
                  reject('1');
                }
              });
            })
          });
          Promise.all(promises).then(function(res){
            that.axios_GetCasualList();
            //考虑下如果在搜人名状态
            let count=0;
            for(var i=0,len=res.length;i<len;i++){
              if(res[i]==='0'){
                count++;
              }
            }
            that.msg('success', that.__.g.complete_head+count+that.__.g.complete_foot)
          });
        }).catch(() => {
        });
      },
      submitLockCasualUsers(){
        let that=this;
        let arr=[];
        arr=this.multipleSelection.filter((item) => {
          return item.status == '0'
        })
        if(arr.length===0){
          that.msg('warning', that.__.UserList.s_one_normal)
          return ;
        }
        this.$confirm(this.__.g.is_sure_confirm, this.__.g.warning, {
          confirmButtonText:this.__.g.sure_q,
          cancelButtonText:this.__.g.cancel_q,
          type: 'warning'
        }).then(() => {
          that.loading_for_CasualList=true;
          let promises = arr.map((item) => {
            return new Promise((resolve,reject) => {
              let Params={'account':item.account,'deptId':item.deptId,'token':that.token};
              requestCasualLock(Params).then(data => {
                if(data.errorCode === '200'){
                  resolve('0');
                }else{
                  reject('1');
                }
              });
            })
          });
          Promise.all(promises).then(function(res){
            that.axios_GetCasualList();
            //考虑下如果在搜人名状态
            let count=0;
            for(var i=0,len=res.length;i<len;i++){
              if(res[i]==='0'){
                count++;
              }
            }
            that.msg('success', that.__.g.complete_head+count+that.__.g.complete_foot)
          });
        }).catch(() => {
        });
      },
      submitUnlockCasualUsers(){
        let that=this;
        let arr=[];
        arr=this.multipleSelection.filter((item) => {
          return item.status==='1'
        })
        if(arr.length===0){
          that.msg('warning', that.__.UserList.s_one_lock)
          return ;
        }
        this.$confirm(this.__.g.is_sure_confirm, this.__.g.warning, {
          confirmButtonText:this.__.g.sure_q,
          cancelButtonText:this.__.g.cancel_q,
          type: 'warning'
        }).then(() => {
          that.loading_for_CasualList=true;
          let promises = arr.map((item) => {
            return new Promise((resolve,reject) => {
              let Params={'account':item.account,'deptId':item.deptId,'token':that.token};
              requestCasualUnlock(Params).then(data => {
                if(data.errorCode === '200'){
                  resolve('0');
                }else{
                  reject('1');
                }
              });
            })
          });
          Promise.all(promises).then(function(res){
            that.axios_GetCasualList();
            //考虑下如果在搜人名状态
            let count=0;
            for(var i=0,len=res.length;i<len;i++){
              if(res[i]==='0'){
                count++;
              }
            }
            that.msg('success', that.__.g.complete_head+count+that.__.g.complete_foot)
          });
        }).catch(() => {
        });
      },
      submitRefresh(){
        this.right_main_currentPage1 = 1
        this.loading_for_CasualList=true;
        this.show_filter=false;
        setTimeout(() => {
          this.axios_GetCasualList();
        },500);
      },
      clearSearchName(){
        /*this.submitCheckList={'normal':true,'lock':true,'due':true};
        this.checkList={'normal':true,'lock':true,'due':true};*/
        this.searchName='';
        this.data_model='all';
      },
      submitSearchUser(){
        let sN=this.searchName.replace(/(^\s*)|(\s*$)/g,"");
        /*this.submitCheckList={'normal':true,'lock':true,'due':true};
        this.checkList={'normal':true,'lock':true,'due':true};*/

        if(sN===''){
          this.data_model='all';
        }else{
          this.data_model='name';
          this.searchNameResult=this.tableDataAll.filter((item) => {
            return item.name.indexOf(sN) !== -1 || item.account.indexOf(sN) !== -1;
          });
        }
      },
      openLog(){
        $('.v-modal').show();
      },
      closeLog(){
        $('.v-modal').hide();
        this.name='';
        this.account='';
        this.password='';
        this.mail='';
        this.mobile='';
        this.name_state='0';
        this.account_state='0';
        this.pw_state='0';
        this.mail_state='3';
        this.pw1='';
        this.pw2='';
        this.period='180';
        this.unit='0';
        this.capacity='5';
        this.upload=true;
        this.down=true;
        this.share=true;
        this.rename=true;
        this.view=true;
        this.copy=true;
        this.move=true;
        this.delete_pb=true;
        this.deptId="";
        this.AddSelectedDeptName="";
        this.filterText = ''
        this.filterText_admin = ''
        this.search_depts_admin_ing = false
        this.search_depts_admin = []
        this.dialogAddMember_step = 1
        //this.tree_search = []
      },
      //请求部分
      axios_GetCasualList(){
        this.show_filter=false;
        requestGetCasualList({'token':this.token}).then(data => {
          if(data.errorCode === "200"){
            this.tableDataAll=data.result;
            this.loading_for_CasualList=false;
            //刷新搜索模式下列表数据
            this.submitSearchUser()
          }else{
            throw "错误定位：临时用户_获取临时用户列表   errorCode:" + data.errorCode
          }
        })
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
      dialogInit () {
        this.dialogEditMember = false
        this.AddSelectedDeptName = ''
        this.filterText = ''
        this.filterText_admin = ''
        this.search_depts_admin_ing = false
        this.search_depts_admin = []
      },
      next () {
        this.addNameBlur()
        this.addAccountBlur('', true)
        this.addPwBlur()
      }
    },
    watch: {
      filterText(val) {
        if(this.pbAdmin.pb_admin!=='0'){
          let val_f=val.replace(/(^\s*)|(\s*$)/g,"");
          this.node_list=[];
          this.$refs.casualUser_tree.filter(val_f);
        }
      },
      data_model(val) {
        this.axios_GetCasualList();
      },
      unit(val){
        if(val==='0'){
          this.period='180'
        }else{
          this.period='6'
        }
      }
    },
    created(){
      let that = this;
      if(this.pbAdmin.pb_admin!=='0'){
        this.getDepartManageList();
      }else{
        let Params={'deptId':'',token:that.token};
        requestGetAddressbook_nouser(Params).then(data => {
          if(data.errorCode === "200"){
            that.tree_search=data.result;
          }else{
            throw "错误定位：临时用户_树节点_初始化   errorCode:" + data.errorCode
          }
        });
      }
      this.axios_GetCasualList();
    },
    mounted(){
      let elem = this.$refs.groupTable.$vnode.child.$el.childNodes[2];
      elem.style.maxHeight=(document.body.clientHeight - 260)+'px'

      window.onresize=() => {
        let elem = this.$refs.groupTable.$vnode.child.$el.childNodes[2]
        elem.style.maxHeight=(document.body.clientHeight - 250)+'px'
      }
    },
    destroyed() {
      window.onresize = null
    },
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  #addCasualUser .el-dialog__body
    padding: 10px 20px;
  .el-tooltip__popper
    padding 0px 0px;
  .casualTooltip
    /*position absolute
    left -10px
    top 20px
    z-index 2040
    background #fff
    border 1px solid #1f2d3d
    border-radius 4px
    line-height 1.2*/
    &>div
      cursor pointer
      border-top  1px solid #3c3c3c
      text-align center
      padding 8px 6px
    &>div:first-child
      border-top  0px
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  #dialogEdit_state_01
    &>div
      margin-bottom 12px
    &>div:last-child
      margin-bottom 0px
    .dialogEdit_state_01_two
      white-space nowrap
      text-overflow ellipsis
      width 50%
      overflow hidden
      height 20px
      float left
      &>span
        width 170px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
    .dialogEdit_state_01_single
      &>span
        margin-right 18px

  #addCasualUser
    span.red
      color red
      margin-right 6px
  #addCasualUser
    div.no_require
      span.red
        visibility hidden
  #addCasualUser
    div.page_01
      &>div
        height 32px
        line-height 32px
        margin 12px 0px
        .input_wrapper
          display inline-block
          width 500px
          float right
          text-align left

  #CasualUser_box
    height 100%
    overflow-x auto
    .main_wrapper
      width 100%
      height 100%
      min-width 886px
      .content_wrapper
        position relative
        width 99%
        height 99%
        background #fff
        border-radius 8px
        overflow-y auto
        .btn_wrapper
          padding-bottom 6px
          border-bottom 1px solid #cccccc
        .table_wrapper
          width 100%
          margin-top 12px
</style>
