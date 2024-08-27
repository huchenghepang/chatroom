<template>
    <div class="home-background">
        <div class="main">
            <LoginRegister class="bg-logoin-register"></LoginRegister>
            <div class="bc-container" ref="containerBg" @mousemove="changeXY" @mouseout="moverOut">
                <div class="bck-pic"></div>
                <div class="bck-pic-border" ref="bckPic"></div>
            </div>
            <CubeRorate v-if="isDesktop" class="Cube" :imagesList="cubeImageList"></CubeRorate>
            <BoundingBalls
                v-if="isDesktop"
                class="bounding-balls"
                :width="windowWidth"
                :height="100"
                :ballCount="10"
            ></BoundingBalls>
        </div>
        <div class="footer">
            <div class="left"></div>
            <ul class="about-info" @click="(proxy! as any).$message({text:'尚未开发完成',type:'warn'})">
                <li>关于我们</li>
                <li>联系我们</li>
                <li>评价我们</li>
                <li>客服中心</li>
            </ul>
            <div class="copyright">
                <p class="address">地址：江西省南昌市新建区</p>
                <p class="record">赣ICP备2024040386</p>
            </div>
            <div class="right"></div>
        </div>
    </div>
</template>

<script lang="ts" name="HomeView" setup>
import BoundingBalls from '@/components/BoundingBalls/BoundingBalls.vue'
import LoginRegister from '@/components/LoginRegister/LoginRegister.vue'
import CubeRorate from '@/components/Cube/CuebeRorate.vue'
import { ref, computed, onMounted, onUnmounted, getCurrentInstance, provide, watchEffect, watch } from 'vue'
const { proxy } = getCurrentInstance()!

const containerBg = ref(null)
const bckPic = ref(null)
const cubeImageList = ref([
    '/source/jpg/cube-1.jpeg',
    '/source/jpg/cube-2.jpg',
    '/source/jpg/cube-3.jpeg',
    '/source/jpg/cube-4.jpg',
    '/source/jpg/cube-5.jpeg',
    '/source/jpg/cube-6.jpg'
])
/* // 定义一个响应式变量来存储窗口宽度
const windowWidth = ref(window.innerWidth);

// 定义一个函数来更新窗口宽度
const updateWidth = () => {
  windowWidth.value = window.innerWidth;
};

const userAgent = navigator.userAgent.toLowerCase();

// 判断是否为桌面设备
const isDesktop = computed(() => {
  return !/mobile|android|iphone|ipad|phone|tablet/i.test(userAgent);
}); */

function changeXY($event: Event) {
    ;(bckPic.value! as HTMLElement).style.visibility = 'visible'

    const target = $event.target
    const rect = (target! as HTMLElement).getBoundingClientRect()

    const offsetX = ($event as MouseEvent).clientX - rect.left
    const offsetY = ($event as MouseEvent).clientY - rect.top

    const percentX = (Math.min(Math.max(offsetX / rect.width, 0), 1) * 100).toFixed(2)
    const percentY = (Math.min(Math.max(offsetY / rect.height, 0), 1) * 100).toFixed(2)

    ;(containerBg.value! as HTMLElement).setAttribute('style', `--x: ${percentX}%;--y: ${percentY}%;`)
}

function moverOut() {
    ;(bckPic.value! as HTMLElement).style.visibility = 'hidden'
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

</script>

<style scoped lang="scss">
.home-background {
    width: 100%;
    height: calc(100vh - 35px);

    position: relative;

    .main {
        position: relative;
        background: radial-gradient(ellipse at top right, #31772e 10%, #083b42 60%, transparent 100%);
        height: calc(100vh - 35px - 150px);
        .bg-logoin-register {
            position: absolute;
            background: linear-gradient(to bottom, var(--colorA), var(--colorB), var(--colorC));
            animation: changeColor 8s cubic-bezier(0.455, 0.03, 0.515, 0.955) 1s infinite alternate-reverse;
            @media screen and (min-width: 768px) {
                top: 50%;
                transform: translateY(-50%);
            }
        }
        @media screen and (min-width: 768px) {
            .bc-container {
                // background-color: #03a9f4;
                width: 586px;
                height: 332px;
                position: absolute;
                right: 0;
                border-radius: 30px;
                transition: cubic-bezier(0.075, 0.82, 0.165, 1) 0.1;
                --x: 20;
                --y: 30;
                z-index: 1;
                // 背景图片的边框
                .bck-pic-border {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    border-radius: 30px;
                    mask: radial-gradient(
                        circle at var(--x) var(--y),
                        #000,
                        #000,
                        transparent,
                        transparent,
                        transparent
                    );
                    z-index: 1;
                    &::before {
                        width: 100%;
                        height: 100%;
                        content: '';
                        position: absolute;
                        border-radius: 30px;
                        background: conic-gradient(#03a9f4, #e91e63, #9c27b0, #ff5722, #03a9f4);
                    }
                    &::after {
                        width: 100%;
                        height: 100%;
                        content: '';
                        position: absolute;
                        border-radius: 30px;
                        background: conic-gradient(#03a9f4, #e91e63, #9c27b0, #ff5722, #03a9f4);
                    }
                }

                // 背景图片
                .bck-pic {
                    width: 580px;
                    height: 326px;
                    object-fit: cover;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    margin: auto;
                    // transform: translate(-50%,-50%);
                    overflow: hidden;
                    border-radius: 30px;
                    &::before,
                    &::after {
                        content: '';
                        position: absolute;
                        background: url('/source/jpg/home-background.jpg');
                        background-size: cover;
                        background-position: center;
                        border-radius: 50px;
                        z-index: 999;
                    }
                    &::before {
                        inset: 0;
                        filter: blur(20px);
                    }

                    &::after {
                        inset: 20px;
                    }
                }
            }
            .Cube {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            .bounding-balls {
                position: absolute;
                bottom: 0;
                right: 0;
                background: rgb(240, 245, 242); /* 确保背景透明 */
                border: none; /* 移除边框，如果不需要的话 */
            }
        }
    }
    // 登录注册的组件

    // 底部的装饰
    .footer {
        position: absolute;
        border-top-left-radius: 20px;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 150px;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        .about-info {
            display: flex;
            justify-content: space-around;
            li {
                font-size: 16px;
                color: #fff;
                cursor: pointer;
                &:hover {
                    color: rgb(217, 255, 0);
                }
            }
        }
        .copyright {
            display: flex;
            justify-content: space-around;
            color: #fff;
            p {
                font-size: 16px;

                cursor: pointer;
                &:hover {
                    color: rgb(217, 255, 0);
                }
            }
        }
    }
}
</style>
