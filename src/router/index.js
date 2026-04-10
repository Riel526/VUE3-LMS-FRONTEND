import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { currUserStore } from 'src/stores/user/user'
import { renderToast } from 'src/utils/notify'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from, next) => {
    const currUser = currUserStore()
    const isAuthenticated = !!currUser.token

    // Check if the route has 'requiresAuth' meta tag
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!isAuthenticated) {
        next('/login')
        renderToast('Info', 'Info - User Token Expired / User is Not logged in', 'Kindly Relog-in')
      } else {
        next() // All good, proceed
      }
    } 
    // If logged in and trying to go to login page, redirect to dashboard
    else if (to.path === '/login' && isAuthenticated) {
      renderToast('Info', 'Info - Navigation error', 'Kindly Log out')
      next('/dashboard')
    }
    else {
      next() // Public page, proceed
    }
  })

  return Router
})
