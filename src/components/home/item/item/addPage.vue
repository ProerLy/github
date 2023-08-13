<template>
    <div>
        <el-container :direction="vertical">
            <el-header height="">
                <el-alert title="添加商品信息" type="info" :closable="false" center show-icon>
                </el-alert>
            </el-header>
            <!-- 步骤条 -->
            <el-steps :active="parseInt(isActive)" align-center finish-status="success" process-status="info">
                <el-step :title="it.title" v-for="it in list" :key="it.active"></el-step>
            </el-steps>
            <el-container :direction="vertical">
                <el-main>
                    <!-- 基本信息 -->
                    <el-tabs v-model="isActive" tab-position="left" :before-leave="click">
                        <el-tab-pane :label="list[0].title">
                            <el-form :model="goodsForm" ref="goodsForm" :rules="rules" label-width="80px" size="normal">
                                <el-form-item label="商品名称" prop="goods_name">
                                    <el-input v-model.trim="goodsForm.goods_name"></el-input>
                                </el-form-item>
                                <el-form-item label="商品价格" prop="goods_price">
                                    <el-input v-model.number="goodsForm.goods_price" type="number"></el-input>
                                </el-form-item>
                                <el-form-item label="商品重量" prop="goods_weight">
                                    <el-input v-model.number="goodsForm.goods_weight" type="number"></el-input>
                                </el-form-item>
                                <el-form-item label="商品数量" prop="goods_number">
                                    <el-input v-model.number="goodsForm.goods_number" type="number"></el-input>
                                </el-form-item>
                                <el-form-item label="商品分类" prop="goods_cat">
                                    <el-cascader @change="change" v-model="goodsForm.goods_cat" :options="cateList"
                                        :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name' }" clearable>
                                    </el-cascader>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <!-- 商品参数 -->
                        <el-tab-pane :label="list[1].title">
                            <el-form size="normal">
                                <template v-for="it in paramsList.many">
                                    <el-form-item :label="it.attr_name" :key="it.attr_id">
                                        <el-checkbox-group v-model="it.attr_vals">
                                            <el-checkbox border :label="item" v-for="item in it.attr_vals"
                                                :key="item"></el-checkbox>
                                        </el-checkbox-group>
                                    </el-form-item>
                                </template>
                            </el-form>
                        </el-tab-pane>
                        <!-- 商品系数 -->
                        <el-tab-pane :label="list[2].title">
                            <el-form size="normal">
                                <template v-for="it in paramsList.only">
                                    <el-form-item :label="it.attr_name" :key="it.attr_id">
                                        <el-input v-model="it.attr_vals"></el-input>
                                    </el-form-item>
                                </template>
                            </el-form>
                        </el-tab-pane>
                        <!-- 上传图片 -->
                        <el-tab-pane :label="list[3].title">
                            <el-upload class="upload-demo" :auto-upload="false" :on-preview="handlePreview"
                                :on-remove="handleRemove" :file-list="goodsForm.pics" list-type="picture"
                                :on-change="getPhoto">
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </el-tab-pane>
                        <el-tab-pane :label="list[4].title">
                            <textNavbar @content="getContent"></textNavbar>
                            <el-button type="primary" size="default" @click="up">添加商品</el-button>
                        </el-tab-pane>
                    </el-tabs>
                </el-main>
            </el-container>
        </el-container>
        <el-dialog title="图片预览" :visible.sync="isLook" width="40%">
            <el-image :src="photo" fit="fill"></el-image>
        </el-dialog>
    </div>
</template>
<script>
import textNavbar from '@/components/component/textNavbar'
export default {
    name: 'addPage',
    components: {
        textNavbar
    },
    data() {
        return {
            // 列表的内容
            list: [
                {
                    active: '0',
                    title: '基本信息'
                },
                {
                    active: '1',
                    title: '商品参数'
                },
                {
                    active: '2',
                    title: '商品属性'
                },
                {
                    active: '3',
                    title: '商品图片'
                },
                {
                    active: '4',
                    title: '商品内容'
                },
                {
                    active: '5',
                    title: '完成'
                }
            ],
            // 当前所处选项
            isActive: '0',
            // 表单内容
            goodsForm: {
                goods_name: null,
                goods_price: null,
                goods_weight: null,
                goods_number: null,
                goods_cat: [],
                attrs: [],
                pics: [],
                goods_introduce: null
            },
            rules: {
                goods_name: [
                    { required: true, message: '商品名称不能为空', trigger: 'blur' }
                ],
                goods_price: [
                    { required: true, message: '价格名称不能为空', trigger: 'blur' }
                ],
                goods_weight: [
                    { required: true, message: '重量名称不能为空', trigger: 'blur' }
                ],
                goods_number: [
                    { required: true, message: '数量名称不能为空', trigger: 'blur' }
                ],
                goods_cat: [
                    { required: true, message: '请选择商品分类', trigger: 'blur' }
                ]
            },
            // 商品分类列表
            cateList: null,
            paramsList: {
                only: null,
                many: null
            },
            // 是否打开图片预览
            isLook: false,
            // 当前图片
            photo: null
        }
    },
    created() {
        this.Cate();
    },
    // 方法
    methods: {
        // 获取参数列表
        async Cate() {
            const { data: res } = await this.$http('categories');
            // console.log(res);
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.cateList = res.data;
        },
        click(e, d) {
            if (this.goodsForm.goods_cat.length === 0) {
                this.$message.error('请选择商品分类');
                return false;;
            }
        },
        // 获取参数
        change(e) {
            if (e.length > 0) {
                this.getOnly();
                this.getMany();
            }
        },
        // 获取only参数
        async getOnly() {
            const { data: res } = await this.$http('categories/' + this.goodsForm.goods_cat[this.goodsForm.goods_cat.length - 1] + '/attributes?sel=only');
            // console.log(res);
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.paramsList.only = res.data;
        },
        // 获取many参数
        async getMany() {
            const { data: res } = await this.$http('categories/' + this.goodsForm.goods_cat[this.goodsForm.goods_cat.length - 1] + '/attributes?sel=many');
            // console.log(res);
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.paramsList.many = res.data;
            for (var i of this.paramsList.many) {
                i.attr_vals = [i.attr_vals];
            }
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
            for (var i = 0; i < this.goodsForm.pics.length; i++) {
                if (file.url === this.goodsForm.pics[i].url) {
                    this.goodsForm.pics.splice(i, 1);
                    break;
                }
            }
        },
        handlePreview(file) {
            // console.log(file);
            this.photo = file.url;
            this.isLook = true;
        },
        // 获取图片
        getPhoto(file) {
            // console.log(file)
            this.goodsForm.pics.push({
                pic: file.url,
                url: file.url,
                name: file.name
            })
        },
        // 获取富文本组件传递的值
        getContent(e) {
            this.goodsForm.goods_introduce = e;
        },
        // 添加商品
        up() {
            this.$refs['goodsForm'].validate(async (voild) => {
                if (!voild) return this.$message.error('请填写必要的表单');
                if (typeof this.goodsForm.goods_cat === 'object') {
                    this.goodsForm.goods_cat = this.goodsForm.goods_cat.join(',');
                }
                this.goodsForm.attrs = this.paramsList.only.concat(this.paramsList.many);
                for (var i of this.goodsForm.attrs) {
                    i.attr_value = i.attr_vals;
                }
                // console.log(this.goodsForm)
                // const { data: res } = await this.$http.post('goods/', this.goodsForm);
                // console.log(res);
                // if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                // this.$message.success(res.meta.msg);
            })
        }
    }
}
</script>
<style scoped lang="less">
.el-steps {
    margin: 10px 0;
}

.xu {
    display: block;
    margin: 15px 0;
}
</style>