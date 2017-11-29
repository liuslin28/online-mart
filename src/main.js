// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueLazyLoad from 'vue-lazyload';
import infiniteScroll from 'vue-infinite-scroll';
import {currency} from './util/currency';
Vue.config.productionTip = false;

import './asset/css/base.css';
import './asset/css/checkout.css';
import './asset/css/product.css';

Vue.use(infiniteScroll);
Vue.use(VueLazyLoad, {
  loading: 'static/loading-svg/loading-bars.svg'
});
Vue.filter('currency', currency);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
