import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'

import Pomodoro from '@/components/Pomodoro.vue'
import Todo from '@/components/Todo.vue'
import Paint from '@/components/Paint.vue'
import Sheet from '@/components/Sheet.vue'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {name:'Login',
     path:'/',
     component:Login,
     meta:{
      requiresGuset: true
     }
    },
    {name:'Register',
     path:'/register', 
     component:Register,
     meta:{
       requiresGuest: true
     }
    },
    {name:'Pomodoro',
     path:'/pomodoro',
     component:Pomodoro,
     meta:{
       requiresAuth: true
     }
    },
    {name:'Todo',
     path:'/todo',
     component:Todo,
     meta:{
      requiresAuth: true
    }},
    {name:'Paint',
     path:'/paint',
     component:Paint,
     meta:{
       requiresAuth: true
     }
    },
    {name:'Sheet',
     path:'/sheet',
     component:Sheet,
     meta:{
       requiresAuth: true
     }
    }
  ]
});

router.beforeEach((to,form, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!firebase.auth().currentUser) {
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (firebase.auth().currentUser) {
      next({
        path: '/pomodoro',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;