import {toGQL} from '../views/models/utils'
import {Field, OrderBy} from '../types/types'
import * as Immutable from 'immutable'
import {TypedValue} from '../types/utils'
import {isScalar, isNonScalarList} from './graphql'
import * as cookiestore from './cookiestore'
import { Lokka } from 'lokka'
import { Transport } from 'lokka-transport-http'

export function getLokka(projectId: string): any {
  const clientEndpoint = `${__BACKEND_ADDR__}/simple/v1/${projectId}`
  const token = cookiestore.get('graphcool_auth_token')
  const headers = { Authorization: `Bearer ${token}` }
  const transport = new Transport(clientEndpoint, { headers })
  return new Lokka({transport})
}

export function addNode(lokka: any, modelName: string, fieldValues: { [key: string]: any }): Promise<any> {
  const inputString = fieldValues
    .mapToArray((fieldName, obj) => obj)
    .filter(({value}) => value !== null)
    .filter(({field}) => (!isNonScalarList(field)))
    .map(({field, value}) => toGQL(value, field))
    .join(' ')

  const inputArgumentsString = inputString.length > 0 ? `(${inputString})` : ''

  const mutation = `
    {
      create${modelName}${inputArgumentsString} {
        id
      }
    }
  `
  return lokka.mutate(mutation)
}

export function updateNode(lokka: any, modelName: string, value: TypedValue,
                           field: Field, nodeId: string): Promise<any> {
  const mutation = `
    {
      update${modelName}(
        id: "${nodeId}"
        ${toGQL(value, field)}
      ) {
        id
      }
    }
  `
  return lokka.mutate(mutation)
}

export function deleteNode(lokka: any, modelName: string, nodeId: string): Promise<any> {
  const mutation = `
    {
      delete${modelName}(
        id: "${nodeId}"
      ) {
        id
      }
    }
  `
  return lokka.mutate(mutation)
}

export function queryNodes(lokka: any, modelNamePlural: string, fields: Field[], skip: number = 0, first: number = 50,
                           filters: Immutable.Map<string, any> = Immutable.Map<string, any>(),
                           orderBy?: OrderBy): Promise<any> {

  const fieldNames = fields
    .map((field) => isScalar(field.typeIdentifier) ? field.name : `${field.name} { id }`)
    .join(' ')

  const filterQuery = filters
    .filter((v) => v !== null)
    .map((value, fieldName) => `${fieldName}: ${value}`)
    .join(' ')

  const filter = filterQuery !== '' ? `filter: { ${filterQuery} }` : ''
  const orderByQuery = orderBy ? `orderBy: ${orderBy.fieldName}_${orderBy.order}` : ''
  const query = `
    {
      all${modelNamePlural}(first: ${first} skip: ${skip} ${filter} ${orderByQuery}) {
        ${fieldNames}
      }
    }
  `
  return lokka.query(query)
}
