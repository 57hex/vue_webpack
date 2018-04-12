import Vue from 'vue'
import Router from 'vue-router'
import main from '@/components/main'
import back from '@/components/back'
import thanks from '@/components/thanks'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: main
    },
    {
      path: '/back',
      name: 'back',
      component: back
    },
    {
      path: '/thanks',
      name: 'thanks',
      component: thanks
    }
  ]
})
