// 封装axios

import axios from 'axios'
import nprogress from "nprogress";
import "nprogress/nprogress.css"
import { useCounterStoreWithOut} from '../stores/modules/user'
import app from '@/main'
const userStore = useCounterStoreWithOut()

const instance = axios.create({
    baseURL: import.meta.env.VITE_SOCKET_URL, // 基础路径
    timeout: 10000, // 超时时间
})

instance.interceptors.request.use(function(config){
    if(userStore.jwtToken){
        config.headers['Authorization'] = `${userStore.jwtToken}`;
    }
    // 进度条开始
    nprogress.start()
    return config;
})

instance.interceptors.response.use(response=>{
    nprogress.done()
    const data =response.data;
    return data
},err=>{
    if(err.message === 'Network Error'){
        app.config.globalProperties.$message({text:"无法获取网络,或者服务器失联中...",type:"error"}) 
    }
    nprogress.done()
    return Promise.reject(err);
    
})

export default instance