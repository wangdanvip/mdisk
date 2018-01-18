<template>
  <div class="login_wrapper">
    <div id="top_box">
      <div id="logo" class="center-block">
        <img src="static/img/logo_login.png" alt="美的云网盘logo">美的云控制台
      </div>
    </div>
    <div id="bottom_box">
    </div>
    <div id="login_box">
      <div class="center-block text-center" style="width: 328px;">
        <span class="title">系统登录</span>
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-addon"><i class="iconfont icon-yonghu"></i></div>
            <input id="userName" v-model="loginForm.account" class="form-control" type="text" placeholder="请输入mip账号">
          </div>
        </div>
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-addon"><i class="iconfont icon-iconfontlock"></i></div>
            <input id="password" v-model="loginForm.pw" class="form-control" type="password" placeholder="请输入密码">
          </div>
        </div>

        <span class="btn btn-primary btn-shadow" id="login_btn" @click="sumbitLogin">
                登　录
        </span>
      </div>
    </div>
    <div id="copyRight">Copyright © 1968-2015 美的集团股份有限公司 粤ICP备09215446号</div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { requestLogin } from 'common/api/api';

  export default{
    data(){
      return {
        'loginForm':{
          'account':'Testuser004',
          'pw':'DDvc@131'
        }
      }
    },
    methods:{
      aesEncrypt(data, keyStr, ivStr){
        let sendData = window.CryptoJS.enc.Utf8.parse(data);
        let key = window.CryptoJS.enc.Utf8.parse(keyStr);
        let iv  = window.CryptoJS.enc.Utf8.parse(ivStr);
        let encrypted = window.CryptoJS.AES.encrypt(sendData, key,{iv:iv,mode:window.CryptoJS.mode.CBC,padding:window.CryptoJS.pad.Pkcs7});
        return encrypted.ciphertext.toString();
      },
      sumbitLogin(){
        let that=this;
        if(!that.loginForm.account){
          that.$notify({
            title: '警告',
            message: '请填写账号',
            offset: 100,
            type:'warning'
          });
          return
        }
        if(!that.loginForm.pw){
          that.$notify({
            title: '警告',
            message: '请填写密码',
            offset: 100,
            type:'warning'
          });
          return
        }
        let userAccount = that.loginForm.account;
        let stamp = new Date().getTime();
        let password = that.aesEncrypt(that.loginForm.pw, window.CryptoJS.MD5('' + stamp).toString().substr(8, 16), '0102030405060708');
        let language = navigator.language || navigator.browserLanguage;
        let loginParams = {userAccount,password,stamp,language};
        requestLogin(loginParams).then(data => {
          let { pbJson, result } = data;
          if(pbJson.pb_admin==='0'){
            pbJson.type='超级管理员';
          }else if(pbJson.pb_admin==='1'){
            pbJson.type='群主';
          }else if(pbJson.pb_admin==='2'){
            pbJson.type='群组管理员';
          }else if(pbJson.pb_admin==='3'){
            pbJson.type='普通用户';
          }
          if(data.errorCode === "200"){
            window.localStorage.setItem('pbAdmin',JSON.stringify(pbJson));
            window.localStorage.setItem('loginInfo',JSON.stringify(result));

//            let loginInfo_str=JSON.parse(window.localStorage.getItem('loginInfo'));

            //先判断是否锁定
//            用户登录的时候    返回的


            //如果是超级管理员  定位到    部门列表    页面   /admin/#/DepartmentList
            //超级管理员判定  登录的时候，返回的   pbJson.pb_admin === '0'

            //如果是部门管理员  定位到    用户列表    页面  /admin/#/UserList
            //部门管理员判定  登录的时候，返回的   result.isDeptAdmin==='1'

            //如果是群主 或者 群主管理员   定位到   群组管理   页面   /admin/#/GroupManage
            //群主 或者 群主管理员判定  登录的时候，返回的   pbJson.pb_admin === '1'  或  pbJson.pb_admin === '2'
            if(data.pbJson.pb_admin==='0'){
              that.$router.push({name:'dataCenter'});
            }else if(data.result.isDeptAdmin==='1'){
              that.$router.push({name:'部门列表'});
            }else if(data.pbJson.pb_admin==='1' || data.pbJson.pb_admin==='2'){
              that.$router.push({name:'群组管理'});
            }else{
              that.$router.push({name:'404页面'});
            }
          }
        });
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  html,body,#app_box,#app,.login_wrapper{height:100%;font-family: "microsoft yahei";}
  login_wrapper{position:relative;}
  body{ background: #eff3f6; position: relative;}
  #top_box{
    height: 50%;
    background-color: #0092cf;
    background-image:url(../common/img/login_bg.png);
    background-repeat: no-repeat;
    background-position-y:bottom;
    background-position-x:center;
  }
  #logo{
    height:45px;
    line-height: 45px;
    width: 1100px;
    padding-top:16px;
    font-size:21px;
    color:#fff;
  }
  #logo img {
    margin-left: 54px;
    margin-right: 12px;
  }
  #login_box{
    width: 530px;
    height: 340px;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -265px;
    margin-top: -130px;
    border-radius: 5px;
    box-shadow: 8px 8px 30px #ccc;
  }
  span.title {
    font-size: 28px;
    display: inline-block;
    margin-top: 42px;
    margin-bottom: 36px;
  }
  #login_box input {
    background: #edeeee;
    font-size: 14px;
    padding-top: 14px;
    padding-bottom: 10px;
    height: 45px;
  }
  #login_btn {
    width: 328px;
    font-size: 14px;
    line-height: 24px;
    height: 42px;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  #login_box .form-group {
    margin-bottom: 18px;
  }
  #copyRight {
    position: absolute;
    width:800px;
    text-align: center;
    left: 50%;
    bottom: 52px;
    color:#989ea4;
    margin-left: -400px;
    font-size 14px
  }
</style>
