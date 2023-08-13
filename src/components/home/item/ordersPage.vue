<template>
    <div>
        <el-container :direction="vertical">
            <!-- 控制组件 -->
            <el-header height="">
                <div class="seacher">
                    <el-input v-model.trim="key" placeholder="输入订单编号查询" size="normal" />
                    <el-button type="primary" size="default" @click="seacher">查询</el-button>
                    <el-button v-if="!isAll" type="success" size="default"
                        @click="Cate(prarams.pagenum, prarams.pagesize)">全部</el-button>
                </div>
            </el-header>
            <!-- 列表 -->
            <el-main>
                <el-table :data="cateList.goods" border>
                    <el-table-column type="expand" label="明细" width="50">
                        <template slot-scope="scope">
                            <el-form label-position="left" class="demo-table-expand">
                                <el-form-item style="padding: 20px;">
                                    <el-table :data="scope.row?.msgList" border>
                                        <el-table-column label="封面">
                                            <templat slot-scope="scope">
                                                <el-image :src="scope.row.pics[0].pics_sma_url" fit="fill"></el-image>
                                            </templat>
                                        </el-table-column>
                                        <el-table-column label="商品名称" prop="goods_name">
                                        </el-table-column>
                                        <el-table-column label="商品重量" prop="goods_weight">
                                        </el-table-column>
                                        <el-table-column label="商品数量" prop="goods_number">
                                        </el-table-column>
                                        <el-table-column label="商品价格(元)" prop="goods_price">
                                        </el-table-column>
                                        <el-table-column label="总价(元)" prop="goods_total_price">
                                        </el-table-column>
                                    </el-table>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column label="排序" type="index" width="50">
                    </el-table-column>
                    <el-table-column label="订单编号" prop="order_number">
                    </el-table-column>
                    <el-table-column label="订单价格(元)" prop="order_price">
                    </el-table-column>
                    <el-table-column label="是否付款">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.order_pay === '1'" type="success" size="mini" effect="dark">已付款</el-tag>
                            <el-tag v-else type="danger" size="mini" effect="dark">未付款</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="是否发货" prop="is_send">
                    </el-table-column>
                    <el-table-column label="下单时间" prop="create_time">
                    </el-table-column>
                    <el-table-column label="操作" width="120">
                        <template slot-scope="scope">
                            <el-tooltip content="修改收货地址" placement="top" effect="dark">
                                <el-button type="info" size="mini" @click="edit(scope.row.order_id)"
                                    icon="el-icon-edit"></el-button>
                            </el-tooltip>
                            <el-tooltip content="查看物流信息" placement="top" effect="dark">
                                <el-button type="warning" size="mini" @click="check(scope.row.order_number)"
                                    icon="el-icon-location-information"></el-button>
                            </el-tooltip>
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

        <!-- 物流框 -->
        <el-dialog title="物流进度" :visible.sync="ischeck" width="30%">
            <el-timeline>
                <el-timeline-item v-for="(activity, index) in city" :key="index" :timestamp="activity.value">
                    {{ activity.label }}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
        <!-- 编辑地址框 -->
        <el-dialog title="修改收货地址" :visible.sync="isedit" width="30%" @close="downEdit">
            <el-form :model="edits" :rules="rules" ref="edits" class="demo-ruleForm">
                <el-form-item label="省市区/县" prop="consignee_addr">
                    <el-cascader :options="cityOptions" :props="{ expandTrigger: 'hover' }" @change="changeProvince"
                        v-model="edits.consignee_addr" change-on-select clearable>
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址：" prop="stree">
                    <el-input type="text" v-model="edits.stree"></el-input>
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
// 引入城市
import city from './../../../assets/js/city.js'
import pageNavbar from '@/components/component/pageNavbar'
export default {
    name: 'ordersPage',
    components: {
        pageNavbar
    },
    data() {
        return {
            key: null,
            // 参数列表
            cateList: [],
            // 是否开启物流栏
            ischeck: false,
            // 是否显示全部
            isAll: true,
            // 传递的参数
            prarams: {
                pagenum: 1,
                pagesize: 5
            },
            // 页面数量
            pageSizes: [{
                size: 5,
                title: '5条/页'
            },
            {
                size: 10,
                title: '10条/页'
            },
            {
                size: 20,
                title: '20条/页'
            }],
            // 规则
            rules: {
                consignee_addr: [
                    { required: true, message: '省市区不能为空', trigger: 'blur' }
                ]
            },
            // 是否编辑
            isedit: false,
            cityOptions: city,
            // 编辑框中的数据
            edits: {
                order_id: null,
                stree: null,
                consignee_addr: null
            }
        }
    },
    // 页面创建之后加载
    created() {
        this.Cate(this.prarams.pagenum, this.prarams.pagesize);
    },
    // 方法
    methods: {
        // 获取订单列表
        async Cate(num, size) {
            const { data: res } = await this.$http('orders?query=&pagenum=' + num + '&pagesize=' + size);
            // console.log(res);
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.cateList = res.data;
            this.getMsg(res.data.goods);
            this.isAll = true;
        },
        // 获取详情
        async getMsg(list) {
            for (var i = 0; i < list.length; i++) {
                // console.log(list[i])
                const { data: Res } = await this.$http('orders/' + list[i].order_id);
                // console.log(Res);
                if (Res.meta.status !== 200) return this.$message.error(Res.meta.msg);
                // console.log(Res);
                let lists = [];
                for (var j of Res.data.goods) {
                    // console.log(j);
                    const { data: res } = await this.$http('goods/' + j.goods_id);
                    // console.log(res);
                    if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                    res.data.goods_number = j.goods_number;
                    res.data.goods_price = j.goods_price;
                    res.data.goods_total_price = j.goods_total_price;
                    lists.push(res.data);
                }
                this.cateList.goods[i].msgList = lists;
            }
        },
        // 查询商品
        async checkGoods(id) {
            const { data: res } = await this.$http.get('orders?query=' + id + '&pagenum=1&pagesize=1');
            // console.log(res)
            if (res.meta.status !== 200) return this.$message.warning(res.meta.msg);
            this.cateList = res.data;
            this.getMsg(res.data.goods)
            this.isAll = false;
        },
        // 查询
        seacher() {
            if (!this.key) return this.$message.warning('搜索内容不能为空！');
            this.checkGoods(this.key);
        },
        // 编辑框的显示
        edit(id) {
            this.isedit = true;
            this.edits.order_id = id;
        },
        edited(form) {
            this.$refs[form].validate(async (voild) => {
                if (voild) {
                    if (this.edits.stree) {
                        this.edits.consignee_addr += `,${this.edits.stree}`;
                    }
                    const { data: res } = await this.$http.put('orders/' + this.edits.order_id + '/address', { consignee_addr: this.edits.consignee_addr });
                    // console.log(res);
                    if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                    this.$message.success(res.meta.msg);
                    this.isedit = false;
                    // 重新加载数据
                    this.Cate(this.prarams.pagenum, this.prarams.pagesize);
                }
            })
        },
        async check(id) {
            // console.log(id)
            const { data: res } = await this.$http.get('/kuaidi/1106975712662');
            // console.log(res)
            if (res.meta.status !== 200) return this.$message.warning(res.meta.msg);
            // this.cateList = res.data;
        },
        changeProvince(e) {
            this.edits.consignee_addr = e.join(',');
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
    },
    // 监听
    watch: {
        'cateList.goods'(n) {
            for (var i of n) {
                const date = new Date(i.create_time);
                const y = date.getFullYear();
                const m = date.getMonth() + 1;
                const d = date.getDate();
                const h = date.getHours();
                const ms = date.getMinutes();
                const s = date.getSeconds();
                const time = `${y}-${m}-${d} ${h}:${ms}:${s}`;
                i.create_time = time;
            }
            this.cateList.goods = n;
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