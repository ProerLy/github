<template>
    <div class="login_container">
        <el-row>
            <!-- 左侧图片 -->
            <el-col :span="12" :offset="0">
                <el-image :src="left_img" fit="fill" />
            </el-col>
            <!-- 右侧登录框 -->
            <el-col :span="12" :offset="0">
                <div class="login-box" v-loading="loading" element-loading-text="账号验证中……">
                    <!-- 图标 -->
                    <div class="login-img">
                        <el-image :src="title_img" fit="fill" class="title-img"></el-image>
                    </div>
                    <!-- 标题 -->
                    <div class="title">
                        电商后台管理系统
                    </div>
                    <!-- 登录框 -->
                    <div class="form">
                        <el-form :model="form" ref="form" :rules="rules" size="normal">
                            <!-- 账号 -->
                            <el-form-item prop="username">
                                <el-input v-model="form.username" prefix-icon="el-icon-s-custom"></el-input>
                            </el-form-item>
                            <!-- 密码 -->
                            <el-form-item prop="password">
                                <el-input v-model="form.password" type="password" prefix-icon="el-icon-lock"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('form')">登录</el-button>
                                <el-button type="info" @click="resetForm('form')">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-col>
        </el-row>

    </div>
</template>
<script>
export default {
    name: 'loginPage',
    data() {
        return {
            left_img: require('./../../assets/左侧盒子.png'),
            title_img: require('./../../assets/我的.png'),
            // 输入框内容
            form: {
                username: 'admin',
                password: '123456'
            },
            // 规则
            rules: {
                username: [
                    { required: true, message: '用户名不能为空！', trigger: 'blur' },
                    { min: 3, max: 10, message: '用户名长度为6-16位！', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空！', trigger: 'blur' },
                    { min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur' }
                ]
            },
            // loading
            loading: false
        }
    },
    // 方法
    methods: {
        // 登录事件
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    setTimeout(() => {
                        this.$http.post('login', this.form).then(inres => {
                            // 接收数据
                            const data = inres.data;
                            // 状态
                            const code = data.meta.status;
                            if (code === 200) {
                                this.$message.success(data.meta.msg);
                                window.sessionStorage.setItem('user', JSON.stringify({
                                    token: data.data.token,
                                    rid: data.data.rid,
                                    username: data.data.username
                                }))
                                // 跳转首页
                                this.$router.push('/home');
                            } else {
                                this.$message.warning(data.meta.msg);
                            }
                            this.loading = false;
                        }).catch(err => {
                            this.$message.error('系统错误！' + err.message);
                            this.loading = false;
                        })
                    }, 2000);
                }
            });
        },
        //   重置事件
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>
<style lang="less" scoped>
.login_container {
    background-color: #93defe;
    height: 100%;

    .el-row {
        height: 100%;

        .el-col {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
        }

        .login-box {
            width: 450px;
            height: 360px;
            background-color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;

            .login-img {
                width: 150px;
                height: 150px;
                display: flex;
                justify-content: center;
                background-color: white;
                border: #93defe 5px solid;
                border-radius: 100%;
                position: absolute;
                top: -75px;

                .title-img {
                    width: 90px;
                    height: 90px;
                }
            }

            .title {
                font-size: 20px;
                margin: 20px 0;
                margin-top: 80px;
            }

            .form {
                width: 70%;
                text-align: center;
            }
        }
    }
}
</style>