import {
  createRouter,
  createWebHistory,
  type RouteRecordMultipleViewsWithChildren,
  type RouteRecordSingleViewWithChildren,
  type RouteRecordMultipleViews,
  type RouteRecordRedirect,
  type RouteRecordSingleView,
} from 'vue-router'

import DashboardView from '@/pages/DashboardView.vue'
import appConfig from "@/app.config.ts"

interface CustomRouteMeta {
  meta: {
    label: string
    icon?: string
    showInNav?: boolean
  },
}

export type CustomRouteRecordRaw =
| (
  Omit<RouteRecordSingleView, 'children'>
  & CustomRouteMeta
  & {
    children?: never
  }
)
| (
  Omit<RouteRecordSingleViewWithChildren, 'children'>
  & CustomRouteMeta
  & {
    children: CustomRouteRecordRaw[]
  }
)
| (
  Omit<RouteRecordMultipleViews, 'children'>
  & CustomRouteMeta
  & {
    children?: never
  }
)
| (
  Omit<RouteRecordMultipleViewsWithChildren, 'children'>
  & CustomRouteMeta
  & {
    children: CustomRouteRecordRaw[]
  }
)
| (
  Omit<RouteRecordRedirect, 'children'>
  & CustomRouteMeta
  & {
    children?: CustomRouteRecordRaw[]
  }
)

const icons = appConfig.ui.icons

export const routes: readonly CustomRouteRecordRaw[] = [
  {
    path: '/',
    component: DashboardView,
    name: 'dashboard',
    meta: {
      label: 'Dashboard',
      icon: icons.dashboard,
      showInNav: true,
    },
  },
  {
    path: '/floor-plans',
    name: 'floor-plans',
    component: () => import('@/pages/floor-plans/FloorPlansView.vue'),
    meta: {
      label: 'Floor Plans',
      icon: icons.floorPlan,
      showInNav: true,
    },
  },
  {
    path: '/floor-plans/:id',
    name: 'floor-plans-id',
    component: () => import('@/pages/floor-plans/FloorPlanView.vue'),
    meta: {
      label: 'Floor Plan',
      icon: icons.floorPlan,
    },
  },
  {
    path: '/sandbox',
    name: 'sandbox',
    redirect: () => ({ name: 'sandbox-floor-plan' }),
    meta: {
      label: 'Sandbox',
      icon: icons.flask,
      showInNav: true,
    },
    children: [
      {
        path: '/sandbox/cursor',
        name: 'sandbox-cursor',
        component: () => import('@/pages/sandbox/CursorView.vue'),
        meta: {
          label: 'Sandbox',
          icon: icons.cursor,
          showInNav: true,
        },
      },
      {
        path: '/sandbox/floor-plan',
        name: 'sandbox-floor-plan',
        component: () => import('@/pages/sandbox/FloorPlanTests/FloorPlanTestsView.vue'),
        redirect: () => ({ name: 'sandbox-floor-plan-example' }),
        meta: {
          label: 'Floor plan',
          icon: icons.floorPlan,
          showInNav: true,
        },
        children: [
          {
            path: 'example',
            name: 'sandbox-floor-plan-example',
            component: () => import('@/pages/sandbox/FloorPlanTests/FloorPlanTestsExampleView.vue'),
            meta: {
              label: 'Example',
              showInNav: true,
            }
          },
          {
            path: 'coordinates',
            name: 'sandbox-floor-plan-coordinates',
            component: () => import('@/pages/sandbox/FloorPlanTests/FloorPlanTestsCoordinatesView.vue'),
            meta: {
              label: 'Coordinates',
              showInNav: true,
            }
          },
        ]
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})