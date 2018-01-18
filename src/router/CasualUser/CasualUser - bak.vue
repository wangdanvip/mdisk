<template>
  <div id="CasualUser_box" style="position: relative;">
    <div id="no_allow" v-if="!isDeptAdmin">
      <div class="content">
        <div class="backBox">
          <a data-v-72b9704a="" onclick="window.history.go(-1)" class="comeback">返回上一步</a>
        </div>
      </div>
    </div>
    <div v-if="isDeptAdmin" class="main_wrapper" style="position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px;">
      <div class="content_wrapper wrap_shoadow">
        <div class="btn_wrapper">
          <el-button type="primary" style="line-height: 18px;" size="small" icon="iconfont iconfont icon-add" @click="showAddDialog">{{__.CasualUser.addCasualUser}}</el-button>
          <el-button type="primary" style="line-height: 18px;" size="small" icon="iconfont iconfont icon-iconfontsuoding" @click="submitLockCasualUsers">{{__.CasualUser.lock_user}}</el-button>
          <el-button type="primary" style="line-height: 18px;" size="small" icon="iconfont iconfont icon-jiesuo" @click="submitUnlockCasualUsers">{{__.CasualUser.unlock_user}}</el-button>
          <el-button type="primary" style="line-height: 18px;" size="small" icon="iconfont iconfont icon-shanchu" @click="submitDeleteCasualUsers">{{__.g.delete}}</el-button>
          <el-button type="primary" style="line-height: 18px;" size="small" icon="iconfont iconfont icon-shuaxin" @click="submitRefresh">{{__.g.refresh}}</el-button>

          <div class="el-input" style="display: inline-block; width: 300px; float: right; position: relative; margin-top: 8px;">
            <i class="el-input__icon el-icon-search" style="cursor: pointer" @click="submitSearchUser"></i>
            <div v-if="searchName!==''" style="width: 20px; height: 20px; position: absolute; right: 38px; top: -6px; font-size: 20px; color:#bfcbd9; cursor: pointer;" @click="clearSearchName">
              x
            </div>
            <input type="text" :placeholder="__.UserList.search_user_place" autocomplete="off" class="el-input__inner" v-model="searchName" @keydown.enter="submitSearchUser"/>
          </div>

        </div>
        <div class="table_wrapper">
          <el-table
            id="casualTabel"
            v-loading="loading_for_CasualList"
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
                <span :title="scope.row.name">{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="account"
              :label="__.UserList.login_name"
              width="150">
              <template scope="scope">
                <span :title="scope.row.account">{{scope.row.account}}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="__.CasualUser.permission">
              <template scope="scope">
                <span v-if="scope.row.pb.upload==='1'">上传，</span>
                <span v-if="scope.row.pb.down==='1'">下载，</span>
                <span v-if="scope.row.pb.share==='1'">分享，</span>
                <span v-if="scope.row.pb.rename==='1'">重命名，</span>
                <span v-if="scope.row.pb.view==='1'">预览，</span>
                <span v-if="scope.row.pb.move==='1'">移动，</span>
                <span v-if="scope.row.pb.copy==='1'">复制，</span>
                <span v-if="scope.row.pb.delete==='1'">删除</span>
              </template>
            </el-table-column>
            <el-table-column
              :render-header="reder_head"
              :label="__.DepartmentList.status"
              width="126">
              <template scope="scope">
                <span v-if="isDue(scope.row.validdate)">{{__.g.due}}</span>
                <span v-if="scope.row.status==='0' && !isDue(scope.row.validdate)">{{__.g.normal}}</span>
                <span v-if="scope.row.status==='1' && !isDue(scope.row.validdate)">{{__.g.Lock}}</span>
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
              width="120"
              align="center"
              @click="handleEdit(scope.$index, scope.row)">
              <template scope="scope">
                <!--<el-tooltip  content="点击关闭 tooltip 功能" placement="bottom" effect="light">-->
                  <!--<el-button >点击tooltip 功能</el-button>-->
                <!--</el-tooltip>-->
                <el-tooltip placement="bottom" effect="light" class="test">
                  <div slot="content">
                    <div class="casualTooltip">
                      <div @click="dialogEditClick('1',scope.row.casualId)">账号详情</div>
                      <div @click="dialogEditClick('2',scope.row.casualId)">修改有效期</div>
                      <div @click="dialogEditClick('3',scope.row.casualId)">修改空间</div>
                      <div @click="dialogEditClick('4',scope.row.casualId)">修改权限</div>
                      <div v-if="scope.row.status==='0' && !isDue(scope.row.validdate)" @click="dialogEditClick('51',scope.row.casualId,scope.row.deptId,scope.row.account)">锁定</div>
                      <div v-if="scope.row.status==='1' && !isDue(scope.row.validdate)" @click="dialogEditClick('52',scope.row.casualId,scope.row.deptId,scope.row.account)">解锁</div>
                      <div @click="dialogEditClick('6',scope.row.casualId)">重置密码</div>
                      <div @click="dialogEditClick('7',scope.row.casualId,scope.row.deptId)">删除</div>
                    </div>
                  </div>
                  <i class="iconfont icon-chilun" style="font-size: 20px; cursor: pointer;"></i>
                </el-tooltip>
                  <!--<i class="iconfont icon-chilun" style="font-size: 20px; cursor: pointer;" @click="toggleEdit"></i>-->
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
              <span class="red">*</span>姓　　名：
              <div class="input_wrapper">
                <el-input v-model="name" size="small" placeholder="请输入姓名" style="width: 410px;" @change="addNameChange" @blur="addNameBlur"></el-input>
              </div>
            </div>
            <div v-if="name_state==='2'">
              <div class="input_wrapper">
                <span class="red">姓名为必填项，不能为空</span>
              </div>
            </div>
            <div>
              <span class="red">*</span>初始账号：
              <div class="input_wrapper">
                <el-input v-model="account" size="small" placeholder="请输入初始账号,长度8至15位，仅允许英文、数字组合" style="width: 410px;" :maxlength="15" @keyup.native="only_num_az" @change="addAccountChange" @blur="addAccountBlur"></el-input>
              </div>
            </div>
            <div v-if="account_state==='2'">
              <div class="input_wrapper">
                <span class="red">初始账号不合法</span>
              </div>
            </div>
            <div>
              <span class="red">*</span>初始密码：
              <div class="input_wrapper">
                <el-input v-model="password" size="small" placeholder="请输入初始密码，长度8至15位，仅允许英文、数字组合" style="width: 410px;" :maxlength="15" @keyup.native="only_num_az" @change="addPwChange" @blur="addPwBlur"></el-input>
              </div>
            </div>
            <div v-if="pw_state==='2'">
              <div class="input_wrapper">
                <span class="red">初始密码不合法</span>
              </div>
            </div>
            <div>
              <span class="red">*</span>有效期：
              <div class="input_wrapper">
                <!--onkeydown="if(event.keyCode==13)event.keyCode=9" onKeypress="if-->
<!--((event.keyCode<48 || event.keyCode>57)) event.returnValue=false"-->
                <el-input-number  @keydown.native="addPeriodKU" @afterpaste.native="addPeriodAfp" v-model="period" :min="period_min" :max="period_max" size="small" style="width: 160px;"></el-input-number>
                <!--<el-input-number ref="addPeriod" v-model="period" :min="1" :max="999" size="small" style="width: 160px;"></el-input-number>-->
                <select v-model="unit" style="height: 28px;padding-left: 6px; vertical-align: top;">
                  <option value="0">天</option>
                  <option value="1">月</option>
                </select>
              </div>
            </div>
            <div>
              <span class="red">*</span>存储空间：
              <div class="input_wrapper">
                <!--onkeydown="if(event.keyCode==13)event.keyCode=9" onKeypress="if-->
                <!--((event.keyCode<48 || event.keyCode>57)) event.returnValue=false"-->
                <el-input-number  @keydown.native="addPeriodKU" @afterpaste.native="addPeriodAfp" v-model="capacity" :min="1" :max="10" size="small" style="width: 160px;"></el-input-number>
                <!--<el-input-number ref="addPeriod" v-model="period" :min="1" :max="999" size="small" style="width: 160px;"></el-input-number>-->
                <span style="height: 30px; line-height: 30px; vertical-align: top; font-size: 21px;">G</span>
              </div>
            </div>
            <div class="no_require">
              <span class="red">*</span>邮　　箱：
              <div class="input_wrapper">
                <el-input v-model="mail" size="small" placeholder="请输入邮箱" style="width: 410px;" @change="addMailChange" @blur="addMailBlur"></el-input>
              </div>
            </div>
            <div v-if="mail_state==='2'">
              <div class="input_wrapper">
                <span class="red">邮箱格式不合法</span>
              </div>
            </div>
            <div class="no_require">
              <span class="red">*</span>手　　机：
              <div class="input_wrapper">
                <el-input v-model="mobile" size="small" placeholder="请输入手机号码" style="width: 410px;"></el-input>
              </div>
            </div>
            <div class="no_require">
              <span class="red">*</span>勾选权限：<br/>
            </div>
            <div class="no_require" style="clear: both; height: 30px;">
              <span class="red">*</span>
              <el-checkbox v-model="upload">上传</el-checkbox>
              <el-checkbox v-model="down">下载</el-checkbox>
              <el-checkbox v-model="share">分享</el-checkbox>
              <el-checkbox v-model="rename">重命名</el-checkbox>
              <el-checkbox v-model="view">预览</el-checkbox>
              <el-checkbox v-model="move">移动</el-checkbox>
              <el-checkbox v-model="copy">复制</el-checkbox>
              <el-checkbox v-model="delete_pb">删除</el-checkbox>
            </div>
          </div>
          <div class="page_02" v-if="dialogAddMember_step===2">
            <!--部门管理员界面-->
            <div v-if="pbAdmin.pb_admin!=='0'">
              <div style="margin-bottom: 8px;">
                <span style="display: inline-block;padding: 4px 0px;">{{__.g.selected}}：</span>
                <span v-if="AddSelectedDeptName!==''" style="background-color: rgb(18, 135, 221); color: rgb(255, 255, 255); display: inline-block; padding: 4px 8px; border-radius: 6px;">
                  {{AddSelectedDeptName}}   <span @click="clearAddSelectedDept" style="margin-left: 16px; cursor: pointer; display: inline-block;">x</span>
                </span>
              </div>
              <div class="el-input">
                <i class="el-input__icon el-icon-search" style="cursor: pointer;"></i>
                <span v-if="filterText" @click="clearFilterText" style="position: absolute; right: 30px; font-size: 20px; cursor: pointer; top: 2px; color: #bfcbd9;">x</span>
                <input type="text" :placeholder="__.DepartmentList.search_placeholder" autocomplete="off" class="el-input__inner" v-model="filterText">
              </div>
              <!--普通部门管理员看到的树节点-->
              <div>
                <el-tree :data="tree_search"
                         ref="casualUser_tree"
                         :filter-node-method="filterNode"
                         @node-click="AddTree_nc"
                         :empty-text="__.g.loading"
                         :check-strictly="true"
                         :default-expand-all="true"
                         node-key="deptId"
                         :props="tree_defaultProps"
                         :render-content="renderContent"
                         style="overflow-y:auto; min-height: 220px; max-height: 340px;">
                </el-tree>
              </div>
            </div>
            <!--超级管理员界面-->
            <div v-if="pbAdmin.pb_admin==='0'">
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
              <!--超级管理员看到的树节点-->
              <div>
                <el-tree :data="tree_search"
                         v-if="search_depts_admin_ing===false"
                         :empty-text="__.g.loading"
                         :check-strictly="true"
                         :expand-on-click-node="false"
                         node-key="mid"
                         :render-content="renderContent_admin"
                         :props="tree_defaultProps_admin"
                         :load="loadNode"
                         lazy
                         @node-click="add_tree_nc_admin"
                         style="overflow-y:auto; min-height: 220px; max-height: 340px;">
                </el-tree>
                <div v-if="search_depts_admin_ing===true">
                  <div v-if="search_depts_admin_ing" style="margin-top: 12px;">
                    {{__.g.no_data}}
                  </div>
                  <div v-if="!search_depts_admin_ing" style="max-height: 340px; overflow: auto;">
                    <div v-for="item in search_depts_admin" style="cursor: pointer; line-height: 2em;" @click="setDept(item.deptName,item.deptId)">
                      <i class="iconfont icon-fangzi" style="color: rgb(16, 148, 16); margin: 0px 6px;"></i>
                      <span :style="item.deptId===deptId?{'color':'#cf6216'}:{}">{{item.deptName}}</span>
                    </div>
                  </div>
                </div>
                <!--<el-tree :data="tree_search"-->
                         <!--ref="casualUser_tree"-->
                         <!--:filter-node-method="filterNode"-->
                         <!--@node-click="AddTree_nc"-->
                         <!--:empty-text="__.g.loading"-->
                         <!--:check-strictly="true"-->
                         <!--:default-expand-all="true"-->
                         <!--node-key="deptId"-->
                         <!--:props="tree_defaultProps"-->
                         <!--:render-content="renderContent"-->
                         <!--style="overflow-y:auto; min-height: 40px; max-height: 340px;">-->
                <!--</el-tree>-->
              </div>
            </div>
          </div>
        </span>
        <span slot="footer" class="dialog-footer clearFix" style="width: 100%;text-align: center;">
          <div v-if="dialogAddMember_step===1">
            <!--<span class="clearFix" style="width: 50%"><el-button type="primary" @click="submitAddMaster">{{__.g.sure_q}}</el-button></span>-->
            <!--<span class="clearFix" style="width: 50%"><el-button @click="dialogAddMember=false">{{__.g.close}}</el-button></span>-->
            <span class="clearFix" style="width: 50%"><el-button :disabled="!dialogAddMember_CanNext" type="primary" @click="dialogAddMember_step=2">{{__.g.next_step}}</el-button></span>
            <span class="clearFix" style="width: 50%"><el-button @click="dialogAddMember=false">{{__.g.close}}</el-button></span>
          </div>
          <div v-if="dialogAddMember_step===2">
            <span class="clearFix" style="width: 50%"><el-button type="primary" @click="dialogAddMember_step=1">{{__.g.previa}}</el-button></span>
            <span class="clearFix" style="width: 50%"><el-button :disabled="!dialogAddMember_CanCreated" type="primary" @click="submitAddCasual">{{__.g.sure_q}}</el-button></span>
          </div>
        </span>
      </el-dialog>

      <el-dialog size="tiny" :title="dialogEditTitle" v-model="dialogEditMember" :close-on-click-modal="false" @open="openLog" @close="closeLog" class="dialogEditMember">
        <span class="pageBox">
          <div v-if="dialogEdit_state==='1'">
              <div style="width: 100%;" id="dialogEdit_state_01">
                <div class="dialogEdit_state_01_two">姓　　名：<span>{{dialogEditDate.name}}</span></div>
                <div class="dialogEdit_state_01_two">邮　　箱：<span>{{dialogEditDate.mail}}</span></div>
                <div class="dialogEdit_state_01_two">登录账号：<span>{{dialogEditDate.account}}</span></div>
                <div class="dialogEdit_state_01_two">手　　机：<span>{{dialogEditDate.mobile}}</span></div>
                <div class="dialogEdit_state_01_single">初始密码：<span>{{dialogEditDate.password}}</span>
                  <!--<el-button type="primary" size="mini" @click="dialogEditTitle='重置密码',dialogEdit_state='6'">-->
                    <!--修改密码-->
                  <!--</el-button>-->
                  <i class="iconfont icon-bianji" @click="dialogEditTitle='重置密码',dialogEdit_state='6'" style="cursor: pointer; font-size: 21px; color:#20a0ff"></i>
                </div>
                <div class="dialogEdit_state_01_single">到期时间：<span>{{dialogEditDate.period}}</span>
                  <!--<el-button type="primary" size="mini" @click="dialogEditTitle='修改有效期',dialogEdit_state='2'">设置有效期</el-button>-->
                  <i class="iconfont icon-bianji" @click="dialogEditTitle='修改有效期',dialogEdit_state='2'" style="cursor: pointer; font-size: 21px; color:#20a0ff"></i>
                </div>
                <div class="dialogEdit_state_01_single">存储空间：<span>{{dialogEditDate.capacity}}G</span>
                  <!--<el-button type="primary" size="mini" @click="dialogEditTitle='修改空间',dialogEdit_state='3'">修改空间</el-button>-->
                  <i class="iconfont icon-bianji" @click="dialogEditTitle='修改空间',dialogEdit_state='3'" style="cursor: pointer; font-size: 21px; color:#20a0ff"></i>
                </div>
                <div class="dialogEdit_state_01_single">权　　限：<span>{{dialogEdit_pb_text}}</span>
                  <!--<el-button type="primary" size="mini" @click="dialogEditTitle='修改权限',dialogEdit_state='4'">修改权限</el-button>-->
                  <i class="iconfont icon-bianji" @click="dialogEditTitle='修改权限',dialogEdit_state='4'" style="cursor: pointer; font-size: 21px; color:#20a0ff"></i>
                </div>
                <div class="dialogEdit_state_01_single">所属部门：<span>{{dialogEditDate.deptName}}</span>
                  <!--<el-button type="primary" size="mini" @click="dialogEditTitle='修改部门',dialogEdit_state='8',AddSelectedDeptName=dialogEditDate.deptName,deptId=dialogEditDate.deptId">修改部门</el-button>-->
                  <i class="iconfont icon-bianji" @click="dialogEditTitle='修改部门',dialogEdit_state='8',AddSelectedDeptName=dialogEditDate.deptName,deptId=dialogEditDate.deptId" style="cursor: pointer; font-size: 21px; color:#20a0ff"></i>
                </div>
                <!--<div class="dialogEdit_state_01_single">所属部门：<span>{{dialogEditDate.deptName}}</span><el-button type="primary" size="mini" @click="dialogEditTitle='修改部门',dialogEdit_state='8',AddSelectedDeptName=dialogEditDate.deptName_single,deptId=dialogEditDate.deptId">修改部门</el-button></div>-->
                <div style="clear: both;"></div>
              </div>
          </div>

          <div v-if="dialogEdit_state==='2'">
            <div>有效期：
              <div style="display: inline-block; width: 370px; line-height: 30px; margin-bottom: 21px;">
                {{dialogEditDate.period}}
              </div>
            </div>
            <div style="line-height: 30px;">更改：
              <div style="display: inline-block; width: 370px; line-height: 30px; vertical-align: top;">
                <el-input-number  @keydown.native="addPeriodKU" @afterpaste.native="addPeriodAfp" v-model="period" :min="period_min" :max="period_max" size="small" style="width: 160px;"></el-input-number>
                <select v-model="unit" style="height: 28px;padding-left: 6px; vertical-align: top;">
                  <option value="0">天</option>
                  <option value="1">月</option>
                </select>
              </div>
            </div>
          </div>

          <div v-if="dialogEdit_state==='3'">
            <div style="line-height: 30px; margin-bottom: 16px;">当前存储空间为：
              <div style="display: inline-block; width: 370px; line-height: 30px; vertical-align: top;">
                {{dialogEditDate.capacity}}
                <span style="vertical-align: top;">G</span>
              </div>
            </div>
            <div style="line-height: 30px;">修改存储空间为：
              <div style="display: inline-block; width: 370px; line-height: 30px; vertical-align: top;">
                <el-input-number  @keydown.native="addPeriodKU" @afterpaste.native="addPeriodAfp" v-model="capacity" :min="1" :max="10" size="small" style="width: 160px;"></el-input-number>
                <span style="vertical-align: top;">G</span>
              </div>
            </div>
          </div>

          <div v-if="dialogEdit_state==='4'">
            <div style="margin-bottom: 16px;">
              勾选权限：<br/>
            </div>
            <div class="no_require">
              <el-checkbox v-model="upload">上传</el-checkbox>
              <el-checkbox v-model="down">下载</el-checkbox>
              <el-checkbox v-model="share">分享</el-checkbox>
              <el-checkbox v-model="rename">重命名</el-checkbox>
              <el-checkbox v-model="view">预览</el-checkbox>
              <el-checkbox v-model="move">移动</el-checkbox>
              <el-checkbox v-model="copy">复制</el-checkbox>
              <el-checkbox v-model="delete_pb">删除</el-checkbox>
            </div>
          </div>


          <div v-if="dialogEdit_state==='6'">
            <div>新的密码：
              <div style="display: inline-block; width: 370px; line-height: 30px; margin-bottom: 21px;">
                <el-input :maxlength="15" @keyup.native="only_num_az" placeholder="请输入密码,长度为8至15位，仅允许字母和数字组合" size="small" v-model="pw1"></el-input>
              </div>
            </div>
            <div>确认密码：
              <div style="display: inline-block; width: 370px; line-height: 30px;">
                <el-input :maxlength="15" @keyup.native="only_num_az" placeholder="请再次确认密码" size="small" v-model="pw2"></el-input>
              </div>
            </div>
          </div>

          <div v-if="dialogEdit_state==='8'">


                <!--部门管理员界面-->
            <div v-if="pbAdmin.pb_admin!=='0'">
              <div style="margin-bottom: 8px;">
                <span style="display: inline-block;padding: 4px 0px;">{{__.g.selected}}：</span>
                <span v-if="AddSelectedDeptName!==''" style="background-color: rgb(18, 135, 221); color: rgb(255, 255, 255); display: inline-block; padding: 4px 8px; border-radius: 6px;">
                  {{AddSelectedDeptName}}   <span @click="clearAddSelectedDept" style="margin-left: 16px; cursor: pointer; display: inline-block;">x</span>
                </span>
              </div>
              <div class="el-input">
                <i class="el-input__icon el-icon-search" style="cursor: pointer;"></i>
                <span v-if="filterText" @click="clearFilterText" style="position: absolute; right: 30px; font-size: 20px; cursor: pointer; top: 2px; color: #bfcbd9;">x</span>
                <input type="text" :placeholder="__.DepartmentList.search_placeholder" autocomplete="off" class="el-input__inner" v-model="filterText">
              </div>
              <!--普通部门管理员看到的树节点-->
              <div>
                <el-tree :data="tree_search"
                         ref="casualUser_tree"
                         :filter-node-method="filterNode"
                         @node-click="AddTree_nc"
                         :empty-text="__.g.loading"
                         :check-strictly="true"
                         :default-expand-all="true"
                         node-key="deptId"
                         :props="tree_defaultProps"
                         :render-content="renderContent"
                         style="overflow-y:auto; min-height: 220px; max-height: 340px;">
                </el-tree>
              </div>
            </div>
            <!--超级管理员界面-->
            <div v-if="pbAdmin.pb_admin==='0'">
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
              <!--超级管理员看到的树节点-->
              <div>
                <el-tree :data="tree_search"
                         v-if="search_depts_admin_ing===false"
                         :empty-text="__.g.loading"
                         :check-strictly="true"
                         :expand-on-click-node="false"
                         node-key="mid"
                         :render-content="renderContent_admin"
                         :props="tree_defaultProps_admin"
                         :load="loadNode"
                         lazy
                         @node-click="add_tree_nc_admin"
                         style="overflow-y:auto; min-height: 220px; max-height: 340px;">
                </el-tree>
                <div v-if="search_depts_admin_ing===true">
                  <div v-if="search_depts_admin.length===0" style="margin-top: 12px;">
                    {{__.g.no_data}}
                  </div>
                  <div v-if="search_depts_admin.length!==0" style="max-height: 340px; overflow: auto;">
                    <div v-for="item in search_depts_admin" style="cursor: pointer; line-height: 2em;" @click="setDept(item.deptName,item.deptId)">
                      <i class="iconfont icon-fangzi" style="color: rgb(16, 148, 16); margin: 0px 6px;"></i>
                      <span :style="item.deptId===deptId?{'color':'#cf6216'}:{}">{{item.deptName}}</span>
                    </div>
                  </div>
                </div>
                <!--<el-tree :data="tree_search"-->
                <!--ref="casualUser_tree"-->
                <!--:filter-node-method="filterNode"-->
                <!--@node-click="AddTree_nc"-->
                <!--:empty-text="__.g.loading"-->
                <!--:check-strictly="true"-->
                <!--:default-expand-all="true"-->
                <!--node-key="deptId"-->
                <!--:props="tree_defaultProps"-->
                <!--:render-content="renderContent"-->
                <!--style="overflow-y:auto; min-height: 40px; max-height: 340px;">-->
                <!--</el-tree>-->
              </div>
            </div>

          </div>

        </span>
        <span slot="footer" class="dialog-footer clearFix" style="width: 100%;text-align: center;">
          <div v-if="dialogEdit_state==='1'">
            <span class="clearFix" style="width: 50%"><el-button type="primary" @click="dialogEditMember=false">{{__.g.save}}</el-button></span>
            <span class="clearFix" style="width: 50%"><el-button  @click="dialogEditMember=false">{{__.g.close}}</el-button></span>
          </div>

          <div v-if="dialogEdit_state==='2'">
            <span class="clearFix" style="width: 50%"><el-button  type="primary" @click="updatePeriod">{{__.g.save}}</el-button></span>
            <span class="clearFix" style="width: 50%"><el-button  @click="dialogEditMember=false">{{__.g.close}}</el-button></span>
          </div>

          <div v-if="dialogEdit_state==='3'">
            <span class="clearFix" style="width: 50%"><el-button  type="primary" @click="updateCapacity">{{__.g.save}}</el-button></span>
            <span class="clearFix" style="width: 50%"><el-button  @click="dialogEditMember=false">{{__.g.close}}</el-button></span>
          </div>

          <div v-if="dialogEdit_state==='4'">updatePb
            <span class="clearFix" style="width: 50%"><el-button  type="primary" @click="updatePb">{{__.g.save}}</el-button></span>
            <span class="clearFix" style="width: 50%"><el-button  @click="dialogEditMember=false">{{__.g.close}}</el-button></span>
          </div>

          <div v-if="dialogEdit_state==='6'">
            <span class="clearFix" style="width: 50%"><el-button  :disabled="!dialogEdit_state_6_isOk" type="primary" @click="updatePw">{{__.g.save}}</el-button></span>
            <span class="clearFix" style="width: 50%"><el-button  @click="dialogEditMember=false">{{__.g.close}}</el-button></span>
          </div>

          <div v-if="dialogEdit_state==='8'">
            <span class="clearFix" style="width: 50%"><el-button :disabled="!dialogEdit_state_8_isOk" type="primary" @click="updateDept">{{__.g.save}}</el-button></span>
            <span class="clearFix" style="width: 50%"><el-button  @click="dialogEditMember=false">{{__.g.close}}</el-button></span>
          </div>
        </span>
      </el-dialog>

      <!--&lt;!&ndash;弹窗副本&ndash;&gt;-->

      <!--<el-dialog size="tiny" :title="__.g.add_user" v-model="dialogAddMember" :close-on-click-modal="false" @open="openLog" @close="closeLog" class="dialogAddMember">-->
        <!--<span class="pageBox">-->
          <!--1111111111111111-->
        <!--</span>-->
        <!--<span slot="footer" class="dialog-footer clearFix" style="width: 100%;text-align: center;">-->
          <!--<div>-->
            <!--&lt;!&ndash;<span class="clearFix" style="width: 50%"><el-button type="primary" @click="submitAddMaster">{{__.g.sure_q}}</el-button></span>&ndash;&gt;-->
            <!--&lt;!&ndash;<span class="clearFix" style="width: 50%"><el-button @click="dialogAddMember=false">{{__.g.close}}</el-button></span>&ndash;&gt;-->
            <!--<span class="clearFix" style="width: 50%"><el-button type="primary">{{__.g.sure_q}}</el-button></span>-->
            <!--<span class="clearFix" style="width: 50%"><el-button>{{__.g.close}}</el-button></span>-->
          <!--</div>-->
        <!--</span>-->
      <!--</el-dialog>-->
      <!--<div style="position: absolute;left: 0px; top: 0px; z-index: 2001; width: 100px; background: red; font-size: 14px;">-->
        <!--11111111111-->
      <!--</div>-->
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapActions} from 'vuex'
  import { requestGetCasualList,requestAccountIsExist,requestGetDepartManageList,requestAddCasual,requestCasualLock,requestCasualUnlock,requestDeleteCasual,requestGetAddressbook_nouser,requestDeptSearchManage,requestGetCasualDetail,requestUpdatePw,requestUpdatePeriod,requestUpdateCapacity,requestUpdatePb,requestUpdateDept } from 'common/api/api'
  import $ from 'common/js/jquery-vendor.js'
  import lang from 'src/lang.json'
  /* eslint-disable no-useless-escape */

  export default {
    data(){
      return ({
        'show_filter':false,
//        'show_filter_time':false,
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
          //  超级管理员的节点树
        'tree_defaultProps_admin':{
          children:'children',
          label:'mName',
          isLeaf: 'isLeaf'
        },
        'search_depts_admin':[],
        'search_depts_admin_ing':false,

        //思路：开始请求  tableDataAll  赋值
        //真正的表格数据 tableData_all_name  基于
        //                           data_model 为 all 或者 name    于tableDataAll过滤得到
        //tableData_all_name   最终的表格数据 基于
        //                           submitCheckList  过滤筛选状态得到

        'tableDataAll':[],        //初始化直接赋值
//        'tableData_all_name':[],    //根据data_model  缓存计算得到

                                        //根据 submitCheckList 缓存计算得到  也是最终绑定在table上的
        'filterText_admin':'',
        'searchNameResult':[],
        'multipleSelection':[],
        'loading_for_CasualList':true,
        'data_model':'all',
        'searchName':'',

        'submitCheckList':{'normal':true,'lock':true,'due':true},
        'checkList':{'normal':true,'lock':true,'due':true},

//        'submitCheckList_time':{'prematurity':true,'due':true},
//        'checkList_time':{'prematurity':true,'due':true},

        'right_main_currentPage1':1,
        'right_main_page_size':20,
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

        let now = new Date();
        if(this.data_model==='all'){
          arr=this.tableDataAll.concat();
        }else{
          arr=this.searchNameResult.concat();
        }

        if(this.submitCheckList.normal){
          arr1=arr.filter((item) => {
            let now = new Date();
            let end = new Date(item.validdate);
            return item.status==='0' && end-now>0;
          });
        }
        if(this.submitCheckList.lock){
          arr2=arr.filter((item) => {
            let now = new Date();
            let end = new Date(item.validdate);
            return item.status==='1' && end-now>0;
          });
        }
        if(this.submitCheckList.due){
          arr3=arr.filter((item) => {
            let now = new Date();
            let end = new Date(item.validdate);
            return end-now<=0;
          });
        }
        return arr1.concat(arr2,arr3);
//        if(this.submitCheckList_time.prematurity===false){
//          arr=arr.filter((item) => {
//            let end = new Date(item.validdate);
//            return end-now <= 0;
//          });
//        }
//        if(this.submitCheckList_time.due===false){
//          arr=arr.filter((item) => {
//            let end = new Date(item.validdate);
//            return end-now > 0;
//          });
//        }
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
            arr.push('上传');
          }
          if(this.dialogEditDate.pb.down==='1'){
            arr.push('下载');
          }
          if(this.dialogEditDate.pb.share==='1'){
            arr.push('分享');
          }
          if(this.dialogEditDate.pb.rename==='1'){
            arr.push('重命名');
          }
          if(this.dialogEditDate.pb.view==='1'){
            arr.push('预览');
          }
          if(this.dialogEditDate.pb.move==='1'){
            arr.push('移动');
          }
          if(this.dialogEditDate.pb.copy==='1'){
            arr.push('复制');
          }
          if(this.dialogEditDate.pb.delete==='1'){
            arr.push('删除');
          }
        }
        return arr.join("，");
      },
      'dialogEdit_state_6_isOk'(){
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
      'isDue'(val){
        let now = new Date();
        let end = new Date(val);
        return end-now<=0;
      },
      'updatePb'(){
        let that=this;
        requestUpdatePb({
          'upload':this.upload?'1':'0',
          'down':this.down?'1':'0',
          'share':this.share?'1':'0',
          'rename':this.rename?'1':'0',
          'view':this.view?'1':'0',
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
            that.$notify({
              title: that.__.g.success,
              message: that.__.g.handle_success,
              offset: 100,
              type:'success'
            });
          }else{
            that.$notify({
              title: that.__.g.warning,
              message: that.__.g.handle_fail,
              offset: 100,
              type:'warning'
            });
            return ;
          }
        });
      },
      'updateCapacity'(){
        let that=this;
        requestUpdateCapacity({'capacity':this.capacity,'casualId':this.dialogEditDate.casualId,'deptId':this.dialogEditDate.deptId,'token':this.token}).then(data => {
          if(data.errorCode === "200"){
            that.dialogEditMember=false;
            that.loading_for_CasualList=true;
            that.axios_GetCasualList();
            that.$notify({
              title: that.__.g.success,
              message: that.__.g.handle_success,
              offset: 100,
              type:'success'
            });
          }else{
            that.$notify({
              title: that.__.g.warning,
              message: that.__.g.handle_fail,
              offset: 100,
              type:'warning'
            });
            return ;
          }
        });
      },
      'updatePeriod'(){
        let that=this;
            requestUpdatePeriod({'period':this.period,'unit':this.unit,'casualId':this.dialogEditDate.casualId,'deptId':this.dialogEditDate.deptId,'token':this.token}).then(data => {
              if(data.errorCode === "200"){
                that.dialogEditMember=false;
                that.loading_for_CasualList=true;
                that.axios_GetCasualList();
                that.$notify({
                  title: that.__.g.success,
                  message: that.__.g.handle_success,
                  offset: 100,
                  type:'success'
                });
              }else{
                that.$notify({
                  title: that.__.g.warning,
                  message: that.__.g.handle_fail,
                  offset: 100,
                  type:'warning'
                });
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
            that.$notify({
              title: that.__.g.success,
              message: that.__.g.handle_success,
              offset: 100,
              type:'success'
            });
          }else{
            that.$notify({
              title: that.__.g.warning,
              message: that.__.g.handle_fail,
              offset: 100,
              type:'warning'
            });
            return ;
          }
        });
      },
      'updatePw'(){
        let that=this;
        if(this.pw1.length<8){
          this.$notify({
            title: that.__.g.warning,
            message: that.__.g.pw_less_8,
            offset: 100,
            type:'warning'
          });
          return ;
        }
        requestUpdatePw({'password':this.pw1,'casualId':this.dialogEditDate.casualId,'deptId':this.dialogEditDate.deptId,'token':this.token}).then(data => {
          if(data.errorCode === "200"){
            that.dialogEditMember=false;
            that.loading_for_CasualList=true;
            that.axios_GetCasualList();
            that.$notify({
              title: that.__.g.success,
              message: that.__.g.handle_success,
              offset: 100,
              type:'success'
            });
          }else{
            that.$notify({
              title: that.__.g.warning,
              message: that.__.g.handle_fail,
              offset: 100,
              type:'warning'
            });
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
          this.dialogEditTitle='账号详情';
          this.dialogEdit_state=val;
          this.getCasualDetail(casualId);
        }else if(val==='2'){
          this.dialogEditTitle='修改有效期';
          this.dialogEdit_state=val;
          this.getCasualDetail(casualId);
        }else if(val==='3'){
          this.dialogEditTitle='修改空间';
          this.dialogEdit_state=val;
          this.getCasualDetail(casualId);
        }else if(val==='4'){
          this.dialogEditTitle='修改权限';
          this.dialogEdit_state=val;
          this.getCasualDetail(casualId);
        }else if(val==='51'){
//          锁定操作
          that.$confirm(this.__.g.is_sure_confirm, this.__.g.Tips, {
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
                that.$notify({
                  title: that.__.g.success,
                  message: that.__.g.handle_success,
                  offset: 100,
                  type:'success'
                });
              }else{
                that.$notify({
                  title: that.__.g.warning,
                  message: that.__.g.handle_fail,
                  offset: 100,
                  type:'warning'
                });
                return ;
              }
            });
          }).catch(() => {
          });
        }else if(val==='52'){
//          解锁操作
          that.$confirm(this.__.g.is_sure_confirm, this.__.g.Tips, {
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
                that.$notify({
                  title: that.__.g.success,
                  message: that.__.g.handle_success,
                  offset: 100,
                  type:'success'
                });
              }else{
                that.$notify({
                  title: that.__.g.warning,
                  message: that.__.g.handle_fail,
                  offset: 100,
                  type:'warning'
                });
                return ;
              }
            });
          }).catch(() => {
          });
        }else if(val==='6'){
          this.dialogEditTitle='重置密码';
          this.dialogEdit_state=val;
          this.getCasualDetail(casualId);
        }else if(val==='7'){
          that.$confirm(this.__.g.s_t_del, this.__.g.Tips, {
            confirmButtonText:this.__.g.sure_q,
            cancelButtonText:this.__.g.cancel_q,
            type: 'warning'
          }).then(() => {
            let Params={'casualId':casualId,'deptId':deptId,'token':this.token};
            requestDeleteCasual(Params).then(data => {
              if(data.errorCode === "200"){
                that.dialogEditMember=false;
                that.loading_for_CasualList=true;
                that.axios_GetCasualList();
                that.$notify({
                  title: that.__.g.success,
                  message: that.__.g.handle_success,
                  offset: 100,
                  type:'success'
                });
              }else{
                that.$notify({
                  title: that.__.g.warning,
                  message: that.__.g.handle_fail,
                  offset: 100,
                  type:'warning'
                });
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
            <button class={(!checkList.lock && !checkList.normal && !checkList.due)?"is-disabled":""} onClick={handleFilter}>筛选</button>
            <button onClick={handleReset}>重置</button>
          </div>
          </div>
          </div>
        );
      },


//      reder_head_r_time(h, {column, $index}){
//        let __=this.__;
//        let filter_style_n={
//          'position': 'absolute',
//          'top': '40px',
//          'left': '-18px',
//          'right': '-18px',
//          'transform-origin': 'center top 0px',
//          'z-index': '2001',
//          'background-color':'#fff',
//          'display':'none'
//        };
//        let filter_style_s={
//          'position': 'absolute',
//          'top': '40px',
//          'left': '-18px',
//          'right': '-18px',
//          'transform-origin': 'center top 0px',
//          'z-index': '2001',
//          'background-color':'#fff',
//          'display':'block'
//        };
//        let show_filter = this.show_filter_time;
//        let handleStop = (e) => {
//          e.stopPropagation();
//        }
//        let handleClick=(event) => {
//          this.show_filter=false;
//          this.show_filter_time=!this.show_filter_time;
//          show_filter = this.show_filter_time;
//          window.obj_vue=this;
//        };
//        let checkList_time=this.checkList_time;
//        let setChecked_due=(e) => {
//          e.preventDefault();
//          this.checkList_time.due=!this.checkList_time.due;
//        };
//        let setChecked_prematurity=(e) => {
//          e.preventDefault();
//          this.checkList_time.prematurity=!this.checkList_time.prematurity;
//        };
//        let handleFilter=(e) => {
//          if(checkList_time.prematurity || checkList_time.due){
//            let result = {};
//            for(let key in this.checkList_time){
//              result[key] = this.checkList_time[key];
//            }
//            this.submitCheckList_time = result;
//            this.show_filter_time=false;
//          }
//        };
//        let handleReset = (e) => {
//          this.checkList_time={'prematurity':true,'due':true};
//          this.submitCheckList_time = {'prematurity':true,'due':true};
//          this.show_filter_time=false;
//        };
//        return (
//          <div style="position:relative; overflow:visible!important;" onClick={handleStop}>
//          <span class="el-table__column-filter-trigger">
//          {__.DepartmentList.status}
//      <i class={!show_filter?'el-icon-arrow-down':'el-icon-arrow-down el-icon-arrow-up'} style="margin-left:6px;" onClick={handleClick}></i>
//          </span>
//          <div class="el-table-filter" style={!show_filter?filter_style_n:filter_style_s}>
//      <div class="el-table-filter__content">
//          <div class="el-checkbox-group" id="filter_status">
//          <label class="el-checkbox">
//          <span class={!checkList_time.due?"el-checkbox__input":"el-checkbox__input is-checked"} onClick={setChecked_due}><span class="el-checkbox__inner"></span><input type="checkbox" class="el-checkbox__original" value={__.g.due} /></span><span class="el-checkbox__label">{__.g.due}</span>
//        </label>
//        <label class="el-checkbox">
//          <span class={!checkList_time.prematurity?"el-checkbox__input":"el-checkbox__input is-checked"} onClick={setChecked_prematurity}><span class="el-checkbox__inner"></span><input type="checkbox" class="el-checkbox__original" value={__.g.prematurity} /></span><span class="el-checkbox__label">{__.g.prematurity}</span>
//        </label>
//        </div>
//        </div>
//        <div class="el-table-filter__bottom"  style="background-color:#fff;">
//          <button class={(!checkList_time.due && !checkList_time.prematurity)?"is-disabled":""} onClick={handleFilter}>筛选</button>
//          <button onClick={handleReset}>重置</button>
//          </div>
//          </div>
//          </div>
//      );
//      },


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
        this.name=e.target.value;
        if(!e.target.value){
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
      'addAccountBlur'(e){
        this.account=e.target.value;
        if(e.target.value.length<8 || e.target.value.length>15){
          this.account_state='2';
          return ;
        }
        requestAccountIsExist({'account':this.account,'token':this.token}).then(data => {
          if(data.errorCode === "200"){
            if(data.result.exist===0){
              this.account_state='3';
            }else{
              this.account_state='2';
            }
          }else{
            this.account_state='2';
          }
        });
      },

      'addPwChange'(val){
        this.pw_state='1';
      },
      'addPwBlur'(e){
        this.pw=e.target.value;
        if(e.target.value.length<8 || e.target.value.length>15){
          this.pw_state='2';
          return ;
        }
        this.pw_state='3';
      },

      'addPeriodKU'(e){
        e.target.value=e.target.value.replace(/\D/g,'');
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
        let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
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
        if(data.isManage==="1"){
          this.AddSelectedDeptName=data.deptName;
          this.deptId=data.deptId;
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
        let that=this;
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
          'period':that.period,
          'unit':that.unit,
          'capacity':that.capacity,
          'mail':that.mail,
          'mobile':that.mobile,
          'deptId':that.deptId,
          'upload':that.upload?'1':'0',
          'down':that.down?'1':'0',
          'share':that.share?'1':'0',
          'rename':that.rename?'1':'0',
          'view':that.view?'1':'0',
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
            that.$notify({
              title: that.__.g.success,
              message: that.__.CasualUser.add_member_s,
              offset: 100,
              type:'success'
            });
          }else{
            throw "错误定位：临时用户_添加临时用户成员 errorCode:"+data.errorCode;
          }
        });
      },
      submitDeleteCasualUsers(){
        let that=this;
        let arr=this.multipleSelection;
        if(arr.length===0){
          that.$notify({
            title: that.__.g.warning,
            message: that.__.GroupManage.s_user_f,
            offset: 100,
            type:'warning'
          });
          return ;
        }
        this.$confirm(this.__.g.s_t_del, this.__.g.Tips, {
          confirmButtonText:this.__.g.sure_q,
          cancelButtonText:this.__.g.cancel_q,
          type: 'warning'
        }).then(() => {
          that.loading_for_CasualList=true;
          let promises = arr.map((item) => {
            return new Promise((resolve,reject) => {
              let Params={'casualId':item.casualId,'deptId':item.deptId,'token':that.token};
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
            that.$notify({
              title: that.__.g.success,
              message: that.__.g.complete_head+count+that.__.g.complete_foot,
              offset: 100,
              type:'success'
            });
          });
        }).catch(() => {
        });
      },
      submitLockCasualUsers(){
        let that=this;
        let arr=[];
        arr=this.multipleSelection.filter((item) => {
          let now = new Date();
          let end = new Date(item.validdate);
          return item.status==='0' && end-now>0;
        })
        if(arr.length===0){
          that.$notify({
            title: that.__.g.warning,
            message: that.__.UserList.s_one_normal,
            offset: 100,
            type:'warning'
          })
          return ;
        }
        this.$confirm(this.__.g.is_sure_confirm, this.__.g.Tips, {
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
            that.$notify({
              title: that.__.g.success,
              message: that.__.g.complete_head+count+that.__.g.complete_foot,
              offset: 100,
              type:'success'
            });
          });
        }).catch(() => {
        });
      },

      submitUnlockCasualUsers(){
        let that=this;
        let arr=[];
        arr=this.multipleSelection.filter((item) => {
          let now = new Date();
          let end = new Date(item.validdate);
          return item.status==='1' && end-now>0;
        })
        if(arr.length===0){
          that.$notify({
            title: that.__.g.warning,
            message: that.__.UserList.s_one_lock,
            offset: 100,
            type:'warning'
          })
          return ;
        }
        this.$confirm(this.__.g.is_sure_confirm, this.__.g.Tips, {
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
            that.$notify({
              title: that.__.g.success,
              message: that.__.g.complete_head+count+that.__.g.complete_foot,
              offset: 100,
              type:'success'
            });
          });
        }).catch(() => {
        });
      },

      submitRefresh(){
        this.loading_for_CasualList=true;
        this.show_filter=false;
        setTimeout(() => {
          this.axios_GetCasualList();
        },500);
      },

      clearSearchName(){
        this.submitCheckList={'normal':true,'lock':true,'due':true};
        this.checkList={'normal':true,'lock':true,'due':true};

//        this.submitCheckList_time={'prematurity':true,'due':true};
//        this.checkList_time={'prematurity':true,'due':true};

        this.searchName='';
        this.data_model='all';
      },
      submitSearchUser(){
        let that=this;
        let sN=this.searchName.replace(/(^\s*)|(\s*$)/g,"");
        this.submitCheckList={'normal':true,'lock':true,'due':true};
        this.checkList={'normal':true,'lock':true,'due':true};

//        this.submitCheckList_time={'prematurity':true,'due':true};
//        this.checkList_time={'prematurity':true,'due':true};

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
      },
      //请求部分
      axios_GetCasualList(){
        this.show_filter=false;
        requestGetCasualList({'token':this.token}).then(data => {
          if(data.errorCode === "200"){
            this.tableDataAll=data.result;
            this.loading_for_CasualList=false;
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
      if(this.isDeptAdmin){
        let elem = this.$refs.groupTable.$vnode.child.$el.childNodes[2];
        elem.style.maxHeight=(document.body.clientHeight-340)+'px';

        window.onresize=() => {
          let elem = this.$refs.groupTable.$vnode.child.$el.childNodes[2];
          elem.style.maxHeight=(document.body.clientHeight-340)+'px';
        }
      }

    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  #addCasualUser .el-dialog__body
    padding: 10px 20px;
  .el-tooltip__popper
    padding 0px 0px;
  .casualTooltip
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
        height 30px
        line-height 30px
        margin 12px 0px
        .input_wrapper
          display inline-block
          width 508px
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
