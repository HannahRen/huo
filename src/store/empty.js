// ------------------------------------
// ActionType Constants 常量
// ------------------------------------
const EMPTY = 'EMPTY'

// ------------------------------------
// Actions 行为
// ------------------------------------
// function locationChange (location = '/') {
//   return {
//     type: EMPTY,
//     payload: location
//   }
// }

const ACTION_HANDLERS = {
  [EMPTY]: (state) => {
    return ({
      ...state
    })
  }
}
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
