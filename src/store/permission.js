import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { staticRoutes, asyncRoutes } from "@/router"
import asyncRouteSettings from "@/config/async-route"

const hasPermission = (roles, route) => {
  const routeRoles = route.meta?.roles
  return routeRoles ? roles.some((role) => routeRoles.includes(role)) : true
}

const filterAsyncRoutes = (routes, roles) => {
  const res = []
  routes.forEach((route) => {
    const tempRoute = { ...route }
    if (hasPermission(roles, tempRoute)) {
      if (tempRoute.children) {
        tempRoute.children = filterAsyncRoutes(tempRoute.children, roles)
      }
      res.push(tempRoute)
    }
  })
  return res
}

export const usePermissionStore = defineStore("permission", () => {
  const routes = ref([])
  const dynamicRoutes = ref([])

  const setRoutes = (roles) => {
    const accessedRoutes = asyncRouteSettings.open ? filterAsyncRoutes(asyncRoutes, roles) : asyncRoutes
    routes.value = staticRoutes.concat(accessedRoutes)
    dynamicRoutes.value = accessedRoutes
  }

  return { routes, dynamicRoutes, setRoutes }
})
