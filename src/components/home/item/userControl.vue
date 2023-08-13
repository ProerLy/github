<template>
    <div>
        <!-- 卡片容器 -->
        <el-container :direction="vertical">
            <!-- 头部 -->
            <el-header>
                <div class="seacher">
                    <el-input v-model.number="key" placeholder="输入用户id查询" size="normal" />
                    <el-button type="primary" size="default" @click="seacher">查询</el-button>
                    <el-button v-if="!isAll" type="success" size="default"
                        @click="getUsers(prarams.pagenum, prarams.pagesize)">全部</el-button>
                </div>
                <el-button type="info" size="default" @click="isadd = true" class="add">添加用户</el-button>
            </el-header>
            <!-- 内容区 -->
            <el-container :direction="vertical">
                <el-main>
                    <el-table :data="users?.users" border stripe>
                        <el-table-column label="序号" type="index" width="50">
                        </el-table-column>
                        <el-table-column prop="id" label="用户ID">
                        </el-table-column>
                        <el-table-column prop="username" label="用户名">
                        </el-table-column>
                        <el-table-column prop="mobile" label="手机号">
                        </el-table-column>
                        <el-table-column prop="role_name" label="角色">
                        </el-table-column>
                        <el-table-column prop="email" label="邮箱">
                        </el-table-column>
                        <!-- <el-table-column prop="create_time" label="注册时间">
                            </el-table-column> -->
                        <el-table-column prop="mg_state" label="状态">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.mg_state" :active-value="true" :inactive-value="false"
                                    @change="state(scope.row.id, scope.row.mg_state)">
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column prop="mg_state" label="操作" width="290">
                            <template slot-scope="scope">
                                <el-button type="info" size="mini" @click="edit(scope.row.id)"
                                    icon="el-icon-edit">编辑</el-button>
                                <el-button type="danger" size="mini" @click="del(scope.row.id)"
                                    icon="el-icon-delete">删除</el-button>
                                <el-button type="warning" size="mini" @click="set(scope.row.id, scope.row.role_name)"
                                    icon="el-icon-setting">分配角色</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
                <!-- 页码 -->
                <el-footer>
                    <pageNavbar :total="users?.total" :pageSize="prarams?.pagesize" :pageNum="prarams?.pagenum"
                        @change="change" @changesize="Size" :list="pageSizes"></pageNavbar>
                </el-footer>
            </el-container>
        </el-container>

        <!-- 添加用户框 -->
        <el-dialog title="添加用户" :visible.sync="isadd" width="30%" @close="downAdd">
            <el-form :model="userInfo" :rules="rules" ref="userInfo" class="demo-ruleForm">
                <el-form-item label="用户名：" prop="username">
                    <el-input type="text" v-model="userInfo.username"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="password">
                    <el-input type="password" v-model="userInfo.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：" prop="email">
                    <el-input type="email" v-model="userInfo.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" prop="mobile">
                    <el-input type="tel" v-model="userInfo.mobile"></el-input>
                </el-form-item>
            </el-form>
            <template slot="footer" class="dialog-footer">
                <el-button @click="isadd = false">取消</el-button>
                <el-button type="primary" @click="userAdd('userInfo')">添加</el-button>
            </template>
        </el-dialog>
        <!-- 修改用户信息框 -->
        <el-dialog title="用户信息修改" :visible.sync="isEdit" width="30%" @close="downEdit">
            <el-form :model="userForm" ref="userForm" size="normal">
                <el-form-item label="邮件：" prop="email">
                    <el-input v-model="userForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" prop="mobile">
                    <el-input v-model="userForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="isEdit = false">取消</el-button>
                <el-button type="primary" @click="onSubmit">提交</el-button>
            </span>
        </el-dialog>
        <!-- 修改角色信息框 -->
        <el-dialog title="角色分配" :visible.sync="isSet" width="30%" @close="downSet">
            <p>当前的用户：{{ user.username }}</p>
            <p>当前的角色：{{ user.role_name }}</p>
            <p>
                <span>分配新角色：</span>
                <el-select v-model="role" placeholder="请选择角色">
                    <el-option v-for="item in roles" :key="item.id" :label="item.roleName" :value="item.id">
                    </el-option>
                </el-select>
            </p>
            <template slot="footer">
                <el-button @click="isSet = false">取消</el-button>
                <el-button type="primary" @click="onTi">提交</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import pageNavbar from '@/components/component/pageNavbar'
export default {
    name: 'userControl',
    components: {
        pageNavbar
    },
    data() {
        return {
            key: null,
            users: null,
            isadd: false,   // 是否打开添加用户框
            userInfo: {  // 添加用户框中的属性
                username: null,
                password: null,
                email: null,
                mobile: null
            },
            // 传递的参数
            prarams: {
                pagenum: 1,
                pagesize: 5
            },
            // 页面数量
            pageSizes: [{
                size: 1,
                title: '1条/页'
            }, {
                size: 2,
                title: '2条/页'
            },
            {
                size: 5,
                title: '5条/页'
            },
            {
                size: 10,
                title: '10条/页'
            }],
            // 规则
            rules: {
                username: [{ required: true, message: '用户名不能为空！', trigger: 'blur' }, { min: 6, max: 16, message: '用户名长度为6到16！', trigger: 'blur' }],
                password: [{ required: true, message: '密码不能为空！', trigger: 'blur' }, { min: 6, max: 16, message: '密码长度为6到16！', trigger: 'blur' }]
            },
            // 总数量
            total: 0,
            isEdit: false,  // 是否编辑
            // 编辑框数据
            userForm: {
                email: null,
                mobile: null
            },
            // 选中的index
            index: 0,
            // 是否打开设置
            isSet: false,
            // 角色
            role: null,
            // 当前用户
            user: {
                username: null,
                role_name: null
            },
            // 所有角色
            roles: null,
            isAll: true
        }
    },
    created() {
        // 获取用户
        this.getUsers(this.prarams.pagenum, this.prarams.pagesize);
        // 获取角色
        this.getRoles();
    },
    // 事件
    methods: {
        // 获取角色
        // 修改角色
        async getRoles() {
            const { data: res } = await this.$http.get('roles/');
            if (res.meta.status === 200) this.roles = res.data;
        },
        // 获取用户列表
        async getUsers(num, size) {
            const { data: res } = await this.$http.get('users?pagenum=' + num + '&pagesize=' + size)
            if (res.meta.status !== 200) return this.$message.warning(res.meta.msg);
            this.users = res.data;
            this.isAll = true;
        },
        // 添加用户
        async addUsers() {
            const { data: res } = await this.$http.post('users', this.userInfo);
            // console.log(res)
            if (res.meta.status !== 201) return this.$message.warning(res.meta.msg);
            this.$message.success(res.meta.msg);
            // 关闭并清空添加框
            this.isadd = false;
            this.$refs['userInfo'].resetFields();
            // 重新获取数据
            this.getUsers(this.prarams.pagenum, this.prarams.pagesize);
        },
        // 查询用户
        async checkUsers(id) {
            const { data: res } = await this.$http.get('users/' + id);
            // console.log(res)
            if (res.meta.status !== 200) return this.$message.warning(res.meta.msg);
            this.users.total = 1;
            this.prarams.pagenum = 1;
            this.users.users = [res.data];
            this.isAll = false;
        },
        // 修改用户状态
        async state(id, states) {
            const { data: res } = await this.$http.put('users/' + id + '/state/' + states);
            // console.log(res)
            if (res.meta.status !== 200) return this.$message.warning(res.meta.msg);
            this.$message.success(res.meta.msg);
        },
        // 打开编辑框
        edit(id) {
            this.index = id;
            this.isEdit = true;
            for (var i of this.users.users) {
                if (i.id === id) {
                    this.userForm.email = i.email;
                    this.userForm.mobile = i.mobile;
                    break;
                }
            }
        },
        // 修改用户信息
        async onSubmit() {
            const { data: res } = await this.$http.put('users/' + this.index, this.userForm);
            // console.log(res)
            if (res.meta.status !== 200) return this.$message.warning(res.meta.msg);
            this.$message.success(res.meta.msg);
            this.isEdit = false;
            // 刷新页面
            this.getUsers(this.prarams.pagenum, this.prarams.pagesize);
        },
        // 删除用户
        del(id) {
            this.$confirm('该操作将不可逆，是否继续执行？', '系统提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$http.delete('users/' + id);
                // console.log(res)
                if (res.meta.status !== 200) return this.$message.warning(res.meta.msg);
                this.$message.success(res.meta.msg);
                // 重新获取数据
                this.getUsers(this.prarams.pagenum, this.prarams.pagesize);
            }).catch(() => {
                this.$message.info('已取消操作~');
            })
        },
        // 用户角色分配栏
        set(id) {
            this.index = id;
            this.isSet = true;
            for (var i of this.users.users) {
                if (i.id === id) {
                    this.user.username = i.username;
                    this.user.role_name = i.role_name;
                    break;
                }
            }
        },
        // 修改角色
        async onTi() {
            if (!this.role) return this.$message.warning('不能为空~');
            const { data: res } = await this.$http.put('users/' + this.index + '/role', { rid: this.role });
            // console.log(res)
            if (res.meta.status !== 200) return this.$message.warning(res.meta.msg);
            this.$message.success(res.meta.msg);
            this.isSet = false;
            // 重新获取数据
            this.getUsers(this.prarams.pagenum, this.prarams.pagesize);
        },
        // 查询
        seacher() {
            if (!this.key) return this.$message.warning('搜索内容不能为空！');
            this.checkUsers(this.key);
        },
        // 添加按钮
        userAdd(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    // 发起添加请求
                    this.addUsers();
                }
            })
        },
        // 关闭添加框
        downAdd() {
            this.$refs['userInfo'].resetFields();
        },
        // 关闭编辑框
        downEdit() {
            this.$refs['userForm'].resetFields();
        },
        // 关闭设置框
        downSet() {
            this.role = null;
        },
        // 接收员子组件，修改页数
        change(num) {
            if (num) {
                this.prarams.pagenum = num;
                this.getUsers(this.prarams.pagenum, this.prarams.pagesize);
            }
        },
        // 接收子组件参数，修改页面条数
        Size(num) {
            this.prarams.pagesize = num;
            this.prarams.pagenum = 1;
            this.getUsers(this.prarams.pagenum, this.prarams.pagesize);
        }
    }
}
</script>
<style lang="less">
.el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .seacher {
        display: flex;
        align-items: center;

        input {
            width: 300px;
        }
    }

}
</style>