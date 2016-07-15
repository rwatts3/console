// Actions
const UPDATE = 'dashboard/gettingStartedReducer/UPDATE'

// Reducer
const intialState = {gettingStartedState: 'STEP11_SKIPPED'}
export function gettingStarted (state = intialState, action = {}) {
  switch (action.type) {
    case UPDATE:
      var gettingStartedState = action.payload.gettingStartedState

      console.log('update')
      console.log(gettingStartedState)

      return Object.assign({}, state, {
        gettingStartedState,
      })
    default:
      return state
  }
}

// Action Creators
export function updateGettingStartedState (gettingStartedState) {
  const payload = {gettingStartedState}
  console.log('dispatching')
  console.log(payload)
  return {type: UPDATE, payload}
}
