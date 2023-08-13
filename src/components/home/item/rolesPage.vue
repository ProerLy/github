<template>
    <div>
        <!-- 卡片容器 -->
        
            <el-container :direction="vertical">
                <!-- 头部 -->
                <el-header>
                    <div class="seacher">
                        <el-input v-model.number="key" placeholder="输入角色id查询" size="normal" />
                        <el-button type="primary" size="default" @click="seacher">查询</el-button>
                        <el-button v-if="!isAll" type="success" size="default" @click="getRoles()">全部</el-button>
                    </div>
                    <el-button type="info" size="default" @click="isadd = true" class="add">添加角色</el-button>
                </el-header>
                <!-- 内容区 -->
                <el-main>
                    <el-table :data="roles" border stripe height="400">
                        <el-table-column type="expand" label="明细" width="50">
                            <template slot-scope="props">
                                <el-row
                                    :class="i === 0 || i === props.row.children.length ? 'bdtop vcenter bdbottom' : 'vcenter bdbottom'"
                                    v-for="(it, one) in  props.row.children " :key="it.id">
                                    <el-col :span="5" :offset="0">
                                        <el-tag type="primary" size="normal" effect="dark" closable
                                            @close="remove(props.row, it.id)">{{ it.authName
                                            }}</el-tag><i v-if="it.children.length > 0" class="el-icon-d-arrow-right"></i>
                                    </el-col>
                                    <el-col :span="19" :offset="0">
                                        <el-row
                                            :class="i === 0 || i === it.children.length ? 'bdtop vcenter bdbottom' : 'vcenter bdbottom'"
                                            v-for="(item, two)  in  it.children " :key="item.id">
                                            <el-col :span="6" :offset="0">
                                                <el-tag type="success" size="normal" effect="dark" closable
                                                    @close="remove(props.row, item.id)">{{
                                                        item.authName }}</el-tag><i v-if="item.children.length > 0"
                                                    class="el-icon-d-arrow-right"></i>
                                            </el-col>
                                            <el-col :span="18" :offset="0">
                                                <el-row v-for="(its, three) in item.children" :key="its.id">
                                                    <el-col :span="24" :offset="0">
                                                        <el-tag type="warning" size="normal" effect="dark" closable
                                                            @close="remove(props.row, its.id)">{{ its.authName
                                                            }}</el-tag>
                                                    </el-col>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-table-column>
                        <el-table-column label="序号" type="index" width="50">
                        </el-table-column>
                        <el-table-column prop="roleName" label="角色名">
                        </el-table-column>
                        <el-table-column prop="roleDesc" label="描述">
                        </el-table-column>
                        <el-table-column prop="mg_state" label="操作" width="290">
                            <template slot-scope="scope">
                                <el-button type="info" size="mini" @click="edit(scope.row)"
                                    icon="el-icon-edit">编辑</el-button>
                                <el-button type="danger" size="mini" @click="del(scope.row, scope.$index)"
                                    icon="el-icon-delete">删除</el-button>
                                <el-button type="warning" size="mini" @click="set(scope.row)"
                                    icon="el-icon-setting">分配权限</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
            </el-container>
        
        <!-- 添加角色框 -->
        <el-dialog title="添加角色" :visible.sync="isadd" width="30%" @close="downAdd">
            <el-form :model="userInfo" :rules="rules" ref="userInfo" class="demo-ruleForm">
                <el-form-item label="角色：" prop="roleName">
                    <el-input type="text" v-model="userInfo.roleName"></el-input>
                </el-form-item>
                <el-form-item label="描述：" prop="roleDesc">
                    <el-input type="text" v-model="userInfo.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <template slot="footer" class="dialog-footer">
                <el-button @click="isadd = false">取消</el-button>
                <el-button type="primary" @click="addRoles('userInfo')">添加</el-button>
            </template>
        </el-dialog>
        <!-- 修改角色信息框 -->
        <el-dialog title="角色信息修改" :visible.sync="isEdit" width="30%" @close="downEdit">
            <el-form :model="userForm" :rules="rules" ref="userForm" size="normal">
                <el-form-item label="角色名：" prop="roleName">
                    <el-input v-model="userForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="描述：" prop="roleDesc">
                    <el-input v-model="userForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="isEdit = false">取消</el-button>
                <el-button type="primary" @click="onSubmit">提交</el-button>
            </span>
        </el-dialog>
        <!-- 修改角色授权框 -->
        <el-dialog title="角色授权" :visible.sync="isSet" width="30%" @close="downSet">
            <el-tree ref="rights" :default-expanded-keys="defaultKeys" :default-checked-keys="rightKeys" node-key="id"
                :data="rights" show-checkbox @check="getNodes" :props="defaultProps">
            </el-tree>
            <span slot="footer">
                <el-button @click="isSet = false">取消</el-button>
                <el-button type="primary" @click="onUp">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'rolesPage',
    data() {
        return {
            key: null,
            roles: null,
            isadd: false,   // 是否打开添加用户框
            userInfo: {  // 添加用户框中的属性
                roleName: null,
                roleDesc: null
            },
            // 规则
            rules: {
                roleName: [{ required: true, message: '角色名不能为空！', trigger: 'blur' }]
            },
            isEdit: false,  // 是否编辑
            // 编辑框数据
            userForm: {
                roleName: null,
                roleDesc: null
            },
            row: null,
            // 是否是显示全部内容
            isAll: true,
            // 是否显示角色授权框
            isSet: false,
            // 权限列表
            rights: [],
            // 选择的权限
            rightKeys: [],
            defaultKeys: [],
            defaultProps: {
                children: 'children',
                label: 'authName'
            },
            // 当前选中的keys
            rids: null
        }
    },
    created() {
        // 获取角色
        this.getRoles();
        this.getRights();
    },
    // 事件
    methods: {
        // 获取角色
        async getRoles() {
            const { data: res } = await this.$http.get('roles/');
            // console.log(res)
            if (res.meta.status === 200) this.roles = res.data;
        },
        // 添加角色
        addRoles(formName) {
            this.$refs[formName].validate(async (voild) => {
                if (voild) {
                    const { data: res } = await this.$http.post('roles', this.userInfo);
                    // console.log(res)
                    if (res.meta.status !== 201) return this.$message.warning(res.meta.msg);
                    this.$message.success(res.meta.msg);
                    // 关闭并清空添加框
                    this.isadd = false;
                    this.$refs['userInfo'].resetFields();
                    // 重新获取数据
                    this.getRoles();
                }
            })
        },
        // 查询角色
        async checkRoles(id) {
            const { data: res } = await this.$http.get('roles/' + id);
            // console.log(res)
            if (res.meta.status !== 200) return this.$message.warning(res.meta.msg);
            this.roles = [res.data];
            this.isAll = false;
        },
        // 打开编辑框
        edit(row) {
            this.row = row;
            this.isEdit = true;
            this.userForm.roleName = row.roleName;
            this.userForm.roleDesc = row.roleDesc;
        },
        // 修改用户信息
        async onSubmit() {
            const { data: res } = await this.$http.put('roles/' + this.row.id, this.userForm);
            // console.log(res)
            if (res.meta.status !== 200) return this.$message.warning(res.meta.msg);
            this.$message.success(res.meta.msg);
            this.getRoles();
            this.isEdit = false;
        },
        // 删除用户
        del(row, index) {
            this.$confirm('该操作将不可逆，是否继续执行？', '系统提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$http.delete('roles/' + row.id);
                // console.log(res)
                if (res.meta.status !== 200) return this.$message.warning(res.meta.msg);
                this.$message.success(res.meta.msg);
                this.roles.splice(index, 1);
            }).catch(() => {
                this.$message.info('已取消操作~');
            })
        },
        // 查询
        seacher() {
            if (!this.key) return this.$message.warning('搜索内容不能为空！');
            this.checkRoles(this.key);
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
        // 获取权限列表
        async getRights() {
            const { data: res } = await this.$http('rights/tree');
            // console.log(res);
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.rights = res.data;
            let node = [];
            for (var i of res.data) {
                node.push(i.id);
                if (!i.children) {
                    continue;
                }
                for (var j of i.children) {
                    node.push(j.id);
                    if (!i.children) {
                        continue;
                    }
                    for (var k of i.children) {
                        node.push(k.id);
                    }
                }
            }
            this.defaultKeys = node;
        },
        // 角色权限分配栏
        set(row) {
            this.row = row;
            this.isSet = true;
            // console.log(id)
            // console.log(this.roles)
            let node = [];
            for (var j of row.children) {
                if (!j.children) {
                    continue;
                }
                for (var k of j.children) {
                    if (!k.children) {
                        continue;
                    }
                    for (var f of k.children) {
                        // console.log(f)
                        node.push(f.id);
                    }
                }
            }
            this.rightKeys = node;
            // console.log(this.rightKeys)
        },
        // 获取选择的节点
        getNodes(d, n) {
            // console.log(n)
            let checkedKeys = n.checkedKeys;
            let halfCheckedKeys = n.halfCheckedKeys;
            this.rids = checkedKeys.concat(halfCheckedKeys).join(',');
            //    console.log(this.rids)
        },
        // 提交
        async onUp() {
            const { data: res } = await this.$http.post('roles/' + this.row.id + '/rights', { rids: this.rids });
            // console.log(res);
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.$message.success(res.meta.msg);
            // 重新获取角色
            this.getRoles();
            this.isSet = false;
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
            this.$refs.rights.setCheckedKeys([]);
        },
        // 删除权限
        remove(row, riid) {
            this.$confirm('此操作将不可逆，是否继续？', '系统提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$http.delete('roles/' + row.id + '/rights/' + riid);
                // console.log(row.children,res.data);
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.$message.success(res.meta.msg);
                row.children = res.data;
            }).catch(_ => {
                this.$message.info('已取消操作~');
            })
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

.el-main {
    .vcenter {
        display: flex;
        align-items: center;
    }

    .el-col {
        padding: 10px;

        .el-tag {
            margin-right: 10px;
        }
    }

    .bdbottom {
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    }

    .bdtop {
        border-top: 1px solid rgba(0, 0, 0, 0.2);
    }
}

.page {
    display: flex;
    align-items: center;

    .el-pagination {
        margin: 0 20px;
    }

    .tonum {
        display: flex;
        align-items: center;

        .el-input {
            text-align: center;
            width: 50px;
        }
    }
}
</style>