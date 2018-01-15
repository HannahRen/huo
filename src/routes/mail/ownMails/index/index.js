import {injectReducer} from '../../../../store/reducers'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import { browserHistory } from 'react-router'
export default(store) => ({
  path: 'index',
  breadcrumbName: '个人邮件页',
  getComponent(nextState, cb) {
    // const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    // if (subMenu.includes(50300)) {
      require.ensure([], (require) => {
        NProgress.start()
        const Mails = require('./components/Index').default
        const reducer = require('./modules/Module').default

        injectReducer(store, {
          key: 'ownMail',
          reducer
        })
        cb(null, Mails)
        NProgress.done()
      }, 'ownMail')
    // } else {
    //   browserHistory.push('/')
    // }
  }
})
