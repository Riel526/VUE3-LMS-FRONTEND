const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },

  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },

  {
    path: '/dashboard',
    component: () => import('layouts/DashBoard.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/students', component: () => import('src/pages/modules/StudentsPage/StudentsPage.vue') },
      { path: '/subjects', component: () => import('src/pages/modules/SubjectsPage/SubjectsPage.vue') },
      { path: '/profile', component: () => import('src/pages/user/ProfilePage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
