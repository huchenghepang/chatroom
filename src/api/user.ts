// 登录请求
import request from '../utils/request'

export const reqLogin = (data:{account:string,password:string})=>request({url:"/api/login",method:"POST",data})

// 注册请求
export const reqRegister = (data:{account:string,password:string})=>request({url:"/api/register",method:"POST",data})

// 请求用户信息
export const reqGetUserInfo = ()=>request({url:"/user/userinfo",method:"get",timeout:2000})