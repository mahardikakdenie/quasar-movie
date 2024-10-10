import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/:lang',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    beforeEnter: (to, from, next) => {
      const supportedLangs = ['en', 'id'];
      const lang = to.params.lang as string;
      if (!supportedLangs.includes(lang)) {
        // Redirect to English if the language is not supported
        return next({ path: '/en' });
      }
      next();
    },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'dika', component: () => import('pages/FormCopo.vue') },
    ],
  },

  {
    path: '/login',
    name: 'LoginPage',
    component: () => import('pages/LoginPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    meta: {
      requiresAuth: true,
    },
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
