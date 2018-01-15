// 我们只需要导入初始渲染所需的模块
import BaseLayout from '../base/components/BaseLayout.jsx'
import Index from './index/components/Index'
import { injectReducer } from '../store/reducers'
import { default as loginReducer } from './../base/modules/Login'
import {default as productsReducer} from './../base/modules/products'
import {default as goodsReducer} from './../base/modules/goods'
import {default as channelsReducer} from './../base/modules/channels'
import { default as centraReducer } from '../base/modules/Centra'

import user from './user'
import centra from './centra'
import PageNotFound from './pagenotfound'
import pwdChange from './pwdchange'
import mail from './mail'
import Redirect from './pagenotfound/redirect'
import 'ant-design-pro/dist/ant-design-pro.css'


export const createRoutes = store => ({
  path: '/',
  breadcrumbName: 'Home',
  getComponent(nextState, cb) {
    injectReducer(store, {
      key: 'islogin',
      reducer: loginReducer
    })
    injectReducer(store, {
      key: 'products',
      reducer: productsReducer
    })
    injectReducer(store, {
      key: 'goods',
      reducer: goodsReducer
    })
    injectReducer(store, {
      key: 'channels',
      reducer: channelsReducer
    })
    injectReducer(store, {
      key: 'centra',
      reducer: centraReducer
    })
    cb(null, BaseLayout)
  },
  getIndexRoute(location, cb) {
    cb(null, {component: Index})
  },
  childRoutes: [
    user(store),
    centra(store),
    PageNotFound(),
    pwdChange(store),
    mail(store),
    Redirect
  ]
})

export default createRoutes
