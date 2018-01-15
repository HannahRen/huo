import thunk from 'redux-thunk'
import promise from 'redux-promise'
// import logger from 'redux-logger'

const middlewares = [thunk, promise]

// if (__DEV__) {
//   middlewares.push(logger)
// }

export default middlewares
