import Vue from 'vue'
import contractPlugin from '@/tool/contractPlugin';
import directivesPlugin from '@/tool/directivesPlugin';
import mixinPlugin from '@/tool/watchPlugin';
import TheHeader from '@/components/TheHeader.vue';
import '@/tool/vantConfig';
import Copy from 'vue-to-copy';
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n/i18n';
import "lib-flexible/flexible.js";
import '@/style/index.css';

Vue.use(contractPlugin);
Vue.use(directivesPlugin);
Vue.use(mixinPlugin);
Vue.use(Copy);
Vue.component('TheHeader', TheHeader);
Vue.config.productionTip = false;


/**
 *，this.MyGo(-1);
 *, this.$router.isBack = true;
 * @param {*} num-1，
 */
Vue.prototype.MyGo = (num = -1) => {
  router.isBack = true;
  router.go(num);
};

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
