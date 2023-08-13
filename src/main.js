import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入 element-ui 库
import Element from 'element-ui'

// 引入css
import 'element-ui/lib/theme-chalk/index.css'

// 引入全局css
import './assets/css/global.css'

// 引入axios
import axios from 'axios'
// if (process.env.NODE_ENV === 'development') { //说明当前为开发环境
// 开发环境相关特殊方法
// 设置axios请求默认根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
//baseUrl地址使用.env.development文件中的配置对象API_HOST，API_HOST名称不固定，根据你的定义的来
// }
// else if (process.env.NODE_ENV === 'production') {
//   // 生产环境相关特殊方法
//   axios.defaults.baseURL = process.env.APP_BASE_URL;
//   // baseUrl地址使用.env.production文件中的配置对象API_HOST，API_HOST名称不固定，根据你的定义的来
// }

// request 拦截器
axios.interceptors.request.use(config => {
  // console.log(config);
  // 请求头获取token
  config.headers.Authorization = JSON.parse(window.sessionStorage.getItem('user'))?.token;
  return config;
})

// 引入富文本组件
import QuillEditor from 'vue-quill-editor'
// 引入富文本组件样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 使用富文本组件
Vue.use(QuillEditor)

// 注册全局axios
Vue.prototype.$http = axios;

// 使用element组件
Vue.use(Element);

Vue.config.productionTip = false;
// 关闭浏览器控制台警告
Vue.config.warnHandler = () => null;

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
