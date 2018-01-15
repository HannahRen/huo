import { injectReducer } from '../../../store/reducers'
import { browserHistory } from 'react-router'
export default (store) => ({
  path: 'groups',
  breadcrumbName: '分组列表',
  getComponent (nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu) {
      require.ensure([], (require) => {
        const groups = require('./containers/IndexContainer').default
        const reducer = require('./modules/Module').default
        injectReducer(store, { key: 'group', reducer })
        cb(null, groups)
      })
    } else {
      browserHistory.push('/')
    }
  }
})
