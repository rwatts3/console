import {FunctionBinding, ServerlessFunction} from '../../../types/types'
export function getEmptyFunction(): ServerlessFunction {
  return {
    id: '',
    name: '',
    type: 'AUTH0',
    webhookUrl: '',
    webhookHeaders: '',
    inlineCode: 'module.exports = function(body, cb) { cb(null, { body }) }',
    auth0Id: '',
    logs: {
      edges: [],
    },
  }
}

export function updateInlineCode(state: ServerlessFunction, inlineCode: string): ServerlessFunction {
  return {
    ...state,
    inlineCode,
  }
}

export function updateName(state: ServerlessFunction, name: string): ServerlessFunction {
  return {
    ...state,
    name,
  }
}

export function updateBinding(state: ServerlessFunction, binding: FunctionBinding): ServerlessFunction {
  return {
    ...state,
    binding,
  }
}

export function updateModel(state: ServerlessFunction, modelId: string): ServerlessFunction {
  return {
    ...state,
    modelId,
  }
}
