import {injectReducer} from '../../../../../store/reducers'
import { browserHistory } from 'react-router'
export default(store) => ({
  path: 'index',
  breadcrumbName: '批量发邮件',
  getComponent(nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu.includes(50200)) {
      require.ensure([], (require) => {
        const Batchmail = require('./containers/IndexContainer').default
        const reducer = require('./modules/Module').default
        injectReducer(store, {
          key: 'batchmail',
          reducer
        })
        cb(null, Batchmail)
      })
    } else {
      browserHistory.push('/')
    }
  }
})
