import {injectReducer} from '../../../../../store/reducers'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { browserHistory } from 'react-router'
export default(store) => ({
  path: 'index',
  breadcrumbName: '全服邮件页',
  getComponent(nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu.includes(50500)) {
      require.ensure([], (require) => {
        NProgress.start()
        const Mails = require('./containers/IndexContainer').default
        const reducer = require('./modules/Module').default

        injectReducer(store, {
          key: 'serverMail',
          reducer
        })
        cb(null, Mails)
        NProgress.done()
      }, 'serverMail')
    } else {
      browserHistory.push('/')
    }
  }
})
