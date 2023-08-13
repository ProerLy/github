<template>
    <el-container :direction="vertical" id="home_box">
        <!-- 头部 -->
        <el-header id="header" :style="bg">
            <!-- logo -->
            <div class="logo"><el-avatar size="50px" :src="logo"></el-avatar><span>电商后台管理系统</span></div>
            <!-- 用户 -->
            <div class="authr"><span>欢迎{{ user.username }}({{ user.rid }})进入电商后台管理系统</span></div>
            <!-- 退出 -->
            <div class="out">
                <el-button type="danger" round size="mini" @click="outLogin" icon="el-icon-switch-button">退出</el-button>
            </div>
        </el-header>
        <el-container :direction="horizontal" id="content">
            <!-- 左侧导航栏 -->
            <el-aside :width="!isShow ? '200px' : '60px'">
                <el-menu mode="vertical" router :default-active="$route.path" background-color="#292A2D" text-color="#fff"
                    active-text-color="#FFCA28" unique-opened class="el-menu-vertical-demo" :collapse="isShow"
                    :collapse-transition="false">
                    <el-menu-item style="text-align: center;" @click="isShow = !isShow"><i
                            class="el-icon-s-order"></i></el-menu-item>
                    <el-submenu index="0">
                        <template slot="title"><i class="el-icon-s-home"></i><span slot="title">首页</span></template>
                        <el-menu-item index="/house">
                            欢迎页
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu :index="it.order" v-for="(it, i) in menu" :key="it.id">
                        <template slot="title"><i :class="icon[i].icon"></i><span slot="title">{{ it.authName
                        }}</span></template>
                        <el-menu-item :index="'/' + item.path" v-for="(item, index) in it.children" :key="item.id">
                            <i :class="icon[i].childern[index]"></i>
                            {{ item.authName }}
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容区 -->
            <el-container :direction="vertical" id="contents">
                <el-main>
                    <!-- 面包屑 -->
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="$route.path !== '/house'? '/house': ''">首页</el-breadcrumb-item>
                        <el-breadcrumb-item v-for="( it, i ) in  bread " :key=" it.tabel " :to=" it.path ">{{ it.tabel
                            }}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-card shadow="always" :body-style=" { padding: '20px' } ">
                        <router-view></router-view>
                    </el-card>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>
<script>
const logo = require('./../../assets/电商logo.png');
const topbg = require('./../../assets/top背景.png');
export default {
    name: 'homePage',
    data() {
        return {
            user: {
                username: '管理员',
                rid: 0
            },
            menu: [],
            isShow: false,
            icon: [
                {
                    icon: 'el-icon-s-custom',
                    childern: [
                        'el-icon-user'
                    ]
                },
                {
                    icon: 'el-icon-s-tools',
                    childern: [
                        'el-icon-user-solid',
                        'el-icon-setting'
                    ]
                },
                {
                    icon: 'el-icon-s-shop',
                    childern: [
                        'el-icon-menu',
                        'el-icon-s-grid',
                        'el-icon-s-operation'
                    ]
                },
                {
                    icon: 'el-icon-s-claim',
                    childern: [
                        'el-icon-document-checked',
                    ]
                },
                {
                    icon: 'el-icon-s-data',
                    childern: [
                        'el-icon-s-marketing'
                    ]
                }
            ],
            // 面包导航
            bread: [
                {
                    tabel: null,
                    path: null
                }
            ],
            logo: logo,
            bg: {
                backgroundImage: `url(${topbg})`
            }
        }
    },
    // 页面渲染完毕后
    created() {
        // 用户信息
        const user = JSON.parse(window.sessionStorage.getItem('user'));
        // 获取本地储存的token
        const tokener = user?.token;
        if (!tokener) return this.$router.push('/login');
        this.user = { username: user.username, rid: user.rid };
        this.getMenu();
    },
    // 方法
    methods: {
        // 退出登录
        outLogin() {
            this.$confirm('确定退出系统吗？', '系统提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    // 删除本地储存的token
                    window.sessionStorage.removeItem('user');
                    this.$message.success('退出成功！');
                    setTimeout(() => {
                        // 1秒后跳转登录页面
                        this.$router.push('/login');
                    }, 1000);
                }).catch(() => {
                    this.$message.info('取消了操作~');
                })
        },
        // 获取menu
        async getMenu() {
            const res = await this.$http.get('menus');
            // console.log(res);
            if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg);
            this.menu = res.data.data;
            this.getBread(this.$route.path);
        },
        // 获取到面包屑的内容
        getBread(e) {
            if (e.split('/')[2] === 'add') {
                this.bread[0] = { tabel: '商品管理', path: null }
                this.bread[1] = { tabel: '商品列表', path: '/goods' }
                this.bread[2] = { tabel: '添加商品', path: null }
                return;
            } else if (e.split('/')[2] === 'edit') {
                this.bread[0] = { tabel: '商品管理', path: null }
                this.bread[1] = { tabel: '商品列表', path: '/goods' }
                this.bread[2] = { tabel: '编辑商品', path: null }
                return;
            } else if (e.split('/')[1] === 'house') {
                this.bread[0] = { tabel: '欢迎页', path: null }
                this.bread.splice(1, 2);
                return;
            }
            for (var i of this.menu) {
                for (var j of i.children) {
                    if (e.split('/')[1] === j.path) {
                        this.bread[0] = { tabel: i.authName, path: null }
                        this.bread[1] = { tabel: j.authName, path: null }
                        this.bread.splice(2, 1);
                        break;
                    }
                }
            }
        }
    },
    watch: {
        '$route.path'(e) {
            this.getBread(e);
        }
    }
}
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
</style>
<style lang="less">
:root {
    --height: 50px;
}

#home_box {
    background-color: #000000;
    height: 100%;

    #header {
        height: var(--height);
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        padding: 0 20px;
        border-bottom: none;

        .logo {
            font-size: 30px;
            display: flex;
            align-items: center;
        }

        .authr {}
    }

    #content {
        height: calc(100vh - var(--height));
        overflow: auto;

        #contents {
            height: 100%;
            overflow: auto;
        }

        .el-aside {
            background-color: #292A2D;

            .el-menu-vertical-demo .el-menu {
                height: 100%;
                width: 100%;
            }
        }

        .el-main,
        .el-footer {
            background-color: #fff;
        }
    }
}
</style>