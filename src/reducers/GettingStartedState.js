import UpdateUserMutation from 'mutations/UpdateUserMutation'
import Relay from 'react-relay'

export class GettingStartedState {

  static steps = [
    'STEP1_OVERVIEW',
    'STEP2_CREATE_TODO_MODEL',
    'STEP3_CREATE_TEXT_FIELD',
    'STEP4_CREATE_COMPLETED_FIELD',
    'STEP5_GOTO_DATA_TAB',
    'STEP6_ADD_DATA_ITEM_1',
    'STEP7_ADD_DATA_ITEM_2',
    'STEP8_GOTO_GETTING_STARTED',
    'STEP9_WAITING_FOR_REQUESTS',
    'STEP10_DONE',
    'STEP11_SKIPPED',
  ]

  constructor ({ step, userId }) {
    this._userId = userId
    this.update(step)
  }

  isActive (step) {
    const isCurrentStep = step ? this.step === step : true
    return isCurrentStep && this.step !== 'STEP10_DONE' && this.step !== 'STEP11_SKIPPED'
  }

  update (step) {
    const currentStepIndex = GettingStartedState.steps.indexOf(this.step)
    const stepIndex = GettingStartedState.steps.indexOf(step)
    if (currentStepIndex > stepIndex) {
      return
    }

    this.step = step

    switch (step) {
      case 'STEP1_OVERVIEW': this.progress = 0; break
      case 'STEP2_CREATE_TODO_MODEL': this.progress = 1; break
      case 'STEP3_CREATE_TEXT_FIELD': this.progress = 1; break
      case 'STEP4_CREATE_COMPLETED_FIELD': this.progress = 1; break
      case 'STEP5_GOTO_DATA_TAB': this.progress = 2; break
      case 'STEP6_ADD_DATA_ITEM_1': this.progress = 2; break
      case 'STEP7_ADD_DATA_ITEM_2': this.progress = 2; break
      case 'STEP8_GOTO_GETTING_STARTED': this.progress = 3; break
      case 'STEP9_WAITING_FOR_REQUESTS': this.progress = 3; break
      case 'STEP10_DONE': this.progress = 4; break
      case 'STEP11_SKIPPED': this.progress = 0; break
    }
  }

  skip () {
    return new Promise((resolve, reject) => {
      Relay.Store.commitUpdate(new UpdateUserMutation({
        userId: this._userId,
        gettingStartedStatus: 'STEP11_SKIPPED',
      }), {
        onSuccess: resolve,
        onFailure: reject,
      })
    })
  }

  nextStep () {
    const currentStep = this.step
    const currentStepIndex = GettingStartedState.steps.indexOf(currentStep)
    const nextStep = GettingStartedState.steps[currentStepIndex + 1]

    return new Promise((resolve, reject) => {
      Relay.Store.commitUpdate(new UpdateUserMutation({
        userId: this._userId,
        gettingStartedStatus: nextStep,
      }), {
        onSuccess: resolve,
        onFailure: reject,
      })
    })
  }
}

// Actions
const UPDATE = 'dashboard/gettingStartedReducer/UPDATE'

// Reducer
const initialState = {}
export function reduceGettingStartedState (state = initialState, action = {}) {
  console.log(initialState)
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
export function updateGettingStartedState (step, userId) {
  const payload = {gettingStartedState: new GettingStartedState({step, userId})}
  console.log(payload)
  return {type: UPDATE, payload}
}

export function fetchGettingStartedState () {
  return function (dispatch) {
    var query = Relay.createQuery(Relay.QL`
      query {
        viewer {
          user {
            id
            gettingStartedStatus
          }
        }
      }`, {})

    return new Promise(function (resolve, reject) {
      Relay.Store.primeCache({query}, ({done, error}) => {
        if (done) {
          const data = Relay.Store.readQuery(query)[0]
          dispatch(updateGettingStartedState(data.user.gettingStartedStatus, data.user.id))
          resolve()
        } else if (error) {
          reject(Error('Error when fetching gettingStartedState'))
        }
      })
    })
  }
}

