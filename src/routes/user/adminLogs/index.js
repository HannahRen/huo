import { browserHistory } from 'react-router'
import { injectReducer } from '../../../store/reducers'

export default (store) => ({
  path: 'adminlogs',
  breadcrumbName: '管理员日志',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu.includes(10500)) {
      require.ensure([], (require) => {
        const adminLog = require('./containers/IndexContainer').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'adminLog', reducer })
        cb(null, adminLog)
      }, 'adminlogs')
    } else {
      browserHistory.push('/')
    }
  }
})
