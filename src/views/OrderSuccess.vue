<template>
  <div>
    <nav-header></nav-header>
    <div class="container">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>check out</span></h2>
      </div>
      <!-- 进度条 -->
      <div class="check-step">
        <ul>
          <li class="cur"><span>选择</span> 地址</li>
          <li class="cur"><span>订单</span> 确认</li>
          <li class="cur"><span>订单</span> 付款</li>
          <li class="cur"><span>订单</span> 浏览</li>
        </ul>
      </div>

      <div class="order-create">
        <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
        <div class="order-create-main">
          <h3>恭喜! <br>你已经成功购买海盗船上的商品!</h3>
          <p>
            <span>订单编号：{{orderId}}</span>
            <span>订单总价：{{orderTotal|currency('元')}}</span>
          </p>
          <div class="order-create-btn-wrap">
            <div class="btn-l-wrap">
              <router-link class="btn btn--m" to="/cart">购物车</router-link>
            </div>
            <div class="btn-r-wrap">
              <router-link class="btn btn--m" to="/">首页</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
  import NavHeader from './../components/NavHeader';
  import NavFooter from './../components/NavFooter';
  import {currency} from './../util/currency';
  import axios from 'axios';

  export default {
    data() {
        return {
            orderId: '',
            orderTotal: 0
        };
    },
    components: {
        NavHeader,
        NavFooter
    },
    filters: {
        currency: currency
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            let orderId = this.$route.query.orderId;
            console.log('orderId:' + orderId);
            if (!orderId) {
                console.log(1);
              return;
            }
            let param = {
                orderId: orderId
            };
            axios.get('/users/orderDetail', {
              params: param
            }).then((response) => {
              console.log(2);
              let res = response.data;
              if (res.status === '0') {
                console.log(3);
                this.orderId = orderId;
                this.orderTotal = res.result.orderTotal;
              }
            });
        }
    }
  };

</script>
<style>

</style>
