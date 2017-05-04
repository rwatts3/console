import {FunctionBinding, ServerlessFunction} from '../../../types/types'
export function getEmptyFunction(): ServerlessFunction {
  return {
    id: '',
    name: '',
    type: 'AUTH0',
    webhookUrl: '',
    webhookHeaders: '',
    inlineCode,
    auth0Id: '',
    logs: {
      edges: [],
    },
    binding: 'PRE_WRITE',
  }
}

const inlineCode = `export default function (event) {
  const { data, context } = event
  console.log(data)
  return { data }
}
`

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

export function updateWebhookUrl(state: ServerlessFunction, webhookUrl: string): ServerlessFunction {
  return {
    ...state,
    webhookUrl,
  }
}
