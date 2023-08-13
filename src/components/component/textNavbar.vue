<template>
    <div>
        <quill-editor ref="myQuillEditor" v-model="nr" class="editor" :options="editorOption"
            @blur="quillEditorFocus($event)" />
        <!-- 富文本编辑器中的上传图片控件 -->
        <el-upload class="avatar-uploader-img" :auto-upload="false" :show-file-list="false" :on-change="change"
            :data="{ 'pathName': '' }" />
    </div>
</template>
<script>
// 工具栏配置
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
    ['blockquote', 'code-block'], // 引用  代码块
    [{ header: 1 }, { header: 2 }], // 1、2 级标题
    [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
    [{ script: 'sub' }, { script: 'super' }], // 上标/下标
    [{ indent: '-1' }, { indent: '+1' }], // 缩进
    // [{'direction': 'rtl'}],                         // 文本方向
    [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
    [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
    [{ font: [] }], // 字体种类
    [{ align: [] }], // 对齐方式
    ['clean'], // 清除文本格式
    // ['link', 'image', 'video'] // 链接、图片
    ['link', 'image'] // 链接、图片
]
export default {
    name: 'textNavbar',
    props: ['nr'],
    data() {
        return {
            visible: false,
            editorOption: { // 编辑框操作事件
                theme: 'snow', // or 'bubble'
                placeholder: 'gulugulu...',
                modules: {
                    toolbar: {
                        container: toolbarOptions,
                        handlers: {
                            image: function (value) { // 上传图片
                                if (value) {
                                    document.querySelector('.avatar-uploader-img input').click() // 触发input框选择文件
                                } else {
                                    this.quill.format('image', false)
                                }
                            },
                            link: function (value) { // 添加链接
                                if (value) {
                                    var href = prompt('请输入链接地址：')
                                    this.quill.format('link', href)
                                } else {
                                    this.quill.format('link', false)
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    computed: {
        dataRule() {
            return {
                nr: [//内容
                    { required: true, message: this.$t('validate.required'), trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        change(file) {//富文本图片上传前
            // console.log(file)
            const isJPG = file.raw.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG，PNG, GIF 格式!')
            } else {
                // 显示loading动画
                this.quillUpdate = true
                // 获取富文本组件实例
                const quill = this.$refs.myQuillEditor.quill
                // 获取光标所在位置
                const length = quill.getSelection().index
                // 插入图片  res.info为服务器返回的图片地址
                quill.insertEmbed(length, 'image', file.url)
                // 调整光标到最后
                quill.setSelection(length + 1)
                // loading动画消失
                this.quillUpdate = false
            }
            // return isJPG
        },
        quillEditorFocus(event) {//富文本的获得焦点事件
            // 在这里可以设置富文本编辑器是否可编辑
            //event.enable(false);//不可输入和编辑
            //event.enable(true);//可以输入和编辑
            this.$emit('content', this.nr);
        }
    }
}
</script>
<style scope lang="less">
/** 设置富文本的高度 **/
.editor {
    line-height: normal !important;
    // height: 400px;
    margin-bottom: 10px;
}

.ql-container {
    height: 350px !important;
}

/** 设置富文本的高度 **/

/** 设置工具栏中上传图片和上传视频对应的文件上传组件样式 **/
.avatar-uploader-img {
    height: 0;
}

.avatar-uploader-video {
    height: 0;
}

/** 设置工具栏中上传图片和上传视频对应的文件上传组件样式 **/


/deep/ .ql-snow .ql-tooltip[data-mode=link]::before {
    content: '请输入链接地址：';
}

/deep/ .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存';
    padding-right: 0px;
}

/deep/ .ql-snow .ql-tooltip[data-mode=video]::before {
    content: '请输入视频地址：';
}

/deep/ .ql-snow .ql-picker.ql-size .ql-picker-label::before,
/deep/ .ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: '14px';
}

/deep/ .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
/deep/ .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    content: '10px';
}

/deep/ .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
/deep/ .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    content: '18px';
}

/deep/ .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
/deep/ .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
    content: '32px';
}

/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: '文本';
}

/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
    content: '标题1';
}

/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
    content: '标题2';
}

/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
    content: '标题3';
}

/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
    content: '标题4';
}

/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
    content: '标题5';
}

/deep/ .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
/deep/ .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
    content: '标题6';
}

/deep/ .ql-snow .ql-picker.ql-font .ql-picker-label::before,
/deep/ .ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: '标准字体';
}

/deep/ .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
/deep/ .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    content: '衬线字体';
}

/deep/ .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
/deep/ .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    content: '等宽字体';
}
</style>