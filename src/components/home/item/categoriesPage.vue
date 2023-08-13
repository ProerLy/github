<template>
    <div>
        
            <el-container :direction="vertical">
                <!-- 控制组件 -->
                <el-header height="">
                    <el-button type="success" size="default" @click="isadd = true" class="add">添加分类</el-button>
                </el-header>
                <!-- 列表 -->
                <el-main height="">
                    <el-table :data="cateList.result" style="width: 100%" row-key="cat_id" border height="400"
                        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                        <el-table-column type="index" label="序号" width="50">
                        </el-table-column>
                        <el-table-column prop="cat_name" label="分类名称">
                        </el-table-column>
                        <el-table-column label="是否有效">
                            <template slot-scope="scope">
                                <el-button class="btn" v-if="scope.row.cat_deleted" type="success" size="mini"
                                    icon="el-icon-check" circle></el-button>
                                <el-button class="btn" v-else type="danger" size="mini" icon="el-icon-close"
                                    circle></el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="排序">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.cat_level === 0" type="danger" size="normal">一级</el-tag>
                                <el-tag v-else-if="scope.row.cat_level === 1" type="success" size="normal">二级</el-tag>
                                <el-tag v-else type="info" size="normal">三级</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="180">
                            <template slot-scope="scope">
                                <el-button type="info" size="mini" @click="edit(scope.row.cat_id, scope.row.cat_name)"
                                    icon="el-icon-edit">编辑</el-button>
                                <el-button type="danger" size="mini" @click="del(scope.row.cat_id)"
                                    icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
                <!-- 分页 -->
                <el-footer>
                    <pageNavbar :total="cateList?.total" :pageSize="prarams?.pagesize" :pageNum="prarams?.pagenum"
                        @change="change" @changesize="Size" :list="pageSizes"></pageNavbar>
                </el-footer>
            </el-container>
        
        <!-- 添加分类框 -->
        <el-dialog title="添加分类" :visible.sync="isadd" width="30%" @close="downAdd">
            <el-form :model="type" :rules="rules" ref="type" class="demo-ruleForm">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input type="text" v-model="type.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：" prop="cat_level">
                    <el-cascader v-model="level" :options="parsens"
                        :props="{ checkStrictly: true, expandTrigger: 'hover', value: 'cat_id', label: 'cat_name' }"
                        clearable @change="getLevel">
                        <template slot-scope="{ node, data }">
                            <span>{{ data.cat_name }}</span>
                            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                        </template>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <template slot="footer" class="dialog-footer">
                <el-button @click="isadd = false">取消</el-button>
                <el-button type="primary" @click="Add('type')">添加</el-button>
            </template>
        </el-dialog>
        <!-- 编辑分类框 -->
        <el-dialog title="编辑分类" :visible.sync="isedit" width="30%" @close="downSet">
            <el-form :model="edits" :rules="rules" ref="edits" class="demo-ruleForm">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input type="text" v-model="edits.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <template slot="footer" class="dialog-footer">
                <el-button @click="isedit = false">取消</el-button>
                <el-button type="primary" @click="edited('edits')">提交</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import pageNavbar from '@/components/component/pageNavbar'
export default {
    name: 'categoriesPage',
    components: {
        pageNavbar
    },
    data() {
        return {
            // 参数列表
            cateList: [],
            // 是否开启添加栏
            isadd: false,
            // 分类的内容
            type: {
                cat_pid: 0,
                cat_name: null,
                cat_level: 0
            },
            // 父层级
            parsens: [],
            level: [],
            // 传递的参数
            prarams: {
                pagenum: 1,
                pagesize: 5
            },
            // 页面数量
            pageSizes: [{
                size: 3,
                title: '3条/页'
            }, {
                size: 5,
                title: '5条/页'
            },
            {
                size: 15,
                title: '10条/页'
            },
            {
                size: 20,
                title: '15条/页'
            }],
            // 规则
            rules: {
                cat_name: [
                    { required: true, message: '名称不能为空', trigger: 'blur' }
                ],
                cat_level: [
                    { required: true, message: '层级不能为空', trigger: 'blur' }
                ]
            },
            // 是否编辑
            isedit: false,
            // 编辑框中的数据
            edits: {
                cat_id: null,
                cat_name: null
            }
        }
    },
    // 页面创建之后加载
    created() {
        this.Cate(this.prarams.pagenum, this.prarams.pagesize);
    },
    // 方法
    methods: {
        // 获取参数列表
        async Cate(num, size) {
            const { data: res } = await this.$http('categories?pagenum=' + num + '&pagesize=' + size);
            // console.log(res);
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.cateList = res.data;
            this.getP(this.cateList.result);
        },
        // 获取父级
        getP(option) {
            let arr = JSON.parse(JSON.stringify(option));
            for (var i of arr) {
                if(!i.children){
                    continue;
                }
                for (var j of i.children) {
                    j.children = null;
                }
            }
            this.parsens = arr;
        },
        // 获取当前选中的层级
        getLevel(e) {
            this.type.cat_level = e.length;
            this.type.cat_pid = e[e.length - 1];
        },
        // 添加分类
        Add(form) {
            this.$refs[form].validate(async (voild) => {
                if (voild) {
                    const { data: res } = await this.$http.post('categories', this.type);
                    // console.log(res);
                    if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
                    this.$message.success(res.meta.msg);
                    this.Cate(this.prarams.pagenum, this.prarams.pagesize);
                    this.isadd = false;
                }
            })
        },
        // 删除
        del(id) {
            this.$confirm('此操作将不可逆，是否继续', '系统提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$http.delete('categories/' + id);
                console.log(res);
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.$message.success(res.meta.msg);
                // 重新加载数据
                this.Cate(this.prarams.pagenum, this.prarams.pagesize);
            }).catch(_ => {
                this.$message.info('取消了操作~');
            })
        },
        // 编辑框的显示
        edit(id, name) {
            this.isedit = true;
            this.edits.cat_id = id;
            this.edits.cat_name = name;
        },
        edited(form) {
            this.$refs[form].validate(async (voild) => {
                if (voild) {
                    const { data: res } = await this.$http.put('categories/' + this.edits.cat_id, { cat_name: this.edits.cat_name });
                    // console.log(res);
                    if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                    this.$message.success(res.meta.msg);
                    this.isedit = false;
                    // 重新加载数据
                    this.Cate(this.prarams.pagenum, this.prarams.pagesize);
                }
            })
        },
        // 关闭添加框
        downAdd() {
            this.$refs['type'].resetFields();
            this.level = [];
        },
        // 关闭编辑框
        downEdit() {
            this.$refs['edits'].resetFields();
        },
        // 接收员子组件，修改页数
        change(num) {
            if (num) {
                this.prarams.pagenum = num;
                this.Cate(this.prarams.pagenum, this.prarams.pagesize);
            }
        },
        // 接收子组件参数，修改页面条数
        Size(num) {
            this.prarams.pagesize = num;
            this.prarams.pagenum = 1;
            this.Cate(this.prarams.pagenum, this.prarams.pagesize);
        }
    }
}
</script>
<style lang="less"scope>
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