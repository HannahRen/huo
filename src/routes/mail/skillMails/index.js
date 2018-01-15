import {injectReducer} from '../../../../store/reducers'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { browserHistory } from 'react-router'
export default(store) => ({
  path: 'skillMail',
  breadcrumbName: '发技能邮件',
  getComponent(nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu.includes(50100)) {
      require.ensure([], (require) => {
        NProgress.start()
        const Mails = require('./containers/IndexContainer').default
        const reducer = require('./modules/Module').default
        injectReducer(store, {
          key: 'skillMail',
          reducer
        })
        cb(null, Mails)
        NProgress.done()
      }, 'skillMail')
    } else {
      browserHistory.push('/')
    }
  }
})
