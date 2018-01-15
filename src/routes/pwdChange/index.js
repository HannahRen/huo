import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'pwdchange',
  breadcrumbName: '修改密码',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const pwdChange = require('./containers/IndexContainer').default
      const reducer = require('./modules/Module').default
      injectReducer(store, { key: 'pwdChange', reducer })
      cb(null, pwdChange)
    }, 'pwdchange')
  }
})
