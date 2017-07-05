import {EventType} from '../views/FunctionsView/FunctionPopup/FunctionPopup'
import {ServerlessFunction} from '../types/types'
export function getEventTypeFromFunction(fn: ServerlessFunction | null): EventType {

  if (!fn) {
    return 'SSS'
  }

  switch (fn.__typename) {
    case 'CustomMutationFunction':
      return 'CUSTOM_MUTATION'
    case 'CustomQueryFunction':
      return 'CUSTOM_QUERY'
    case 'ServerSideSubscriptionFunction':
      return 'SSS'
    case 'RequestPipelineMutationFunction':
      return 'RP'
  }

  throw new Error(`unkown function type ${fn.__typename}`)
}
