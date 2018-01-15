
// ------------------------------------
// Constants
// ------------------------------------

const CENTRA_KEEPING = 'CENTRA_KEEPING'

// ------------------------------------
// Actions
// ------------------------------------

function keepCentra(data) {
  return {
    type: CENTRA_KEEPING,
    payload: data
  }
}

export {
  keepCentra
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [CENTRA_KEEPING]: (state, action) => {
    return ({
      ...state,
      keeping: {
        ...state.keeping,
        ...action.payload
      }
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  keeping: {}
}

export default function centraReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
