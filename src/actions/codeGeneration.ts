import {Environment, GraphQLClient} from '../types/types'
import Constants from '../constants/codeGeneration'

export const setEnvironment = (env: Environment) => ({
  type: Constants.SET_CODE_GENERATION_ENVIRONMENT,
  payload: env,
})

export const setClient = (client: GraphQLClient) => ({
  type: Constants.SET_CODE_GENERATION_CLIENT,
  payload: client,
})
