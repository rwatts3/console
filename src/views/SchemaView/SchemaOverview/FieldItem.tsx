import * as React from 'react'
import {Field, ModelPermission} from '../../../types/types'
import TypeTag from './TypeTag'
import {Link} from 'react-router'
import PermissionsTag from './PermissionsTag'
import {isScalar} from '../../../utils/graphql'

interface Props {
  projectName?: string
  modelName?: string
  field: Field
  hideBorder?: boolean
  permissions: ModelPermission[]
  create?: boolean
}

export interface PermissionMap {
  CREATE: boolean
  READ: boolean
  UPDATE: boolean
  DELETE: boolean
}

export default class FieldItem extends React.Component<Props, null> {
  render() {
    const {field, modelName, projectName, hideBorder, create} = this.props
    const permissions = this.getPermissions()
    const item = (
      <div className={'field-item' + (hideBorder ? '' : ' show-border')}>
        <style jsx>{`
          .field-item {
            @p: .pa16, .flex, .justifyBetween, .nowrap;
          }
          .field-item.show-border {
            @p: .bt, .bBlack10;
          }
          .name {
            @p: .fw6, .black60;
          }
          .flexy {
            @p: .flex, .itemsCenter;
          }
          .unique {
            @p: .br2, .ba, .bBlack30, .black30, .f10, .fw7, .ttu, .mr10;
            padding: 3px 4px 4px 6px;
          }
        `}</style>
        <div className='flexy'>
            <span className='name'>
              {field.name}
            </span>
          <TypeTag field={field} />
        </div>
        <div className='flexy'>
          <div>
            {field.isUnique && (
              <div className='unique'>Unique</div>
            )}
          </div>
          {!create && (
            <Link to={`/${projectName}/permissions`}>
              <PermissionsTag
                permissions={permissions}
              />
            </Link>
          )}
        </div>
      </div>
    )
    const element = field.isSystem ? 'div' : Link
    let link = `/${projectName}/schema/${modelName}/edit/${field.name}`
    if (!isScalar(field.typeIdentifier)) {
      link = `/${projectName}/schema/relations/edit/${field.relation.name}`
    }
    return (
      (field.isSystem || create) ? (
        item
      ) : (
        <Link to={link}>
          {item}
        </Link>
      )
    )
  }

  private getPermissions() {
    const {permissions, field} = this.props
    let permissionMap: PermissionMap = {
      CREATE: false,
      READ: false,
      UPDATE: false,
      DELETE: false,
    }

    permissions
      .filter(permission => permission.isActive)
      .forEach(permission => {
        const appliesToFields = permission.applyToWholeModel || permission.fieldIds.includes(field.id)
        permissionMap[permission.operation] = permissionMap[permission.operation] || appliesToFields
      })

    return permissionMap
  }
}
