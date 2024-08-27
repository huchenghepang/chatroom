<template>
    <div class="container">
        <div class="togger-button-box">
            <button class="login-btn btn" :class="{ 'active-btn': loginFormVisible }" @click="toggleForm(1)">
                登录
            </button>
            <button class="register-btn btn" :class="{ 'active-btn': !loginFormVisible }" @click="toggleForm(2)">
                注册
            </button>
        </div>
        <div class="content-container">
            <div class="login-form" v-if="loginFormVisible">
                <!-- Login form -->
                <div :class="{ error: v$login.phoneNumber.$errors.length }">
                    <input
                        type="text"
                        class="iphone"
                        maxlength="11"
                        placeholder="手机号"
                        id="phone"
                        name="username"
                        @input="v$login.phoneNumber.$touch"
                        autocomplete="phone"
                        v-model="loginForm.phoneNumber"
                    />
                    <div class="input-errors" v-for="error of v$login.phoneNumber.$errors" :key="error.$uid">
                        <div class="error-msg" v-if="error.$validator == 'required'">电话是必须填写的</div>
                        <div class="error-msg" v-else>请填写正确的电话号码格式</div>
                    </div>
                </div>
                <div :class="{ error: v$login.password.$errors.length }">
                    <input
                        type="password"
                        class="password"
                        maxlength="20"
                        placeholder="密码"
                        autocomplete="currentpassword"
                        @blur="v$login.password.$touch"
                        v-model="loginForm.password"
                    />
                    <div class="input-errors" v-for="error of v$login.password.$errors" :key="error.$uid">
                        <div class="error-msg" v-if="error.$validator == 'required'">密码是必须填写的</div>
                        <div class="error-msg" v-else>密码要求：大小写字母、数字、特殊字符</div>
                    </div>
                </div>
                <div class="bottom-info-login">
                    <div>
                        <input
                            type="checkbox"
                            name="checkedLogin30"
                            id="checkedLogin30"
                            class="pointer-btn"
                            v-model="loginForm.checkedLogin30"
                        />
                        <span>30天免登录</span>
                    </div>
                    <span>忘记密码?</span>
                </div>
            </div>
            <div class="register-form" v-if="!loginFormVisible">
                <div :class="{ error: v$.phoneNumber.$errors.length }">
                    <input
                        type="text"
                        class="iphone focused"
                        maxlength="11"
                        placeholder="手机号"
                        @input="v$.phoneNumber.$touch"
                        v-model="registerForm.phoneNumber"
                    />
                    <div class="input-errors" v-for="error of v$.phoneNumber.$errors" :key="error.$uid">
                        <div class="error-msg" v-if="error.$validator == 'required'">电话是必须填写的</div>
                        <div class="error-msg" v-else>请填写正确的电话号码格式</div>
                    </div>
                </div>
                <div :class="{ error: v$.password.$errors.length }">
                    <input
                        type="password"
                        class="password"
                        maxlength="20"
                        placeholder="密码"
                        @blur="v$.password.$touch"
                        v-model="registerForm.password"
                    />
                    <div class="input-errors" v-for="error of v$.password.$errors" :key="error.$uid">
                        <div class="error-msg" v-if="error.$validator == 'required'">密码是必须填写的</div>
                        <div class="error-msg" v-else>密码要求：大小写字母、数字、特殊字符</div>
                    </div>
                </div>
                <div :class="{ error: v$.confirmPassword.$errors.length }">
                    <input
                        type="password"
                        class="password"
                        maxlength="20"
                        placeholder="确认密码"
                        @input="v$.confirmPassword.$touch"
                        v-model="registerForm.confirmPassword"
                    />
                    <div class="input-errors" v-for="error of v$.confirmPassword.$errors" :key="error.$uid">
                        <div class="error-msg" v-if="error.$validator == 'required'">密码是必须填写的</div>
                        <div class="error-msg" v-else>密码要求：大小写字母、数字、特殊字符</div>
                    </div>
                </div>
            </div>
            <button class="bottom-btn-box" @click="loginOrRegister">{{ btnInfo }}</button>
        </div>

        <div class="footer-info">
            <p>JEFF的天空之城<small>《用户协议》</small></p>
            <p>温馨提醒：网站使用的是HTTP不安全的传输协议，请不要使用真实信息和密码，以免造成泄漏</p>
        </div>
    </div>
</template>

<script lang="ts" name="Login" setup>
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { reqLogin, reqRegister } from '@/api/user'

import { useUserStore } from '@/stores/modules/user'
import router from '@/router'

class LoginForm {
    phoneNumber: string = ''
    password: string = ''
    checkedLogin30: boolean = false
}

const mustBePhoneNumber = (value: string) => {
    return !helpers.req(value) || /^1[3-9]\d{9}$/.test(value)
}

const mustBePassword = (value: string) => {
    return !helpers.req(value) || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(value)
}
const isCommon = ref(false)
const rules = {
    phoneNumber: { required, mustBePhoneNumber },
    password: { required, mustBePassword },
    confirmPassword: { required, mustBePassword }
}
const ruleLogin = {
    phoneNumber: { required, mustBePhoneNumber },
    password: { required, mustBePassword }
}

class RegisterForm {
    phoneNumber: string = ''
    password: string = ''
    confirmPassword: string = ''
}

const loginFormVisible = ref(true)
const loginForm = ref(new LoginForm())
const registerForm = ref(new RegisterForm())
const v$ = useVuelidate(rules, registerForm)
const v$login = useVuelidate(ruleLogin, loginForm)
const btnInfo = computed(() => (loginFormVisible.value ? '登录' : '注册'))

function toggleForm(frag: 1 | 2): void {
    loginFormVisible.value = frag === 1 ? true : false
    if (frag === 1) {
        loginForm.value = new LoginForm()
        v$login.value.$reset()
    } else if (frag === 2) {
        registerForm.value = new RegisterForm()
        v$.value.$reset()
    }
}

const userStore = useUserStore()
const { proxy } = getCurrentInstance()!

// 登录

async function login() {
    const isFormCorrect = await v$login.value.$validate()

    if (isFormCorrect) {
        const data = {
            account: loginForm.value.phoneNumber,
            password: loginForm.value.password
        }
        const result: Result = await reqLogin(data)
        if (result.token && result.code == 200) {
            userStore.login(result as { token: string })
            ;(proxy! as any).$message({ text: '登录成功', type: 'success' })
            router.replace('/chatroom')
        } else {
            ;(proxy! as any).$message({ text: '登录失败', type: 'error' })
        }
    }
}

// 注册
async function register() {
    const isFormCorrect = await v$.value.$validate()
    if (isFormCorrect) {
        const isCommon = registerForm.value.confirmPassword == registerForm.value.password
        if (!isCommon) {
            ;(proxy! as any).$message({ text: '前后密码不一致', type: 'error' })
            return
        }
        const data = {
            account: registerForm.value.phoneNumber,
            password: registerForm.value.password
        }
        const result: Result = await reqRegister(data)
        if (result.code == 200) {
            ;(proxy! as any).$message({ text: '注册成功', type: 'success' })
            toggleForm(1)
        } else {
            ;(proxy! as any).$message({ text: '注册失败:' + result.ErrorMessage, type: 'error' })
        }
    }
}

function loginOrRegister() {
    try {
        if (loginFormVisible.value) {
            login()
        } else {
            register()
        }
    } catch (error) {
        // 这边也可以响应错误 只是我为了尝试新方法放到axios里面了
        console.error(error)
    }
}
</script>

<style scoped lang="scss">
// 验证器错误
.error {
    color: #c53636;
    position: relative;
    opacity: 1;
    .input-errors {
        position: absolute;
        bottom: 0;
        left: 0;

        .error-msg {
            opacity: 1;
            font-size: 10px;
        }
    }
}

.container {
    width: 378px;
    height: 506px;
    background-color: #fcfaf7;
    box-shadow: 1px 1px 2px rgba(192, 191, 191, 0.1);
    box-sizing: border-box;
    border-radius: 30px;
    padding: 70px 60px 0px;

    .togger-button-box {
        width: 120px;
        height: 30px;

        line-height: 30px;
        .btn {
            height: 100%;
            width: 50%;
            border-radius: 10px;
            background-color: #f2ebfc;
            &:hover {
                background-color: #ff5050;
                color: white;
                cursor: pointer;
            }
        }
        .active-btn {
            background-color: #ff5050;
            color: white;
        }
    }

    .content-container {
        padding: 20px 0 0;
        height: 325px;
        width: 100%;
        .login-form,
        .register-form {
            width: 100%;
            text-align: center;
            transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
            input:not(input[name='checkedLogin30']) {
                color: rgb(22, 21, 3, 1);
                font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                width: 100%;
                height: 40px;
                border: none;
                line-height: baseline;
                border-bottom: 1px solid #c5c1c1;
            }
            input:focus {
                border: none;
                outline: none;
                border-bottom: 1px solid#ff5050 !important;
            }
            .bottom-info-login {
                padding-top: 10px;
                display: flex;
                justify-content: space-between;
                .pointer-btn {
                    cursor: pointer;
                    color: #c53636;
                }
                span {
                    font-size: 12px;
                    color: #c5c1c1;
                    &:hover {
                        color: #c53636;
                        cursor: pointer;
                    }
                }
            }
        }

        .bottom-btn-box {
            margin-top: 50px;
            width: 100%;
            height: 34px;
            background-color: #ff5050;
            color: whitesmoke;
            text-align: center;
            padding: 5px 0;
            border-radius: 15px;
        }
        .bottom-btn-box:hover {
            background-color: #c53636;
            color: white;
            border: 1px solid #ff5050;
            box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.1);
            cursor: pointer;
        }
    }

    .footer-info {
        position: relative;
        top: -20px;
        font-size: 12px;
        font-style: italic;
        text-align: center;
        user-select: none; /* 禁止选中文本 */
        touch-action: none;
        small {
            color: #c53636;
            &:hover {
                color: yellowgreen;
                cursor: pointer;
            }
        }
    }
}

@media screen and (max-width: 768px) {
    .container {
        width: 100vw;
        height: calc(100vh - 35px);
        text-align: center;
        background-color: #fcfaf7;
        box-sizing: border-box;
        border-radius: 0px;
        padding: 70px 60px 0px;
        .togger-button-box {
            width: 65%;
            .btn {
                // width: 80px !important;
            }
        }
    }
    .footer-info {
        margin-top: -10px;
    }
}
</style>
