<template>
    <div>
        <el-container :direction="vertical">
            <!-- 头部导航 -->
            <el-header height="">
                <el-row :gutter="10">
                    <el-col :span="6" :offset="0">
                        <el-card shadow="hover" :body-style="{ padding: '10px' }">
                            <div class="title">
                                <span>用户统计</span>
                                <el-tag type="success" size="mini">实时</el-tag>
                            </div>
                            <div class="content">{{ userTotal }}</div>
                            <div class="footer">当前总用户数量</div>
                        </el-card>
                    </el-col>
                    <el-col :span="6" :offset="0">
                        <el-card shadow="hover" :body-style="{ padding: '10px' }">
                            <div class="title">
                                <span>商品统计</span>
                                <el-tag type="info" size="mini">实时</el-tag>
                            </div>
                            <div class="content">{{ goodsTotal }}</div>
                            <div class="footer">当前总商品数量</div>
                        </el-card>
                    </el-col>
                    <el-col :span="6" :offset="0">
                        <el-card shadow="hover" :body-style="{ padding: '10px' }">
                            <div class="title">
                                <span>订单统计</span>
                                <el-tag type="warning" size="mini">实时</el-tag>
                            </div>
                            <div class="content">{{ ordersTotal }}</div>
                            <div class="footer">当前总订单数量</div>
                        </el-card>
                    </el-col>
                    <el-col :span="6" :offset="0">
                        <el-card shadow="hover" :body-style="{ padding: '10px' }">
                            <div class="title">
                                <span>销售统计</span>
                                <el-tag type="primary" size="mini">实时</el-tag>
                            </div>
                            <div class="content">{{ allPrice }}</div>
                            <div class="footer">当前总销售额(元)</div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-header>
            <!-- 内容区 -->
            <el-container :direction="horizontal">
                <el-row :gutter="20" style="width: 100%;">
                    <el-col :span="12" :offset="0">
                        <el-card shadow="hover">
                            <echartsNavbar title="订单趋势" :xAxis="zhe.xAxis[0].data" :yAxis="zhe.yAxis" :series="zhe.series" :legend="zhe.legend"></echartsNavbar>
                        </el-card>
                    </el-col>
                    <el-col :span="12" :offset="0"></el-col>
                </el-row>
            </el-container>
        </el-container>
    </div>
</template>
<script>
import echartsNavbar from '@/components/home/item/item/echartsNavbar'
export default {
    name: 'helloPage',
    components:{
        echartsNavbar    
    },
    data() {
        return {
            userTotal: 0,
            goodsTotal: 0,
            ordersTotal: 0,
            allPrice: 0,
            zhe: null
        }
    },
    created(){
        this.getUserTotal();
        this.getGoods();
        this.Cate();
        this.getZhe();
    },
    methods:{
        // 获取用户数量
        async getUserTotal() {
            const { data: res } = await this.$http.get('users?pagenum=1&pagesize=1');
            if (res.meta.status !== 200) return this.$message.warning(res.meta.msg);
            this.userTotal = res.data.total;
        },
        // 获取商品数量
        async getGoods() {
            const { data: res } = await this.$http.get('goods?pagenum=1&pagesize=1');
            // console.log(res.data)
            if (res.meta.status !== 200) return this.$message.warning(res.meta.msg);
            this.goodsTotal = res.data.total;
        },
        async Cate() {
            const { data: res } = await this.$http('orders?query=&pagenum=1&pagesize=1');
            // console.log(res);
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.ordersTotal = res.data.total;
        },
        // 获取折现图数据
        async getZhe(){
            const { data: res } = await this.$http('reports/type/1');
            console.log(res.data);
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.zhe = res.data;
        }
    }
}
</script>
<style scoped lang="less">
.el-header {
    padding: 0;

    .el-card {
        padding: -10px !important;
    }

    .el-row {
        width: 100%;

        .el-col:nth-child(1) .el-card {
            background-color: #409EFF;
        }

        .el-col:nth-child(2) .el-card {
            background-color: #E6A23C;
        }

        .el-col:nth-child(3) .el-card {
            background-color: #67C23A;
        }

        .el-col:nth-child(4) .el-card {
            background-color: #909399;
        }

        .el-card {
            padding: 0;
            color: #fff;

            .title {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 15px;
            }

            .content{
                text-align: center;
                margin: 10px 0;
                font:  bold;
            }

            .footer{
                font-size: 10px;
            }
        }
    }
}</style>