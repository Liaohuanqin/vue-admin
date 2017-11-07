// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// cookie && localstorage
import VueCookie from 'vue-cookie'
Vue.use(VueCookie)
import VueLocalStorage from 'vue-localstorage'
Vue.use(VueLocalStorage)

import axios from "@/server/axios.js"
Object.defineProperty(Vue.prototype,'$axios',{
    value:axios
})

// 处理element ui库
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(Element)

// canvas库
import 'echarts'
import ECharts from 'vue-echarts/components/ECharts.vue'
Vue.component('chart', ECharts)

import "@/widget/vue-config.js"

import router from './router'
import store from "./store"

Vue.config.productionTip = false

import topNav from '@/components/common/topnav'
import sideMenu from "@/components/common/menu"
import bottomFooter from "@/components/common/footer"
import vueTitle from "@/widget/title.vue"

import './assets/css/bootstrap-grid.min.css';
import './assets/css/bootstrap-reboot.min.css';
import './assets/css/lib.css';

/* eslint-disable no-new */
let instance = new Vue({
    el: '#app',
    router,
    store,
    components: {
        topNav,
        sideMenu,
        bottomFooter,
        vueTitle,
    },
    watch:{
        "$store.state.isLogin"(isLogin){
            if(isLogin){
                this.$router.replace({
                    path:this.$store.state.uri.redirect || '/'
                })
            }else{
                this.$router.push({
                    path:'/index/login'
                })
            }
        },
    },
    created (){
        if(this.$localStorage.get('token') && !this.$store.state.isLogin){
            this.$store.dispatch('getUserInfo')
        }
    },
})