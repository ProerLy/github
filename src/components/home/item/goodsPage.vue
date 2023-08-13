<template>
    <div>
        <!-- 卡片容器 -->
        
            <el-container :direction="vertical" v-if="isList">
                <!-- 头部 -->
                <el-header>
                    <div class="seacher">
                        <el-input v-model.number="key" placeholder="输入商品id查询" size="normal" />
                        <el-button type="primary" size="default" @click="seacher">查询</el-button>
                        <el-button v-if="!isAll" type="success" size="default"
                            @click="getGoods(prarams.pagenum, prarams.pagesize)">全部</el-button>
                    </div>
                    <el-button type="info" size="default" @click="$router.push('/goods/add')" class="add">添加商品</el-button>
                </el-header>
                <!-- 内容区 -->
                <el-container :direction="vertical">
                    <el-main>
                        <el-table :data="goods?.goods" border stripe height="400">
                            <el-table-column type="expand" label="明细" width="50">
                                <template slot-scope="scope">
                                    <el-form label-position="left" class="demo-table-expand">
                                        <el-form-item label="重量">
                                            <span>{{ scope.row.goods_weight }}</span>
                                        </el-form-item>
                                        <el-form-item label="添加时间">
                                            <span>{{ scope.row.add_time }}</span>
                                        </el-form-item>
                                        <el-form-item label="热销品数量">
                                            <span>{{ scope.row.hot_number ? scope.row.hot_number : 0 }}</span>
                                        </el-form-item>
                                        <el-form-item label="是否是热销品">
                                            <el-tag v-if="scope.row.is_promote" type="danger" size="normal"
                                                effect="dark">是</el-tag>
                                            <el-tag v-else type="info" size="normal" effect="dark">否</el-tag>
                                        </el-form-item>
                                    </el-form>
                                </template>
                            </el-table-column>
                            <el-table-column label="序号" type="index" width="50">
                            </el-table-column>
                            <el-table-column prop="goods_name" label="商品名称">
                            </el-table-column>
                            <el-table-column label="商品价格(元)" prop="goods_price">
                            </el-table-column>
                            <el-table-column label="商品数量" prop="goods_number">
                            </el-table-column>
                            <el-table-column label="更新时间" prop="upd_time">
                            </el-table-column>
                            <el-table-column prop="goods_state" label="状态">
                                <template slot-scope="scope">
                                    <el-tag v-if="scope.row.goods_state = 0" type="info" size="normal"
                                        effect="dark">未通过</el-tag>
                                    <el-tag v-else-if="scope.row.goods_state = 1" type="primary" size="normal"
                                        effect="dark">审核中</el-tag>
                                    <el-tag v-else type="success" size="normal" effect="dark">已审核</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="mg_state" label="操作" width="120">
                                <template slot-scope="scope">
                                    <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                                        <el-button type="info" size="mini"
                                            @click="$router.push('/goods/edit?id=' + scope.row.goods_id)"
                                            icon="el-icon-edit"></el-button>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                                        <el-button type="danger" size="mini" @click="del(scope.row.goods_id)"
                                            icon="el-icon-delete"></el-button>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-main>
                    <!-- 页码 -->
                    <el-footer>
                        <pageNavbar :total="goods?.total" :pageSize="prarams?.pagesize" :pageNum="prarams?.pagenum"
                            @change="change" @changesize="Size" :list="pageSizes"></pageNavbar>
                    </el-footer>
                </el-container>
            </el-container>
            <router-view></router-view>
        
    </div>
</template>
<script>
import pageNavbar from '@/components/component/pageNavbar.vue';
export default {
    name: 'userControl',
    components: {
        pageNavbar
    },
    data() {
        return {
            key: null,
            goods: null,
            isadd: false,   // 是否打开添加用户框
            // 框数据
            goodsForm: {
                goods_cat: null,
                goods_name: null,
                goods_price: null,
                goods_number: null,
                goods_weight: null,
                goods_introduce: null,
                pics: [],
                attrs: [{
                    "attr_id": null,
                    "attr_value": null
                }]
            },
            // 传递的参数
            prarams: {
                pagenum: 1,
                pagesize: 10
            },
            // 页面数量
            pageSizes: [{
                size: 5,
                title: '5条/页'
            }, {
                size: 10,
                title: '10条/页'
            },
            {
                size: 15,
                title: '15条/页'
            },
            {
                size: 20,
                title: '20条/页'
            }],
            // 是否打开商品列表页面
            isList: true,
            isAll: true
        }
    },
    created() {
        // 获取用户
        this.getGoods(this.prarams.pagenum, this.prarams.pagesize);
        this.toPage(this.$route.path);
    },
    // 事件
    methods: {
        // 获取商品列表
        async getGoods(num, size) {
            const { data: res } = await this.$http.get('goods?pagenum=' + num + '&pagesize=' + size)
            // console.log(res.data)
            if (res.meta.status !== 200) return this.$message.warning(res.meta.msg);
            this.goods = res.data;
            this.isAll = true;
        },
        // 删除商品
        del(id) {
            this.$confirm('该操作将不可逆，是否继续执行？', '系统提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$http.delete('goods/' + id);
                // console.log(res)
                if (res.meta.status !== 200) return this.$message.warning(res.meta.msg);
                this.$message.success(res.meta.msg);
                // 重新获取数据
                this.getGoods(this.prarams.pagenum, this.prarams.pagesize);
            }).catch(() => {
                this.$message.info('已取消操作~');
            })
        },
        // 查询商品
        async checkGoods(id) {
            const { data: res } = await this.$http.get('goods/' + id);
            // console.log(res)
            if (res.meta.status !== 200) return this.$message.warning(res.meta.msg);
            this.goods.total = 1;
            this.prarams.pagenum = 1;
            this.goods.goods = [res.data];
            this.isAll = false;
        },
        // 查询
        seacher() {
            if (!this.key) return this.$message.warning('搜索内容不能为空！');
            this.checkGoods(this.key);
        },
        // 修改页数
        change(num) {
            if (num) {
                this.prarams.pagenum = num;
                this.getGoods(num, this.prarams.pagesize);
            }
        },
        // 关闭设置框
        downSet() {
            this.role = null;
        },
        // 接收员子组件，修改页数
        change(num) {
            if (num) {
                this.prarams.pagenum = num;
                this.getGoods(this.prarams.pagenum, this.prarams.pagesize);
            }
        },
        // 接收子组件参数，修改页面条数
        Size(num) {
            this.prarams.pagesize = num;
            this.prarams.pagenum = 1;
            this.getGoods(this.prarams.pagenum, this.prarams.pagesize);
        },
        // 切换页面
        toPage(e) {
            if (e.split('/')[2]) {
                this.isList = false;
            } else {
                this.isList = true;
            }
        }
    },
    // 监听
    watch: {
        'goods.goods'(n) {
            for (var i of n) {
                const date = new Date(i.add_time);
                const y = date.getFullYear();
                const m = date.getMonth() + 1;
                const d = date.getDate();
                const h = date.getHours();
                const ms = date.getMinutes();
                const s = date.getSeconds();
                const time = `${y}-${m}-${d} ${h}:${ms}:${s}`;
                i.add_time = time;
            }
            for (var i of n) {
                const date = new Date(i.upd_time);
                const y = date.getFullYear();
                const m = date.getMonth() + 1;
                const d = date.getDate();
                const h = date.getHours();
                const ms = date.getMinutes();
                const s = date.getSeconds();
                const time = `${y}-${m}-${d} ${h}:${ms}:${s}`;
                i.upd_time = time;
            }
            this.goods.goods = n;
        },
        '$route.path'(e) {
            this.toPage(e);
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