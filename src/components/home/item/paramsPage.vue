<template>
    <div>
        <el-container :direction="vertical">
            <!-- 搜索 -->
            <el-header height="">
                <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" effect="light" show-icon :closable="false"></el-alert>
            </el-header>
            <!-- 筛选 -->
            <el-form size="normal" style="margin: 20px;">
                <el-form-item label="选择商品分类：">
                    <el-cascader @change="change" v-model="key" :options="options"
                        :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name' }" clearable>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <!-- 列表 -->
            <el-main height="">
                <el-tabs v-model="attr_sel">
                    <el-tab-pane :lazy="true" :label="attr_sels[0].title" :name="attr_sels[0].label">
                        <el-button type="primary" size="mini" @click="isadd = !isadd" class="add"
                            :disabled="key.length === 0">添加参数</el-button>
                        <el-table :data="paramsList" border stripe height="400">
                            <el-table-column type="expand" label="明细" width="50">
                                <template slot-scope=scope>
                                    <el-tag :key="tag" v-for="tag in scope.row.attr_vals" closable
                                        :disable-transitions="false" @close="handleClose(scope.$index, tag)">
                                        {{ tag }}
                                    </el-tag>
                                    <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue"
                                        ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm"
                                        @blur="handleInputConfirm(scope.$index)">
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New
                                        Tag</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column type="index" label="序号" width="50">
                            </el-table-column>
                            <el-table-column prop="attr_name" label="参数名称">
                            </el-table-column>
                            <el-table-column label="操作" width="150">
                                <template slot-scope="scope">
                                    <el-button type="info" size="mini"
                                        @click="edit(scope.row.attr_id, scope.row.cat_id, scope.row.attr_name, scope.row.attr_vals)">编辑</el-button>
                                    <el-button type="danger" size="mini"
                                        @click="del(scope.row.attr_id, scope.row.cat_id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane :lazy="true" :label="attr_sels[1].title" :name="attr_sels[1].label">
                        <el-button type="primary" size="mini" @click="isadd = !isadd" class="add"
                            :disabled="key.length === 0">添加属性</el-button>
                        <el-table :data="paramsList" border stripe height="400">
                            <el-table-column type="expand" label="明细" width="50">
                                <template slot-scope=scope>
                                    <el-tag :key="tag" v-for="tag in scope.row.attr_vals" closable
                                        :disable-transitions="false" @close="handleClose(scope.$index, tag)">
                                        {{ tag }}
                                    </el-tag>
                                    <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue"
                                        ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm"
                                        @blur="handleInputConfirm(scope.$index)">
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New
                                        Tag</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column type="index" label="序号" width="50">
                            </el-table-column>
                            <el-table-column prop="attr_name" label="属性名称">
                            </el-table-column>
                            <el-table-column label="操作" width="150">
                                <template slot-scope="scope">
                                    <el-button type="info" size="mini"
                                        @click="edit(scope.row.attr_id, scope.row.cat_id, scope.row.attr_name, scope.row.attr_vals)">编辑</el-button>
                                    <el-button type="danger" size="mini"
                                        @click="del(scope.row.attr_id, scope.row.cat_id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </el-main>
        </el-container>
        <!-- 添加页面 -->
        <el-dialog :title="attr_sel === 'only' ? '添加参数' : '添加属性'" :visible.sync="isadd" width="30%" @close="downAdd">
            <el-form :model="attrs" ref="attrs" :rules="rules" label-width="80px" :inline="false" size="normal">
                <el-form-item :label="attr_sel === 'only' ? '参数名：' : '属性名：'" prop="attr_name">
                    <el-input v-model="attrs.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="isadd = false">取消</el-button>
                <el-button type="primary" @click="onAdd()">添加</el-button>
            </span>
        </el-dialog>
        <!-- 修改信息框 -->
        <el-dialog :title="attr_sel === 'only' ? '修改参数' : '修改属性'" :visible.sync="isEdit" width="30%" @close="downEdit">
            <el-form :model="attrs" ref="attrs" :rules="rules" label-width="80px" :inline="false" size="normal">
                <el-form-item :label="attr_sel === 'only' ? '参数名：' : '属性名：'" prop="attr_name">
                    <el-input v-model="attrs.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="isEdit = false">取消</el-button>
                <el-button type="primary" @click="onSubmit">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'paramsPage',
    data() {
        return {
            // 分类列表
            options: null,
            // 参数列表
            paramsList: [],
            // 查询的key
            key: [],
            // 参数属性
            attr_sels: [
                {
                    label: 'only',
                    title: '静态参数'
                },
                {
                    label: 'many',
                    title: '动态参数'
                }
            ],
            // 当前选中的属性
            attr_sel: 'only',
            // 是否显示添加框
            isadd: false,
            // 添加框的内容
            attrs: {
                attr_name: null,
                attr_id: null,
                cat_id: null,
                attr_sel: null,
                attr_vals: null
            },
            inputVisible: false,
            inputValue: '',
            // 规则
            rules: {
                attr_name: [
                    { required: true, message: '请输入属性/参数名~', trigger: 'blur' }
                ]
            },
            isEdit: false  // 是否编辑
        }
    },
    // 页面创建之后加载
    created() {
        this.Cate();
    },
    // 方法
    methods: {
        // 获取分类列表
        async Cate() {
            const { data: res } = await this.$http('categories');
            // console.log(res);
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.options = res.data;
        },
        // 联级筛选器修改时
        change(e) {
            if(e.length!==3){
                this.key = [];
                return;
            }
            this.getParams();
        },
        // 获取参数列表
        async getParams() {
            if (this.key.length > 0) {
                const { data: res } = await this.$http('categories/' + this.key[this.key.length - 1] + '/attributes?sel=' + this.attr_sel);
                // console.log(res);
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.paramsList = res.data;
                for (var i of this.paramsList) {
                    if (!i.attr_vals) {
                        i.attr_vals = [];
                        continue;
                    }
                    i.attr_vals = i.attr_vals.split(',');
                }
            } else {
                this.paramsList = null;
            }
        },
        // 添加参数
        onAdd() {
            this.$refs.attrs.validate(async (voild) => {
                if (voild) {
                    this.attrs.cat_id = this.key[this.key.length - 1];
                    this.attrs.attr_sel = this.attr_sel;
                    // console.log(this.attrs)
                    const { data: res } = await this.$http.post('categories/' + this.attrs.cat_id + '/attributes', this.attrs);
                    // console.log(res);
                    if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
                    this.$message.success(res.meta.msg);
                    res.data.attr_vals = res.data.attr_vals.split(',');
                    this.paramsList.push(res.data);
                    this.isadd = false;
                }
            })
        },
        // 关闭添加栏
        downAdd() {
            this.attrs.attr_id = null;
            this.attrs.cat_id = null;
            this.attrs.attr_name = null;
            this.attrs.attr_vals = null;
        },
        // 删除
        del(aid, cid) {
            this.$confirm('此操作不可逆，是否继续？', '系统提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$http.delete('categories/' + cid + '/attributes/' + aid + '');
                // console.log(res);
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.$message.success(res.meta.msg);
                this.getParams();
            }).catch(_ => {
                this.$message.info('已取消操作~');
            })
        },
        // 打开编辑框
        edit(aid, cid, an, av) {
            this.isEdit = true;
            this.attrs.attr_name = an;
            this.attrs.attr_id = aid;
            this.attrs.cat_id = cid;
            this.attrs.attr_sel = this.attr_sel;
            this.attrs.attr_vals = av.join(',');
        },
        // 修改用户信息
        onSubmit() {
            this.$refs['attrs'].validate(async (voild) => {
                if (voild) {
                    const { data: res } = await this.$http.put('categories/' + this.attrs.cat_id + '/attributes/' + this.attrs.attr_id, this.attrs);
                    // console.log(res)
                    if (res.meta.status !== 200) return this.$message.warning(res.meta.msg);
                    this.$message.success(res.meta.msg);
                    this.isEdit = false;
                    // 刷新页面
                    this.getParams();
                }
            })
        },
        // 关闭编辑框
        downEdit() {
            this.attrs.attr_id = null;
            this.attrs.cat_id = null;
            this.attrs.attr_name = null;
            this.attrs.attr_vals = null;
        },
        async handleClose(i, tag) {
            this.paramsList[i].attr_vals.splice(this.paramsList[i].attr_vals.indexOf(tag), 1);
            let list = JSON.parse(JSON.stringify(this.paramsList[i]));
            list.attr_vals = list.attr_vals.join(',');
            const { data: res } = await this.$http.put('categories/' + list.cat_id + '/attributes/' + list.attr_id, list);
            // console.log(res);
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.$message.success(res.meta.msg);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        async handleInputConfirm(i) {
            // console.log(i)
            let inputValue = this.inputValue;
            if (inputValue) {
                this.paramsList[i].attr_vals.push(inputValue);
                let list = JSON.parse(JSON.stringify(this.paramsList[i]));
                list.attr_vals = list.attr_vals.join(',');
                const { data: res } = await this.$http.put('categories/' + list.cat_id + '/attributes/' + list.attr_id, list);
                // console.log(res);
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.$message.success(res.meta.msg);
            }
            this.inputVisible = false;
            this.inputValue = '';
        }
    },
    watch: {
        attr_sel() {
            this.getParams();
        }
    }
}
</script>
<style lang="less" scoped>
.el-header {
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.add {
    margin-bottom: 15px;
}

.el-tag {
    margin: 20px;
}
</style>