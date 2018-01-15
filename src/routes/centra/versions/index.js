import { injectReducer } from '../../../store/reducers'
import { browserHistory } from 'react-router'
export default (store) => ({
  path: 'versions',
  breadcrumbName: '节点列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const versions = require('./containers/IndexContainer').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'version', reducer })
        cb(null, versions)
      })
    } else {
      browserHistory.push('/')
    }
  }
})
