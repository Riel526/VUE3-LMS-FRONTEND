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
      // students
      { path: '/students', component: () => import('src/pages/modules/StudentsPage/StudentsPage.vue') },

      //subjects

      { path: '/subjects', component: () => import('src/pages/modules/SubjectsPage/SubjectsPage.vue') },

      // profile

      { path: '/profile', component: () => import('src/pages/user/ProfilePage.vue') },

      // teachers

      { path: '/teachers', component: () => import('src/pages/modules/TeachersPage/TeachersPage.vue') },

      // assignments
      
      { path: '/assignments', component: () => import('src/pages/modules/AssignmentsPage/AssignmentsPage.vue') },
      { path: '/assignments/create-assignment', component: () => import('src/pages/modules/AssignmentsPage/CreateUpdateAssignmentPage.vue') },
      { path: '/assignments/create-assignment/:id', component: () => import('src/pages/modules/AssignmentsPage/CreateUpdateAssignmentPage.vue') },
      { path: '/assignments/answer-assignment/:id', component: () => import('src/pages/modules/AssignmentsPage/AnswerAssignmentPage.vue') },
      { path: '/assignments/view-result/:id', component: () => import('src/pages/modules/AssignmentsPage/ViewResult.vue') },

      // chat

      { path: '/chat', component: () => import('src/pages/modules/ChatsPage/ChatsPage.vue') },

      // payment
      { path: '/payments', component: () => import('src/pages/modules/PaymentsPage/PaymentsPage.vue') },
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
