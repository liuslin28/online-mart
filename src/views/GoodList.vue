<template>
  <div id="GoodList">
    <NavHeader></NavHeader>
    <NavBread><span>请输入查找的商品</span></NavBread>
    <div class="accessory-result-page accessory-page">
      <!--内容显示区域-->
      <div class="container">
        <!--搜索框-->
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price"  @click="sortGoods()">Price<svg class="icon icon-arrow-short"></svg></a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter By</a>
        </div>
        <!--搜索结果框-->
        <div class="accessory-result">
          <!--左侧价格 filter-->
          <div id="filter" class="filter stopPop" v-bind:class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" @click="setPriceFilter('all')" v-bind:class="{'cur':priceCheck=='all'}">All</a></dd>
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
    <NavFooter></NavFooter>
  </div>
</template>
<script>
  import NavHeader from './../components/NavHeader';
  import NavFooter from './../components/NavFooter';
  import NavBread from './../components/NavBread';
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
          loading: false
        };
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread
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
          axios.get('/goods', {params: param}).then((response) => {
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
            }).then(res => {
                if (res.status === 0) {
                    alert('哇哈哈哈哈');
                } else {
                  alert('msg:' + res.msg);
                }
            });
        },
        closePop() {
          this.filterBy = false;
          this.overLayFlag = false;
        }
    }
  };
</script>
<style>

</style>
