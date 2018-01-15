import {createStore, compose, applyMiddleware} from 'redux'

import rootReducer from './reducers'
import middlewares from './middlewares'
import enhancers from './enhancers'

export default(initialState = {}) => {
  // ======================================================
  // Store Instantiation and HMR Setup
  // 仓库实例化、HMR设置
  // ======================================================
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middlewares),
      ...enhancers
    )
  )

  store.asyncReducers = {}

  // 开发环境下的热替换
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(rootReducer(store.asyncReducers))
    })
  }

  return store
}
