import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
import axios from 'axios';
Vue.prototype.$axios = axios;
//让请求带上cookie  
axios.defaults.withCredentials = true

import 'element-ui/lib/theme-chalk/index.css';
import { Input, Button,Drawer,Upload,Image} from 'element-ui';
Vue.use(Input);
Vue.use(Button);
Vue.use(Drawer);
Vue.use(Upload);
Vue.use(Image);
Vue.filter('toTime', function (e) {
  Date.prototype.Format = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1, // 月份
      "d+": this.getDate(), // 日
      "h+": this.getHours(), // 小时
      "m+": this.getMinutes(), // 分
      "s+": this.getSeconds(), // 秒
      "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
      "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + ""));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
  return new Date(e).Format('yy-MM-dd hh:mm:ss');
})


new Vue({
  render: h => h(App),
}).$mount('#app')
