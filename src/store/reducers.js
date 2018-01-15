import { combineReducers } from 'redux'

import emptyReducer from './empty'

// 根Reducer
const rootReducer = (asyncReducers) => {
  return combineReducers({
    empty: emptyReducer,
    ...asyncReducers
  })
}

// 注入
// replaceReducer(nextReducer)
// 替换 store 当前用来计算 state 的 reducer。
export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(rootReducer(store.asyncReducers))
}

export default rootReducer
