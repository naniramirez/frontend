import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify/lib';
import axios from 'axios'
import {store} from "../store/store.js"
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(Chartkick.use(Chart))


import {router} from "./routes/routes.js"

axios.defaults.baseURL="http://localhost:5000/api/"
//axios.defaults.baseURL="https://appcompraventa.herokuapp.com/api"
//axios.defaults.baseURL = "https://git.heroku.com/vuecompraventa.git/api/"

//mongodb+srv://yenis:compraventa@cluster0.3e7li.mongodb.net/?retryWrites=true&w=majority




Vue.use(Vuetify,{
  
});

Vue.use(VueRouter);
Vue.use(VueSweetalert2);
Vue.config.productionTip = false



export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
})
new Vue({
  vuetify,
  router, 
  store,
  render: h => h(App),
  
}).$mount('#app')
