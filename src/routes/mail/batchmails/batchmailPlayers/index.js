import {injectReducer} from '../../../../../store/reducers'
import { browserHistory } from 'react-router'
export default(store) => ({
  path: 'batchmailPlayers',
  breadcrumbName: '查询批量邮件玩家',
  getComponent(nextState, cb) {
    const subMenu = JSON.parse(sessionStorage.getItem('subMenu'))

    if (subMenu.includes(50200)) {
      require.ensure([], (require) => {
        const Batchmail = require('./containers/PlayerContainer').default
        const playerReducer = require('./modules/PlayerModule').default
        injectReducer(store, {
          key: 'batchmailPlayer',
          reducer: playerReducer
        })
        cb(null, Batchmail)
      })
    } else {
      browserHistory.push('/')
    }
  }
})
