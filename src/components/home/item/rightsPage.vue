<template>
    <div>
        
            <!-- 顺序选择器 -->
            <el-radio-group v-model="isList" @change="getRights" size="small">
                <el-radio-button v-for="it in lines" :key="it.label" :label="it.label">
                    {{ it.text }}
                </el-radio-button>
            </el-radio-group>
            <!-- 列表 -->
            <el-table :data="rights" border stripe height="450" v-if="isList === 'list'">
                <el-table-column type="index" label="序号" width="50">
                </el-table-column>
                <el-table-column prop="id" label="权限ID">
                </el-table-column>
                <el-table-column prop="authName" label="权限名">
                </el-table-column>
                <el-table-column prop="path" label="路径">
                </el-table-column>
                <el-table-column label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level == 0" type="info" size="normal">等级1</el-tag>
                        <el-tag v-else-if="scope.row.level == 1" type="success" size="normal">等级2</el-tag>
                        <el-tag v-else type="primary" size="normal">等级3</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 树状 -->
            <el-tree v-else :data="rights" :props="defaultProps"></el-tree>
        
    </div>
</template>
<script>
export default {
    name: 'rightsPage',
    data() {
        return {
            // 排序的方法
            isList: 'list',
            // 排序类型
            lines: [{
                label: 'list',
                text: '列表'
            },
            {
                label: 'tree',
                text: '树形'
            }],
            // 权限列表
            rights: [],
            defaultProps: {
                children: 'children',
                label: 'authName'
            }
        }
    },
    created() {
        this.getRights();
    },
    methods: {
        // 获取权限列表
        async getRights() {
            const { data: res } = await this.$http('rights/' + this.isList);
            // console.log(res);
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.rights = res.data;
        }
    }
}
</script>
<style></style>