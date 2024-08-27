import {defineStore} from "pinia"
import pinia from "@/stores";

export const useUserStore = defineStore("user",{
    state:()=>{
        const jwtToken:string = localStorage.getItem("jwtToken") || "";
        const userInfo:object = {}
        return {
            jwtToken,
            userInfo
        }
    },
    actions:{
        login({token}:{token:string}):void{
            // 根据登陆信息 处理得到JWT 保存JWT
            localStorage.setItem('jwtToken',token );
            this.jwtToken = token;
            
        },
        logout(){
            this.jwtToken = "";
            localStorage.removeItem('jwtToken');
        }
    },
    getters:{
        isLogin(state){
            return state.jwtToken?true:false;
        }
    }
})

export function useCounterStoreWithOut(){
    return useUserStore(pinia)
}