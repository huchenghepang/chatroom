import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import 'normalize.css/normalize.css'
import '@/assets/main.css'
import Message from './components/Message'
import CustomConfim from './components/CustomConfim'
const app = createApp(App);


// 注册到全局变量 $message
app.config.globalProperties.$message = Message
app.config.globalProperties.$customConfirm = CustomConfim

app.use(pinia)
app.use(router)
app.mount('#app')
// const  app2=app.mount('#app')
// console.log( app2);
// console.log(app2.value === App.value); // true 返回的是根组件实例 而非应用实例
export default app


