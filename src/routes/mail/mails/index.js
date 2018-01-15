import {injectReducer} from '../../../../store/reducers'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { browserHistory } from 'react-router'
export default(store) => ({
  path: 'mails',
  breadcrumbName: '邮件管理',
  getComponent(nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu.includes(50100)) {
      require.ensure([], (require) => {
        NProgress.start()
        const Mails = require('./containers/MailsContainer').default
        const reducer = require('./modules/Mails').default
        injectReducer(store, {
          key: 'mails',
          reducer
        })
        cb(null, Mails)
        NProgress.done()
      }, 'mails')
    } else {
      browserHistory.push('/')
    }
  }
})
