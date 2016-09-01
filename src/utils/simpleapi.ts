import {toGQL} from '../views/models/utils'
import {Field, OrderBy} from '../types/types'
import * as Immutable from 'immutable'
import {TypedValue} from '../types/utils'
import {isScalar, isNonScalarList} from './graphql'

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

export function queryNodes(lokka: any, modelNamePlural: string, skip: number,
                           fields: Field[], filters: Immutable.Map<string, any>, orderBy: OrderBy): Promise<any> {

  const fieldNames = fields
    .map((field) => isScalar(field.typeIdentifier) ? field.name : `${field.name} { id }`)
    .join(' ')

  const filterQuery = filters
    .filter((v) => v !== null)
    .map((value, fieldName) => `${fieldName}: ${value}`)
    .join(' ')

  const filter = filterQuery !== '' ? `filter: { ${filterQuery} }` : ''
  const orderByQuery = `orderBy: ${orderBy.fieldName}_${orderBy.order}`
  const query = `
    {
      all${modelNamePlural}(first: 50 skip: ${skip} ${filter} ${orderByQuery}) {
        ${fieldNames}
      }
    }
  `
  return lokka.query(query)
}
