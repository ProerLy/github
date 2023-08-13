<template>
    <div class="page">
        <span>共{{ total }}条数据</span>
        <el-select size="mini" v-model="pageSize" @change="Size(pageSize)" placeholder="请选择">
            <el-option v-for="item in list" :key="item.size" :label="item.title" :value="item.size">
            </el-option>
        </el-select>
        <el-pagination :page-size="pageSize" :current-page="pageNum" background layout="prev, pager, next" :total="total"
            @current-change="change" pager-count="10">
        </el-pagination>
        <span class="tonum">前往<el-input @blur="change(pageNum)" v-model.lazy="pageNum" />页</span>
    </div>
</template>
<script>
export default {
    name: 'pageNavbar',
    props: {
        // 总页数
        total: {
            type: Number,
            required: true
        },
        // 一页的条数
        pageSize: {
            type: Number,
            required: true
        },
        // 当前选中页面
        pageNum: {
            type: Number,
            required: true
        },
        // 页面个数
        list: {
            type: Array,
            required: true
        }
    },
    // 方法
    methods: {
        // 修改页数
        change(num) {
            if (num) {
                this.$emit('change', num);
            }
        },
        // 修改个数
        Size(num) {
            this.$emit('changesize', num);
        }
    }
}
</script>
<style scoped>
.page {
    display: flex;
    align-items: center;

    .tonum {
        display: flex;
        align-items: center;

        .el-input {
            width: 50px;

            input{
                text-align: center;
            }
        }
    }

    .el-select{
        width:100px;
        margin-left: 20px;
    }

    .el-pagination{
        margin: 0 20px;
    }
}
</style>