import { commitMutation, Environment, MutationConfig } from 'react-relay'
import environment from '../relayEnvironment'

export function makeMutation(mutationConfig: MutationConfig): Promise<any> {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      ...mutationConfig,
      onCompleted: resolve,
      onError: reject,
    })
  })
}
