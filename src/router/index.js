/**
 * Created by bbt on 2017/11/3.
 */
import Vue from 'vue';
import Router from 'vue-router';
import GoodList from './../views/GoodList.vue';
import Cart from './../views/Cart.vue';
import Address from './../views/Address.vue';
import OrderConfirm from './../views/OrderConfirm.vue';
import OrderSuccess from './../views/OrderSuccess.vue';
Vue.use(Router);

export default new Router({
    routes: [
      {
        path: '/',
        name: 'GoodsList',
        component: GoodList
      },
      {
        path: '/cart',
        name: 'Cart',
        component: Cart
      },
      {
        path: '/address',
        name: 'Address',
        component: Address
      },
      {
        path: '/orderconfirm',
        name: 'OrderConfirm',
        component: OrderConfirm
      },
      {
        path: '/ordersuccess',
        name: 'OrderSuccess',
        component: OrderSuccess
      }
    ]
  }
);
