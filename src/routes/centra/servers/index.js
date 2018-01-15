import { injectReducer } from '../../../store/reducers'
import { browserHistory } from 'react-router'
export default (store) => ({
  path: 'servers',
  breadcrumbName: '服务器列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const servers = require('./containers/IndexContainer').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'server', reducer })
        cb(null, servers)
      })
    } else {
      browserHistory.push('/')
    }
  }
})
