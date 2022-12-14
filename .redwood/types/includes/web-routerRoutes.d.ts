// This file was generated by RedwoodJS
import { RouteParams, QueryParams } from '@redwoodjs/router'
import { A } from 'ts-toolbelt'


declare module '@redwoodjs/router' {
  interface AvailableRoutes {
    // Only "<Route />" components with a "name" and "path" prop will be populated here.
    login: (params?: RouteParams<"/login"> & QueryParams) => "/login"
    signup: (params?: RouteParams<"/signup"> & QueryParams) => "/signup"
    forgotPassword: (params?: RouteParams<"/forgot-password"> & QueryParams) => "/forgot-password"
    resetPassword: (params?: RouteParams<"/reset-password"> & QueryParams) => "/reset-password"
    home: (params?: RouteParams<"/"> & QueryParams) => "/"
  }
}

