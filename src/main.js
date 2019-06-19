// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'jquery'
import 'bootstrap'
import firebase from 'firebase'
import './components/firebaseInit'
import router from './router'
import vuejquery from 'vue-jquery'
const $ = require('jquery')
window.$ = $
require('jquery-confirm')

Vue.use(vuejquery)
Vue.config.productionTip = false

let app;
firebase.auth().onAuthStateChanged(function(user) {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      router,
      template: '<App/>',
      components: { App }
    });
  }
});
/* eslint-disable no-new */

