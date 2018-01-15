import {injectReducer} from '../../../../../store/reducers'
export default(store) => ({
  path: 'players',
  breadcrumbName: '查看邮件详情',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const details = require('./containers/PlayersContainer').default
      const reducer = require('./modules/PlayersModule').default

      injectReducer(store, {
        key: 'allianceMailPlayer',
        reducer
      })
      cb(null, details)
    })
  }
})
