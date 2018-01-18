import axios from 'axios';
import config from 'src/config'

let base = config.router_URL || ''

//5.2.1  用户登录接口
export const requestLogin = params => {
  return axios.post(`${base}/v1/mideastore/service/login`,params, {id: '230', time: (new Date()).getTime()}).then(res => res.data);
};
//5.2.26 搜索用户
export const requestSearchUser = params => {
  return axios.post(`${base}/v1/mideastore/service/group/search/user`,params, {id: '202', time: (new Date()).getTime()}).then(res => res.data);
};
//5.2.23 添加群主
export const requestAddUser = params => {
  return axios.post(`${base}/v1/mideastore/service/group/add/master`,params, {id: '199', time: (new Date()).getTime()}).then(res => res.data);
};
//5.2.22 获取群主列表
export const requestGetMasterList = (token,index={"index":"1"},pageSize={"pageSize":"999"}) => {
  let params=Object.assign(token,index,pageSize);
  return axios.post(`${base}/v1/mideastore/service/group/get/master/list`,params, {id: '198', time: (new Date()).getTime()}).then(res => {
    res.data.result = res.data.result.map(function (item) {
      if('gNames' in item){
        item.d_state='1'
      }else{
        item.d_state='0'
      }
      return item;
    });
    return res.data
  });
};
//5.2.25 查看群主详情
export const requestGetMasterDetail = params => {
  return axios.post(`${base}/v1/mideastore/service/group/get/master/detail`,params, {id: '201', time: (new Date()).getTime()}).then(res => res.data);
};
//5.2.28 转移群主
export const requestTransferMaster = params => {
  return axios.post(`${base}/v1/mideastore/service/group/transfer/master`,params, {id: '229', time: (new Date()).getTime()}).then(res => res.data);
};
//5.2.24 删除群主
export const requestDeleteMaster = params => {
  return axios.post(`${base}/v1/mideastore/service/group/delete/master`,params, {id: '200', time: (new Date()).getTime()}).then(res => res.data);
};
//5.2.19 获取用户管理的群组列表
export const requestGetManageList = (token,index={"index":"1"},pageSize={"pageSize":"999"}) => {
  let params=Object.assign(token,index,pageSize);
  return axios.post(`${base}/v1/mideastore/service/group/get/manage/list`,params, {id: '195', time: (new Date()).getTime()}).then(res => res.data);
};
//5.2.3 创建群组
export const requestGroupCreat = params => {
  return axios.post(`${base}/v1/mideastore/service/group/create`,params, {id: '190', time: (new Date()).getTime()}).then(res => res.data);
};

//5.2.3 创建群组
export const requestGroupUpdate = params => {
  return axios.post(`${base}/v1/mideastore/service/group/update`,params, {id: '190', time: (new Date()).getTime()}).then(res => res.data);
};
// 5.2.17 删除群组
export const requestGroupDelete = params => {
  return axios.post(`${base}/v1/mideastore/service/group/delete/group`,params, {id: '194', time: (new Date()).getTime()}).then(res => res.data);
};

// 5.2.7  获取群组成员列表
export const requestGroupGetMembers = (params) => {
  return axios.post(`${base}/v1/mideastore/service/group/get/members`,params, {id: '191', time: (new Date()).getTime()}).then(res => {
    res.data.result = res.data.result.map(function (item) {
      item.pb_list=item.pb_list!==0;
      item.pb_view=item.pb_view!==0;
      item.pb_move=item.pb_move == 1;
      item.pb_copy=item.pb_copy == 1;
      item.pb_down=item.pb_down!==0;
      item.pb_upload=item.pb_upload!==0;
      item.pb_delete=item.pb_delete!==0;
      item.pb_rename=item.pb_rename!==0;
      item.pb_share=item.pb_share!==0;
      item.pb_admin=item.isAdmin!==2;
      return item;
    });
    return res.data
  });
};

// 5.2.9  添加群组成员
export const requestAddGroupMember = params => {
  return axios.post(`${base}/v1/mideastore/service/group/add/members`,params, {id: '193', time: (new Date()).getTime()}).then(res => res.data);
};

// 5.2.21 移除群组成员
export const requestDeleteGroupMember = params => {
  return axios.post(`${base}/v1/mideastore/service/group/delete/members`,params, {id: '197', time: (new Date()).getTime()}).then(res => res.data);
};

// 5.2.20 修改用户群组权限
export const requestUpdateGroupPb = params => {
  return axios.post(`${base}/v1/mideastore/service/group/update/pb`,params, {id: '196', time: (new Date()).getTime()}).then(res => res.data);
};

// 5.2.29 获取群组容量
export const requestGetCapacity = params => {
  return axios.post(`${base}/v1/mideastore/service/group/get/capacity`,params, {id: '203', time: (new Date()).getTime()}).then(res => res.data);
};


// 5.2.8 获取通讯录
export const requestGetAddressbook = params => {
  return axios.post(`${base}/v1/mideastore/service/group/get/addressbook`,params, {id: '192', time: (new Date()).getTime()}).then(res => {
    res.data.result = res.data.result.map(function (item) {
      if(item.mTag===1){
        item.isLeaf=true;
      }else{
        item.isLeaf=false;
      }
      return item;
    });
    return res.data
  });
};

export const requestGetAddressbook_nouser = params => {
  return axios.post(`${base}/v1/mideastore/service/group/get/addressbook`,params, {id : '192', time: (new Date()).getTime()}).then(res => {
    res.data.result = res.data.result.filter((item) => {
      if(item.mTag===2){
        item.isLeaf=false;
      }
      return item.mTag===2;
    })
    return res.data
  });
};

// 6.2.17 获取管理的部门列表
export const requestGetDepartManageList = params => {
  return axios.post(`${base}/v1/mideastore/service/department/get/manage/list`,params, {id: '205', time: (new Date()).getTime()}).then(res => res.data);
};

// 6.2.19 获取用户列表
export const requestGetUserList = params => {
  return axios.post(`${base}/v1/mideastore/service/user/get/list`,params, {id: '207', time: (new Date()).getTime()}).then(res => {
    return res.data
  });
};

export const requestGetUserListInit = params => {
  return axios.post(`${base}/v1/mideastore/service/user/get/list`,params, {id: '207', time: (new Date()).getTime()}).then(res => {
    return res.data
  });
};

// 6.2.21 锁定临时用户
export const requestUserLock = params => {
  return axios.post(`${base}/v1/mideastore/service/user/lock`,params, {id: '209', time: (new Date()).getTime()}).then(res => res.data);
};

// 6.2.22 解锁用户
export const requestUserUnlock = params => {
  return axios.post(`${base}/v1/mideastore/service/user/unlock`,params, {id: '210', time: (new Date()).getTime()}).then(res => res.data);
};

// 6.2.20 搜索管理部门下的用户
export const requestDeptSearchUser = params => {
  return axios.post(`${base}/v1/mideastore/service/department/search/user`,params, {id: '208', time: (new Date()).getTime()}).then(res => res.data);
};

// 6.2.18 搜索管理的部门
export const requestDeptSearchManage = params => {
  return axios.post(`${base}/v1/mideastore/service/department/search/manage`,params, {id: '206', time: (new Date()).getTime()}).then(res => res.data);
};

// 6.2.24 获取临时用户列表
export const requestGetCasualList = (token,index={"index":"1"},pageSize={"pageSize":"29999"}) => {
  let params=Object.assign(token,index,pageSize);
  return axios.post(`${base}/v1/mideastore/service/user/casual/get/list`,params, {id: '212', time: (new Date()).getTime()}).then(res => res.data);
}

// 6.2.35 获取账号是否已存在
export const requestAccountIsExist = params => {
  return axios.post(`${base}/v1/mideastore/service/user/account/is/exist`,params, {id: '221', time: (new Date()).getTime()}).then(res => res.data);
}

// 6.2.23 添加临时用户
export const requestAddCasual = params => {
  return axios.post(`${base}/v1/mideastore/service/user/casual/add`,params, {id: '211', time: (new Date()).getTime()}).then(res => res.data);
}

// 6.2.26 锁定临时用户
export const requestCasualLock = params => {
  return axios.post(`${base}/v1/mideastore/service/user/casual/lock`,params, {id: '213', time: (new Date()).getTime()}).then(res => res.data);
}

// 6.2.27 解锁临时用户
export const requestCasualUnlock = params => {
  return axios.post(`${base}/v1/mideastore/service/user/casual/unlock`,params, {id: '214', time: (new Date()).getTime()}).then(res => res.data);
}

// 6.2.28 删除临时用户
export const requestDeleteCasual = params => {
  return axios.post(`${base}/v1/mideastore/service/user/casual/delete`,params, {id: '215', time: (new Date()).getTime()}).then(res => res.data);
}

// 6.2.29 查看临时用户详情
// res.data.result.deptName_single=res.data.result.deptName.split('_').pop();
export const requestGetCasualDetail = params => {
  return axios.post(`${base}/v1/mideastore/service/user/casual/detail`,params, {id: '216', time: (new Date()).getTime()}).then((res) => {
    return res.data
  });
}

// 6.2.33 临时用户重置密码
export const requestUpdatePw = params => {
  return axios.post(`${base}/v1/mideastore/service/user/casual/update/password`,params, {id: '220', time: (new Date()).getTime()}).then(res => res.data);
}

// 6.2.30 修改临时用户有效期
export const requestUpdatePeriod = params => {
  return axios.post(`${base}/v1/mideastore/service/user/casual/update/period`,params, {id: '217', time: (new Date()).getTime()}).then(res => res.data);
}

// 6.2.31 修改临时用户存储空间
export const requestUpdateCapacity = params => {
  return axios.post(`${base}/v1/mideastore/service/user/casual/update/capacity`,params, {id: '218', time: (new Date()).getTime()}).then(res => res.data);
}

// 6.2.32 修改临时用户权限
export const requestUpdatePb = params => {
  return axios.post(`${base}/v1/mideastore/service/user/casual/update/pb`,params, {id: '219', time: (new Date()).getTime()}).then(res => res.data);
}

// 5.2.34 修改临时用户所属部门
export const requestUpdateDept = params => {
  return axios.post(`${base}/v1/mideastore/service/user/casual/update/department`,params, {id: '204', time: (new Date()).getTime()}).then(res => res.data);
}

//7.1.1获取部门列表
export const listDepts = params => {
  return axios.post(`${base}/v1/mideastore/service/department/get/list`, params, {id: '222', time: (new Date()).getTime()}).then(res => res.data)
}
//7.1.2锁定部门
export const lockDept = params => {
  return axios.post(`${base}/v1/mideastore/service/department/lock`, params, {id: '223', time: (new Date()).getTime()}).then(res => res.data)
}
//7.1.3解锁部门
export const unlockDept = params => {
  return axios.post(`${base}/v1/mideastore/service/department/unlock`, params, {id: '224', time: (new Date()).getTime()}).then(res => res.data)
}
//7.1.4 获取部门管理员列表
export const getDeptAdmins = params => {
  return axios.post(`${base}/v1/mideastore/service/department/admin/get/list`, params, {id: '225', time: (new Date()).getTime()}).then(res => res.data)
}
//7.1.5 添加部门管理员
export const addDeptAdmin = params => {
  return axios.post(`${base}/v1/mideastore/service/department/admin/add`,params, {id: '226', time: (new Date()).getTime()}).then(res => res.data);
};
//7.1.6 删除部门管理员
export const delDeptAdmin = params => {
  return axios.post(`${base}/v1/mideastore/service/department/admin/delete`, params, {id: '227', time: (new Date()).getTime()}).then(res => res.data)
}
//7.1.7 编辑部门管理员
export const updateDeptAdmin = params => {
  return axios.post(`${base}/v1/mideastore/service/department/admin/update`, params, {id: '228', time: (new Date()).getTime()}).then(res => res.data)
}
//9.1.1 用户是否管理员
export const getLoginInfo = params => {
  return axios.post(`${base}/v1/mideastore/service/is/manager`, params, {id: '185', time: (new Date()).getTime()}).then(res => res.data)
}
