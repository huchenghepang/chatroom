<template>
    <dialog class="message-component" id="message-box">
        <div class="message-div">
            <h2 class="header">{{ title }}</h2>
            <p class="content">
                {{ message }}
            </p>
        </div>
        <button class="leftbtn" @click="nativeCancel">取消</button>
        <button class="rightbtn" @click="nativeConfirm">确认</button>
        <div v-if="isShowClose" class="close-button" @click="nativeClose">X</div>
    </dialog>
</template>
<script setup>
import { getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
// 销毁对话框
function destroyDialog() {
    // 引用到父元素的父元素 然后让父元素删除掉父亲包括自己 ---- 呃呃呃 有点意思哈 哈哈哈
    proxy.$el.parentNode.parentNode.removeChild(proxy.$el.parentNode)
}

// 关闭弹窗的函数
function nativeClose() {
    if (props.close) {
        props.close()
        destroyDialog()
    } else {
        destroyDialog()
    }
}

// 取消按钮函数
function nativeCancel() {
    if (props.cancel) {
        props.cancel()
    } 
    nativeClose()
    return false
}

// 确认按钮函数
function nativeConfirm() {
    if (props.confirm) {
        props.confirm()
    } 
    nativeClose()
    return true
}

const props = defineProps({
    title: {
        type: String,
        default: '提醒'
    },
    message: {
        type: String,
        default: '确认要关闭吗？'
    },
    close: {
        type: Function
    },
    cancel: {
        type: Function
    },
    confirm: {
        type: Function
    },
    isShowClose: {
        type: Boolean,
        default: true
    }
})
</script>
<style scoped lang="scss">
/* 基础样式 */
.message-component {
    position: relative;
    margin-top: 0;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 80%;
    max-width: 320px; /* 调整了最大宽度，使弹框更小 */
    z-index: 1000;
    transition: all 0.3s ease;
    font-family: Arial, sans-serif;
    overflow: hidden;
}

/* 弹框的内容容器 */
.message-div {
    padding: 15px; /* 缩小内边距 */
}

/* 标题样式 */
.header {
    margin: 0;
    font-size: 1.3rem; /* 缩小标题字体 */
    color: #333;
    text-align: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
}

/* 内容文本样式 */
.content {
    margin: 10px 0;
    font-size: 0.9rem; /* 缩小内容字体 */
    color: #666;
    text-align: center;
}

/* 按钮样式 */
button {
    display: inline-block;
    padding: 8px 16px; /* 缩小按钮的内边距 */
    font-size: 0.9rem; /* 缩小按钮字体 */
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #0056b3;
}

/* 左侧按钮（取消按钮）样式 */
.leftbtn {
    background-color: #6c757d;
}

.leftbtn:hover {
    background-color: #5a6268;
}

/* 右侧按钮（确认按钮）样式 */
.rightbtn {
    position: absolute;
    bottom: 15px;
    right: 15px;
    background-color: #28a745;
}

.rightbtn:hover {
    background-color: #218838;
}

/* 关闭按钮样式 */
.close-button {
    padding: 5px 15px 15px;
    position: absolute;
    right: 0;
    top: 0;
}

.button:hover {
    background-color: #c82333;
}

/* 按钮布局调整 */
button + button {
    margin-left: 8px; /* 缩小按钮间距 */
}

/* 屏幕宽度小于 500px 时调整布局 */
@media (max-width: 786px) {
    .message-component{
        margin-top: 50%;
        transform: translateY(-50%);
    }
    .message-div {
        padding: 10px; /* 移动设备上进一步缩小内边距 */
    }

    .header {
        font-size: 1.1rem; /* 移动设备上缩小标题字体 */
        padding-bottom: 8px;
    }

    .content {
        font-size: 0.85rem; /* 移动设备上缩小内容字体 */
    }
}
</style>
