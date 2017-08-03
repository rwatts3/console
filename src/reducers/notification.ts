import { ReduxAction } from '../types/reducers'
import Constants from '../constants/notification'
import { NotificationState } from '../types/notification'

const initialState: NotificationState = {
  message: null,
  level: null,
}

export function reduceNotification(
  state: NotificationState = initialState,
  action: ReduxAction,
): NotificationState {
  switch (action.type) {
    case Constants.SHOW_NOTIFICATION:
      return action.payload
    case Constants.CLEAR_NOTIFICATION:
      return {
        message: null,
        level: null,
      }
    default:
      return state
  }
}
