import { createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {useUserStore} from "../stores/modules/user"
import app from '@/main.ts'
const userStore = useUserStore()



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path:"/chatroom",
      name:"catroom",
      component: () => import('../views/ChatroomView.vue'),
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
})


router.beforeEach((to,from,next)=>{

  // 如果是去首页 登录 注册 则方向
  if(to.name === 'home' && !userStore.isLogin){
      // 如果已经登录 那么就不能去登录页面
      next()
  }else if(to.name === 'home' && userStore.isLogin){

    app.config.globalProperties.$message({text:"已经登录了，请退出登录后重试",type:"warn"})    
    next('/chatroom')
  }else{
    // 去其他路由必须登录 否则重定向到首页 登录注册
    if(userStore.jwtToken && userStore.isLogin){
        app.config.globalProperties.$message({text:"登录状态验证成功",type:"success"}) 
        next()
    }else{
      app.config.globalProperties.$message({text:"登录状态失效了,请重新登录",type:"success"}) 
      next('/')
    }
    
    
    
    
  }
})

export default router
