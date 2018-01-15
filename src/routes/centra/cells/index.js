import { injectReducer } from '../../../store/reducers'
import { browserHistory } from 'react-router'

export default (store) => ({
  path: 'cells',
  breadcrumbName: '节点列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const cells = require('./components/Index').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'cell', reducer })
        cb(null, cells)
      })
    } else {
      browserHistory.push('/')
    }
  }
})
