import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: 'tasks',
        name: 'tasks',
        component: () => import('pages/Tasks.vue'),
        children: [
          {
            path: ':date',
            name: 'filteredTasks',
            component: () => import('pages/FilteredTasks.vue'),
          },
          {
            path: '',
            name: 'emptyFilteredTasks',
            component: () => import('pages/EmptyFilteredTasks.vue'),
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
]

export default routes
