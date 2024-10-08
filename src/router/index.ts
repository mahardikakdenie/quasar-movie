import { route } from 'quasar/wrappers';
import { createRouter, createWebHistory } from 'vue-router';

import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  // const createHistory = process.env.SERVER
  //   ? createMemoryHistory
  //   : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const createHistory = createWebHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });
  // Navigation guard to check if user is authenticated
  Router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token'); // Check for token in localStorage
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth); // Check if the route requires authentication

    if (requiresAuth && !token) {
      // If the route requires authentication and there's no token, redirect to login
      const fullPath = to?.fullPath;
      next(`/login?href=${fullPath}`);
    } else if (token && to.path === '/login') {
      // If the user is already logged in and tries to access the login page, redirect them
      next('/');
    } else {
      // Otherwise, allow the navigation
      next();
    }
  });

  return Router;
});
