import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {browserHistory, Router} from 'react-router'
import {Provider} from 'react-redux'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'


export default class App extends Component {

  render() {
    const {routes, store} = this.props
    return (
      <Provider store={store}>
        <LocaleProvider locale={zhCN}>
          <div>
            <Router history={browserHistory} children={routes} />
          </div>
        </LocaleProvider>
      </Provider>
    )
  }
}

App.propTypes = {
  routes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}
