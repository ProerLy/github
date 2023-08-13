<template>
    <div>
        <echartsNavbar title="用户来源" :xAxis="zhe.xAxis[0].data" :yAxis="zhe.yAxis" :series="zhe.series" :legend="zhe.legend">
        </echartsNavbar>
    </div>
</template>
<script>
import echartsNavbar from '@/components/home/item/item/echartsNavbar'
export default {
    name: 'reportsPage',
    components: {
        echartsNavbar
    },
    data() {
        return {
            zhe: null
        }
    },
    mounted() {
        this.getZhe();
    },
    methods: {
        // 获取折现图数据
        async getZhe() {
            const { data: res } = await this.$http('reports/type/1');
            // console.log(res.data);
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.zhe = res.data;
        }
    }
}
</script>
<style></style>