<template>
    <div class="contaniner">
        <div class="chatroom-login-container">
            <h2 class="title">虚拟角色选择</h2>
            <div class="sky-city">
                <div class="userinfo">
                    <div class="username-signature">
                        <div class="user-name">
                            <input
                                v-if="!isShowWechatRoom"
                                tabindex="1"
                                type="text"
                                placeholder="请输入用户名"
                                v-model.trim="userInfo.username"
                                maxlength="10"
                            />
                            <span v-else>{{ userInfo.username }}</span>
                        </div>
                        <br />
                        <div class="signature">
                            <input
                                v-if="!isShowWechatRoom"
                                tabindex="2"
                                type="text"
                                placeholder="请输入你的个性签名"
                                v-model.trim="userInfo.signature"
                                maxlength="20"
                            />
                            <span v-else>{{ userInfo.signature }}</span>
                        </div>
                        <button class="loginout" @click="loginOut">退出登录</button>
                    </div>
                    <div class="vir-box"></div>
                    <!-- 请选择你的头像 -->
                    <h4>请选择你的头像：</h4>
                    <div class="avator-box">
                        <div v-for="index in number" class="avator" :key="index">
                            <img
                                :class="{ active: currentIndex === index ? 1 : 0 }"
                                @click="confimPic(index, $event)"
                                :src="`./avator/${index}.png`"
                                alt=""
                                :data-img-url="`./avator/${index}.png`"
                                :tabindex="3 + index"
                            />
                        </div>
                        <div class="btn-box">
                            <button
                                v-if="!isShowWechatRoom"
                                tabindex="13"
                                @click="confirmEnterChatRoom"
                                class="confirm-enter-chat"
                            >
                                进入聊天室
                            </button>
                            <button v-else @click="confirmLeaveChatRoom" tabindex="14" class="confirm-leave-chat">
                                离开聊天室
                            </button>
                            <button
                                v-if="isShowWechatRoom"
                                @click="confirmCloseChatRoom"
                                tabindex="15"
                                class="confirm-leave-chat close-room"
                            >
                                关闭聊天室
                            </button>
                            <button
                                v-if="isShowWechatRoom && !isOnline"
                                tabindex="16"
                                @click="restartChatRoom"
                                class="restart-confirm-enter-chat confirm-leave-chat"
                            >
                                重新进入聊天室
                            </button>
                        </div>

                        <div :class="{ 'avator-mask': isShowWechatRoom }"></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 聊天室 -->
        <WeChat
            class="weChat"
            v-if="isShowWechatRoom"
            :messages="messages"
            :isOnline="isOnline"
            :userInfo="userInfo"
            :socket="socket"
            :isShowWechatRoom="isShowWechatRoom"
            :usersInfoList="usersInfoList"
        />
    </div>
</template>

<script lang="ts" name="ChatroomView" setup>
import WeChat from '@/components/WeChat/WeChat.vue'
import { disconnectSocket, connectSocket } from '../utils/socket'
import { getCurrentInstance, ref, onMounted, computed, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import { reqGetUserInfo } from '@/api/user'
import emitter from '@/utils/mitt'
const userStore = useUserStore()
const messages = ref<any[]>([])
const isOnline = ref(false)
const isShowWechatRoom = ref(false)

onMounted(() => {
    ;(proxy! as any).$message({ text: '已经在聊天室了', type: 'error' })

    // 获取用户信息
    reqGetUserInfo()
        .then((res: any) => {
            if (res.code === 200) {
                ;(proxy! as any).$message({ text: '登录状态验证成功', type: 'error' })
                return
            } else {
                ;(proxy! as any).$message({ text: '登录状态验证失败，请重新登录', type: 'error' })
                loginOut()
            }
        })
        .catch((err) => {
            if (err.message == 'timeout of 2000ms exceeded') {
                ;(proxy! as any).$message({ text: '登录状态验证连接超时，请重新登录', type: 'error' })
            } else {
                ;(proxy! as any).$message({ text: '登录状态验证失败，请重新登录', type: 'error' })
            }
            loginOut()
        })
})

interface UserInfo {
    username: string
    avator: string
    signature: string
}
const userInfo = ref<UserInfo>({
    username: '',
    avator: '',
    signature: ''
})
const usersInfoList = ref<[UserInfo]>()
let socket: Socket

const { proxy } = getCurrentInstance()!

const currentIndex = ref<null | number>(null)

function confimPic(index: number, event: Event) {
    currentIndex.value = index
    // console.log(event.target.dataset["imgUrl"])
    const target = event.target as HTMLElement
    if (target !== null && target) {
        userInfo.value.avator = target.dataset['imgUrl'] as string
    }
}

function clickConfirm(config: CustomConfirm) {
    return (proxy as any).$customConfirm(config)
}
function confirmEnterChatRoom() {
    // debugger;
    if (isShowWechatRoom.value && isOnline.value) {
        ;(proxy! as any).$message({ text: '已经在聊天室了', type: 'error' })
        return false
    }
    if (userInfo.value.avator !== '' && userInfo.value.username !== '' && userInfo.value.signature !== '') {
        isShowWechatRoom.value = true

        socket = connectSocket()
        if (!socket) return
        socket.on('connect', () => {
            ;(proxy! as any).$message({ text: '正在进行通讯...', type: 'warn' })
            // 向服务器发送消息
            socket.emit('enterchatroom', userInfo.value)
            isOnline.value = true
        })
        socket.on('broadcast', (data) => {
            messages.value.push(data)
            if (data.type == 1 || data.type == 2) {
                usersInfoList.value = data.data.map((userInfo: any) => {
                    return userInfo
                })
            }
        })
        socket.on('error', (err) => {
            isOnline.value = false
            ;(proxy! as any).$message({ text: '断开了与服务器的websocket连接' + err.message.toString, type: 'error' })
        })
        socket.on('disconnect', () => {
            isOnline.value = false
            ;(proxy! as any).$message({ text: '断开了与服务器的websocket连接', type: 'error' })
        })
    } else {
        ;(proxy! as any).$message({ text: '请完成您的信息', type: 'warn' })
        return true
    }
}
function abortWebsocket() {
    isShowWechatRoom.value = false
    userInfo.value.username = ''
    userInfo.value.avator = ''
    userInfo.value.signature = ''
    messages.value = []
    currentIndex.value = null
    // 断开与服务器的websocket连接
    disconnectSocket()
}
function confirmLeaveChatRoom() {
    clickConfirm({ title: '离开聊天室提醒', message: '确定要离开聊天室吗', confirm: disconnectSocket })
}
function confirmCloseChatRoom() {
    clickConfirm({ title: '关闭聊天室提醒', message: '确定要关闭聊天室吗', confirm: abortWebsocket })
}

function restartChatRoom() {
    disconnectSocket()
    confirmEnterChatRoom()
}
// 退出登录
async function loginOut() {
    // 这里因为是JWT 无状态 没有在后端有黑名单机制 所以前端删除就行了
    userStore.logout()
    // 跳转到首页
    window.location.href = '/'
}

// 定义一个函数来更新窗口宽度
const updateWidth = () => {
    windowWidth.value = window.innerWidth
}

// 在组件挂载时添加事件监听器
onMounted(() => {
    window.addEventListener('resize', updateWidth)
})

// 在组件卸载时移除事件监听器
onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
})
const windowWidth = ref(window.innerWidth)
// 判断是否为桌面设备
const isDesktop = computed(() => {
    return windowWidth.value >= 1024 // 1024px 以上一般认为是桌面设备
})

const number = computed(() => (isDesktop.value ? 10 : 9))

onMounted(()=>{
    emitter.on("leave",confirmLeaveChatRoom);
    emitter.on("close",confirmCloseChatRoom);
    emitter.on("reEnter",restartChatRoom);

})

</script>

<style scoped lang="scss">
button {
    cursor: pointer;
}
.chatroom-login-container {
    display: inline-block;
    text-align: center;
    padding: 0 10px;
    position: relative;
    // 退出登录按钮
    .loginout {
        position: absolute;
        top: 0px;
        left: 20px;
        width: 80px;
        height: 30px;
        background-color: #f44336;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
    }
    .loginout:hover {
        background-color: #f36b68;
    }
    .title {
        color: darkkhaki;
    }

    .user-name {
        position: relative;
        display: inline-block;
        margin-left: 80px;
        margin-bottom: 10px;
    }

    .user-name::before {
        position: absolute;
        display: block;
        width: 80px;
        height: 30px;
        font-size: 16px;
        content: '昵称:';
        color: #000;
        left: -64px;
    }

    .signature {
        position: relative;
        display: inline-block;
        margin-left: 80px;
    }

    .signature::before {
        position: absolute;
        display: block;
        width: 80px;
        height: 30px;
        font-size: 16px;
        content: '个性签名:';
        color: #000;
        left: -80px;
    }
    .avator-box {
        position: relative;
        width: 560px;
        height: 225px;
        /* height: 900px; */
        background-color: rgb(232, 235, 231);
        display: grid;
        grid-template-columns: repeat(5, minmax(100px, 1fr));
        grid-template-rows: 110px;
        grid-gap: 6px;
        box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.4);

        .avator {
            img {
                width: 100px;
                height: 100px;
                object-fit: cover;
                border-radius: 2px;
            }

            img:hover {
                border: 2px solid #ff5e5e;
                transform: translateY(2px);
            }

            .active {
                border: 2px solid #ff5e5e;
            }
        }

        .avator-mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 560px;
            height: 225px;
            background-color: rgba(0, 0, 0, 0.4);
        }
    }

    .btn-box {
        .confirm-enter-chat {
            left: 260px;
            bottom: -55px;
            position: absolute;
            font-size: 18px;
            background-color: #cb1244;
            text-align: center;
            align-content: middle;
            line-height: 50px;
            transform: translateX(-50%);
            border-radius: 30px;
        }

        .confirm-enter-chat:hover {
            border: 2px solid #ccc;
            box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .confirm-leave-chat {
            left: 260px;
            bottom: -55px;
            position: absolute;
            font-size: 18px;
            background-color: #cb1244;
            text-align: center;
            align-content: middle;
            line-height: 50px;
            transform: translateX(-50%);
            border-radius: 30px;
            @media screen and (max-width:768px) {
                display: none;
            }
        }

        .close-room {
            bottom: -110px;
        }

        .confirm-leave-chat:hover {
            border: 2px solid #ccc;
            box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .restart-confirm-enter-chat {
            bottom: -165px;
        }

        .restart-confirm-enter-chat {
            border: 2px solid #ccc;
            box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        @media screen and (max-width:768px) {
            // position: fixed;
            // background-color: #cb1244;
            // width: 200px;
            // height: 200px;
        }
    }
}

@media screen and (max-width: 768px) {
    .contaniner {
        position: relative;
        height: calc(100vh - 35px);
        .chatroom-login-container {
            width: 100vw;
            height: calc(100vh - 35px);
            padding: 0;
        }

        .avator-box {
            position: relative;
            width: 99vw !important;
            height: 50vh !important;
            /* height: 900px; */
            background-color: rgb(232, 235, 231);
            display: grid;
            grid-template-columns: repeat(3, minmax(33%, 1fr)) !important;
            grid-template-rows: auto;
            grid-gap: 1px !important;
            box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.4);
            .avator {
                img {
                    object-fit: cover;
                    border-radius: 2px;
                }
                img:hover {
                    border: 2px solid #ff5e5e;
                    transform: translateY(2px);
                }

                .active {
                    border: 2px solid #ff5e5e;
                }
            }
            .avator-mask {
                width: 100vw !important;
                position: absolute;
                top: 0;
                left: 0;
                width: 560px;
                height: 225px;
                background-color: rgba(0, 0, 0, 0.4);
            }
        }

        .weChat {
            position: absolute !important;
            top: 0;
            left: 0;
            margin: 0 !important;
            width: 100vw !important;
            height: calc(100vh - 35px) !important;
            &:deep(.wechat-room) {
                @media screen and (max-width: 768px) {
                    width: 100%;
                    height: calc(100vh - 35px) !important;

                    margin: 0 !important;
                    // transform: scale(0.8);
                    transform-origin: 0 0;

                    .wechat-room-head {
                        .user-info-simple {
                            margin: 0;
                        }
                    }

                    .out-container-content {
                        height: calc(100vh - 155px - 60px) !important;

                        .wechat-room-content {
                            height: 100%;
                            // transform: scaleY(0.9);

                            .my-msg {
                                margin: 10px 0px 0px calc(15vw);
                                display: flex;

                                .my-msg-detail {
                                    margin-right: 10px;
                                    position: relative;
                                    width: 300px;
                                    padding: 20px;
                                    background-color: #ff5e5e;
                                    color: white;
                                    font-size: 12px;
                                    border-radius: 30px;
                                    line-height: 1.1;
                                }

                                .msg-avator {
                                    right: 0;
                                }

                                .my-msg-detail::after {
                                    content: '';
                                    position: absolute;
                                    width: 40px;
                                    height: 30px;
                                    right: -20px;
                                    bottom: 10px;
                                    background-color: #ff5e5e;
                                    clip-path: polygon(15% 36%, 58% 71%, 100% 91%, 71% 89%, 26% 81%, 0 56%, 6% 43%);
                                    /* clip-path: polygon(62% 77%, 47% 50%, 28% 70%, 16% 81%, 0 100%, 20% 96%, 57% 89%); */
                                    clip-path: polygon(38% 78%, 63% 93%, 100% 100%, 77% 81%, 64% 66%, 52% 51%, 32% 64%);
                                }
                            }

                            .other-msg {
                                display: flex;
                                margin-top: 10px;

                                .other-msg-detail {
                                    margin-right: 10px;
                                    position: relative;
                                    width: 300px;
                                    padding: 20px;
                                    background-color: #fff;
                                    color: #010101;
                                    font-size: 12px;
                                    left: -10px;
                                    border-radius: 30px;
                                    line-height: 1.1;
                                }

                                .other-msg-detail::before {
                                    content: '';
                                    position: absolute;
                                    width: 40px;
                                    height: 40px;
                                    left: -12px;
                                    bottom: 5px;
                                    background-color: #fff;
                                    clip-path: polygon(57% 89%, 20% 96%, 0 100%, 16% 81%, 28% 70%, 47% 50%, 62% 77%);
                                }
                            }

                            .msg {
                                .msg-avator {
                                    width: 30px;
                                    height: 30px;
                                    object-fit: cover;
                                    border-radius: 50%;
                                    position: absolute;
                                    bottom: 0;
                                }

                                .mgs-detail {
                                    white-space: normal;
                                    /* 当一个单词过长是默认不会换行 这个时候需要强制其进行换行 */
                                    overflow-wrap: break-word;
                                }

                                .img-dataurl {
                                    max-width: 100%;
                                    padding: 10px 30px;
                                    max-height: 250px;
                                    object-fit: cover;
                                    background-color: transparent !important;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
