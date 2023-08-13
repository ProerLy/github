<template>
    <div id="test_app">
        <!--echarts的容器-->
        <div id="main" style="width: 100%;height: 520px;background:#fff"></div>
    </div>
</template>
   
<script>
import * as echarts from 'echarts'
export default {
    name: 'echartsNavbar',
    props: ['xAxis', 'yAxis', 'series', 'legend', 'title'],
    data() {
        return {
            charts: ''
        }
    },
    methods: {
        drawLine(id) {
            this.charts = echarts.init(document.getElementById(id))
            this.charts.setOption({
                title: {
                    text: this.title,//标题文本，支持使用 \n 换行。
                },
                // 提示
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                // 图例
                legend: this.legend,
                // 折线图
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                // x轴坐标
                xAxis: {
                    boundaryGap: true,
                    data: this.xAxis //x坐标的名称

                },
                yAxis: this.yAxis,
                // 数据
                series: this.series
            })
        }
    },
    //调用
    mounted() {
        this.$nextTick(function () {
            this.drawLine('main')
        })
    }
}
</script>
   
<style scoped>
* {
    margin: 0;
    padding: 0;
    list-style: none;
}
</style>