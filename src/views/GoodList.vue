<template>
  <div id="GoodList">
    <nav-header></nav-header>
    <nav-bread><span>请输入查找的商品</span></nav-bread>
    <div class="accessory-result-page accessory-page">
      <!--内容显示区域-->
      <div class="container">
        <!--搜索框-->
        <div class="filter-nav">
          <span class="sortby">排序:</span>
          <a href="javascript:void(0)" class="default cur">默认</a>
          <a href="javascript:void(0)" class="price" v-bind:class="{'sort-up':sortFlag}" @click="sortGoods()">价格
            <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter By</a>
        </div>
        <!--搜索结果框-->
        <div class="accessory-result">
          <!--左侧价格 filter-->
          <div id="filter" class="filter stopPop" v-bind:class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>价格:</dt>
              <dd><a href="javascript:void(0)" @click="setPriceFilter('all')" v-bind:class="{'cur':priceCheck=='all'}">所有商品</a></dd>
              <dd v-for="(price,index) in priceFilter">
                <a href="javascript:void(0)"  @click="setPriceFilter(index)" v-bind:class="{'cur':priceCheck=='index'}">{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:void(0)" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="view-more-normal" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
                <img src="./../asset/loading-spinning-bubbles.svg" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <!--模态框-->
    <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
      <p slot="message">
          请先登录，否则无法加入购物车中！
      </p>
      <div slot="btnGroup">
        <a href="javascript:;" class="btn btn--m" @click="mdShow = false">关闭</a>
      </div>
    </modal>
    <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成功!</span>
      </p>
      <div slot="btnGroup">
        <a href="javascript:;" class="btn btn--m" @click="mdShowCart = false">继续购物</a>
        <router-link class="btn btn--m btn--red" to="/cart">查看购物车</router-link>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
  import NavHeader from './../components/NavHeader';
  import NavFooter from './../components/NavFooter';
  import NavBread from './../components/NavBread';
  import Modal from './../components/Modal';
  import axios from 'axios';

  export default{
    data() {
        return {
//            商品列表
          goodsList: [],
//          默认排序
          sortFlag: true,
          page: 1,
          pageSize: 8,
//          价格区间
          priceFilter: [
            {
              startPrice: '0',
              endPrice: '100'
            },
            {
              startPrice: '100',
              endPrice: '500'
            },
            {
              startPrice: '500',
              endPrice: '1000'
            },
            {
              startPrice: '1000',
              endPrice: '5000'
            }
          ],
//          选中的价格
          priceCheck: 'all',
//          Filter的显示
          filterBy: false,
          overLayFlag: false,
//          滚动页面设置
          busy: true,
          loading: false,
//          模态框
          mdShow: false,
          mdShowCart: false
        };
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread,
      Modal
    },
    mounted() {
        this.getGoodsList();
    },
    methods: {
//        数据获取
        getGoodsList(flag) {
          var param = {
             page: this.page,
             pageSize: this.pageSize,
             sort: this.sortFlag ? 1 : -1,
             priceLevel: this.priceCheck
          };
          this.loading = true;
          axios.get('/goods/list', {params: param}).then((response) => {
            let res = response.data;
            if (res.status === '0') {
                if (flag) {
                  this.goodsList = this.goodsList.concat(res.result.list);
                  if (res.result.count === 0) {
                    this.busy = true;
                  } else {
                    this.busy = false;
                  }
                } else {
                  this.goodsList = res.result.list;
                  this.busy = false;
                }
            } else {
              this.goodsList = [];
            }
          });
        },
//        价格排序
        sortGoods() {
            this.sortFlag = !this.sortFlag;
            this.page = 1;
            this.getGoodsList();
        },
//        滚动加载
        loadMore() {
          this.busy = true;
          setTimeout(() => {
            this.page++;
            this.getGoodsList(true);
          }, 500);
        },
        showFilterPop() {
            this.filterBy = true;
            this.overLayFlag = true;
        },
//        价格分段查询
        setPriceFilter(index) {
          this.priceCheck = index;
          this.page = 1;
          this.getGoodsList();
        },
//        添加购物车
        addCart(productId) {
            axios.post('/goods/addCart', {
                productId: productId
            }).then((response) => {
                var res = response.data;
                if (res.status === '0') {
                  alert('哇哈哈哈哈');
                  this.mdShowCart = true;
                } else {
                  this.mdShow = true;
                }
            });
        },
        closeModal() {
          this.mdShow = false;
          this.mdShowCart = false;
        },
        closePop() {
          this.filterBy = false;
          this.overLayFlag = false;
        }
    }
  };
</script>
<style>
  .sort-up{
    transform: rotate(180deg);
    transition:all .3s ease-out;
  }
  .icon-arrow-short  {
    width: 11px;
    height: 11px;
    transition: all .3s ease-out;
  }
  .btn{
    display: inline-block;
    width: 100%;
    padding: 0 10px;
    text-align: center;
    color: #d1cc6f;
    height: 40px;
    line-height: 40px;
    border: 1px solid #d1434a;
    margin-top: 10px;
  }
  .btn:hover{
    background-color: #e3ee77;
    transition: all .3s ease-out;
  }
</style>
