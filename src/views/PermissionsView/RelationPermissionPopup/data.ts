import { Relation } from '../../../types/types'
export function getEmptyRelationPermissionQuery(relation: Relation) {
  return `query {
  Some${relation.leftModel.name}Exists(filter: {
    # ...
  })
  Some${relation.rightModel.name}Exists(filter: {
    # ...
  })
}`
}
