<template>
    <div>
        <!-- 聊天室 -->
        <div class="wechat-room">
            <div class="wechat-room-head">
                <div class="avator"><img :src="userInfo.avator" alt="avator" /></div>
                <div class="user-info-simple">
                    <div class="user-name">
                        <span>{{ userInfo.username }}</span>
                    </div>
                    <div class="user-info">
                        <span class="online-status">{{ isOnline ? '在线' : '离线' }}</span>
                    </div>
                    <!-- <div class="user-info"><span class="online-status">在线</span></div> -->
                </div>
                <div class="more-info cursor-pointer" @click="toggleShowInfo">•••</div>
            </div>
            <!-- 定义这个外部容器 方便隐藏滚动条 -->
            <div class="out-container-content">
                <div class="wechat-room-content">
                    <div v-for="item in messages" :key="item.id">
                        <div class="notice-msg" v-if="item.type == 1 || item.type == 2">
                            <span>{{ item.message }}</span>
                        </div>
                        <div v-else-if="item.type == 4">
                            <div class="my-msg msg" v-if="item.username == userInfo.username">
                                <img :src="item.data" alt="" class="my-msg-detail mgs-detail img-dataurl" />
                                <img class="msg-avator" :src="item.avator" />
                                <div class="placeholder">
                                    <span>{{ dateTimeConvert(item.datetime) }}</span>
                                </div>
                            </div>
                            <div class="other-msg msg" v-else>
                                <img class="msg-avator" :src="item.avator" />
                                <div class="placeholder">
                                    <span>{{ dateTimeConvert(item.datetime) }}</span>
                                </div>
                                <img :src="item.data" alt="" class="other-msg-detail mgs-detail img-dataurl" />
                            </div>
                        </div>

                        <div class="my-msg msg" v-else-if="item.type == 3 && item.username == userInfo.username">
                            <div class="my-msg-detail mgs-detail">{{ item.message }}</div>
                            <img class="msg-avator" :src="item.avator" />
                            <div class="placeholder">
                                <span>{{ dateTimeConvert(item.datetime) }}</span>
                            </div>
                        </div>
                        <div class="other-msg msg" v-else>
                            <img class="msg-avator" :src="item.avator" />
                            <div class="placeholder">
                                <span>{{ dateTimeConvert(item.datetime) }}</span>
                            </div>
                            <div class="other-msg-detail mgs-detail">{{ item.message }}</div>
                        </div>
                    </div>
                    <!-- 占位使得元素可见 scrollToView(false) -->
                    <div ref="weChatroom" class="place-view"></div>
                </div>
                <EmojiPicker
                    v-show="isShowEmojiPicker"
                    class="emoji-picker"
                    :native="true"
                    @select="onSelectEmoji"
                    :hide-search="true"
                    :hide-group-names="true"
                    :disable-skin-tones="true"
                    :disable-sticky-group-names="true"
                    :hide-group-icons="false"
                />
                <div class="users-list" v-if="isShowUserList">
                    <div class="user-item" v-for="item in usersInfoList" :key="item.id">
                        <div class="avator"><img :src="item.avator" alt="avator" /></div>
                        <div class="user-info">
                            <div class="user-name"><label for="">昵称:</label>{{ item.username }}</div>
                            <div class="user-name"><label for="">个性签名:</label>{{ item.signature }}</div>

                        </div>
                    </div>
                </div>
            </div>

            <div class="wechat-room-bottom">
                <div class="message-input-box">
                    <!-- 重要的实现: CSS控制placeholder显示 emoji表情需要contenteditable的div 而不是textarea-->
                    <!-- <div ref="messageinput" contenteditable class="message-input" ondrop="return false" ondragover="false"
              @input="messageInput" @keydown.prevent.enter.exact="sendMessage" placeholder="输入消息,按enter键发送消息"></div> -->
                    <div
                        ref="messageinput"
                        class="message-input"
                        v-editable:message.trim="message"
                        @keydown.prevent.enter.exact="sendMessage"
                        ondrop="return false"
                        ondragover="false"
                        @input="messageInput"
                        placeholder="输入消息,按enter键发送消息"
                        @focus="isShowEmojiPicker = false"
                    ></div>
                </div>
                <div class="right-area">
                    <label for="uploadpng">
                        <svg class="icon upload-pic" aria-hidden="true">
                            <use xlink:href="#icon-picture"></use>
                        </svg>
                    </label>
                    <label>
                        <svg class="icon emoji" aria-hidden="true" @click="toggleShowEmojiPicker">
                            <use xlink:href="#icon-iconemojo"></use>
                        </svg>
                    </label>
                    <input type="file" name="png" id="uploadpng" style="display: none" @change="uploadPic" />
                </div>
            </div>
            <MiniBall class="mini-ball"></MiniBall>
            
        </div>

    </div>
</template>

<script lang="ts" name="WeChat" setup>
import { ref, toRefs, watch, nextTick } from 'vue'
import './static/font_4656378_gts24ngdb4t/iconfont.js'
import dayjs from 'dayjs'
import MiniBall from '@/components/WeChat/MiniBall/MiniBall.vue'
// 导入表情包
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import {getCurrentInstance} from "vue"
const message = ref<null | string>('')
const props = defineProps(['isOnline', 'socket', 'userInfo', 'messages', 'usersInfoList'])

// 定义 `Socket` 类型（假设已经定义了具体的接口或类型）

const { messages = ref([]), isOnline = ref(false), socket = ref(null), userInfo = ref({}) } = toRefs(props)
const weChatroom = ref()
const isShowUserList = ref(false)
function toggleShowInfo(){
    isShowUserList.value = !isShowUserList.value
}

watch(messages.value, () => {
    nextTick(() => {
        weChatroom.value.scrollIntoView(false)
    })
})

// 表情包
function onSelectEmoji(emoji: { i: string }) {
    message.value += emoji.i
}

const isShowEmojiPicker = ref(false)
function toggleShowEmojiPicker() {
    isShowEmojiPicker.value = !isShowEmojiPicker.value
}

// message变化事件
function messageInput($event: Event) {
    const target = $event.target as HTMLElement
    message.value = target.textContent
}

// 处理文件转换为dataurl
function fileConvertUrl(file: File): Promise<string> {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.readAsDataURL(file)
        reader.onload = () => {
            resolve(reader.result as string)
        }
        reader.onerror = (error) => {
            console.error('无法正确的转换图片:', error)
        }
    })
}

const { proxy } = getCurrentInstance()!
// 发送消息
function sendMessage() {
    if (!isOnline.value) {
        (proxy! as any).$message({ text: '当前离线请登录', type: 'error' })
        return
    }
    if (message.value == '') {
        (proxy! as any).$message({ text: '不能发送空消息', type: 'error' })
        return
    }
    // console.log(this.message)
    socket.value.emit('message', { type: 3, message: message.value })
    message.value = ''
    return false
}
// 上传图片
async function uploadPic($event: Event) {
    const target = $event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        const file = target.files[0]
        const data = await fileConvertUrl(file)
        if (data.length > 0) {
            socket.value.emit('sendPic', { type: 4, data, fileType: 'image' })
        }
    }
}

function dateTimeConvert(dateTime: string) {
    return dayjs(dateTime).format('YYYY年M月D日 H点m分')
}
</script>

<script lang="ts">
export default {
    directives: {
        editable: {
            beforeMount(el, binding) {
                el.contentEditable = true
                el.innerHTML = binding.value
                if (!binding.arg) return
                el.addEventListener('input', () => {
                    const instance = binding.instance as { [key: string]: any }
                    // 对 arg 进行非空断言并赋值
                    const arg = binding.arg!
                    instance[arg] = binding.modifiers.trim ? el.textContent.trim() : el.textContent
                })
            },
            updated(el, binding) {
                if (binding.value !== el.textContent) {
                    el.textContent = binding.value
                }
            }
        }
    }
}
</script>


<style scoped lang="scss">

@keyframes changeUserList {
    0% {
        height: 0%;
        opacity: 0.4;
    }
    20% {
        height: 60%;
        opacity: 0.6;
    }
    40% {
        height: 80%;
        opacity: 0.7;
    }
    60% {
        height: 60%;
        opacity: 0.8;
    }
    80% {
        height: 80%;
        opacity: 0.9;
    }
}


.place-view {
    width: 100%;
    height: 1%;
}
/* 引入阿里图标 */
.icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
.wechat-room {
    width: 540px;
    height: 800px;
    background-color: #9fe764;
    z-index: 0;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    box-sizing: border-box;
    border: 1px solid #a9a9e9;

    .wechat-room-head {
        color: #837a76f4;
        height: 110px;
        box-sizing: border-box;
        border-bottom: 1px solid #ccc;
        display: flex;
        justify-content: space-between;
        padding: 30px;
        background-color: #fafafa;

        .avator {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: antiquewhite;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 50%;
            }
        }

        .user-info-simple {
            margin-left: -190px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .user-name {
                color: #000;
                font-size: 18px;
                font-weight: bold;
                font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
            }

            .online-status:hover {
                color: #dc2d96;
            }
        }

        .more-info:hover {
            color: #dc2d96;
        }
    }

    .out-container-content {
        width: 100%;
        height: 620px;
        overflow: hidden;
        position: relative;
        .emoji-picker {
            position: absolute;
            right: 0;
            bottom: -15px;
        }

        .users-list {
            position: absolute;
            top: 0;
            background-color: #e4ebde;
            right: 0;
            width: 45%;
            border: 2px solid #26bfd3;
            padding: 20px;
            max-height: 100%;
            overflow-y: scroll;
            opacity: 0.8;
            animation: changeUserList 2s cubic-bezier(0.165, 0.44, 0.78, 1) 0.3s;
            .user-item {
                width: 100%;
                margin: 10px 0;
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #cf7b7b;
                .avator {
                    img {
                        height: 50px;
                        width: 50px;
                        border-radius: 50%;
                    }
                }

                .user-info{
                    padding: 10px;
                    width: calc( 100% - 50px );
                    font-size: 12px;
                    div{
                        margin-bottom: 5px;
                        color: #424347;

                    }
                }
            }
        }
    }

    .wechat-room-content {
        width: 100%;
        height: 620px;
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        padding-right: 20px;

        .my-msg {
            margin: 10px 0px 0px 150px;
            display: flex;

            .my-msg-detail {
                margin-right: 10px;
                position: relative;
                width: 300px;
                padding: 15px;
                background-color: #ff5e5e;
                color: white;
                font-size: 16px;
                border-radius: 30px;
                line-height: 1.5;
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
            margin-top: 20px;

            .other-msg-detail {
                margin-right: 10px;
                position: relative;
                width: 300px;
                padding: 15px;
                background-color: #fff;
                color: #010101;
                font-size: 16px;
                border-radius: 30px;
                line-height: 1.5;
            }

            .other-msg-detail::before {
                content: '';
                position: absolute;
                width: 40px;
                height: 30px;
                left: -10px;
                bottom: 0px;
                background-color: #fff;
                clip-path: polygon(57% 89%, 20% 96%, 0 100%, 16% 81%, 28% 70%, 47% 50%, 62% 77%);
            }
        }

        .msg {
            position: relative;

            .msg-avator {
                width: 50px;
                height: 50px;
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
                max-height: 300px;
                object-fit: cover;
                background-color: transparent !important;
            }

            .placeholder {
                width: 50px;
                // overflow: hidden;
                span {
                    width: 30%;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    top: -10px;
                    font-size: 8px;
                    color: #130404;
                    flood-color: #eee;
                }
            }
        }

        .notice-msg {
            text-align: center;
            padding: 5px;
            font-size: 12px;
            color: #eee;
            overflow-wrap: break-word;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
    }

    .wechat-room-bottom {
        position: absolute;
        box-sizing: border-box;
        margin-top: 10px;
        bottom: 0;
        width: 100%;
        height: 60px;
        overflow: hidden;
        background-color: #fff;

        .message-input-box {
            border-left: 1px solid transparent;
            width: 100%;
            height: 100%;

            .message-input {
                margin-top: 4px;
                padding: 0 5px;
                overflow-y: scroll;
                font-size: 18px;
                width: 80%;
                height: 100%;
                display: inline-block;
                outline: none;
                border-bottom: none;
                border: transparent;
                overflow-y: scroll;
                overflow-wrap: break-word;
                font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
                -webkit-user-modify: read-write-plaintext-only;
            }
        }

        .right-area {
            position: absolute;
            right: 0;
            top: 0;
            width: 120px;
            height: 72px;
            background-color: #fff;

            .icon {
                height: 60px;
                margin-left: 15px;
                font-size: 36px;
            }
        }
    }
}

.message-input-box:has(.message-input:focus) {
    border-left: 2px solid #bfa !important;
}

.wechat-room:has(.message-input:focus) {
    border-color: #dc2d96;
    box-shadow: 1px 1px 2px rgba(224, 213, 213, 0.7);
    /* outline: 1px solid #aaa; */
}

// 添加placeholder
.message-input {
    width: 400px;
    font-size: 16px;

    &:empty::before {
        content: attr(placeholder);
        color: rgb(175, 176, 176);
    }

    &:focus::before {
        content: none !important;
    }
}
</style> 
