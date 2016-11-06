import * as React from 'react'
import * as Relay from 'react-relay'
import {ModelPermission, Field} from '../../../../types/types'
import {$p} from 'graphcool-styles'
import * as cx from 'classnames'
import mapProps from '../../../../components/MapProps/MapProps'
import {isScalar} from '../../../../utils/graphql'
import PermissionField from './PermissionField'

interface Props {
  permission: ModelPermission
  fields: Field[]
}

class ModelPermissionFields extends React.Component<Props, {}> {
  render() {
    const {permission: {fieldIds, applyToWholeModel, isActive}, fields} = this.props
    return (
      fields && fields.length > 0 && (
        <div className={cx($p.flex, $p.flexRow, $p.ml16, $p.itemsCenter)}>
          <div className={cx($p.black50)}>in</div>
          {fields.map(field =>
            <PermissionField
              key={field.id}
              disabled={(!fieldIds.includes(field.id) && !applyToWholeModel) || !isActive}
              name={field.name}
            />
          )}
        </div>
      )
    )
  }
}

const MappedModelPermissionFields = mapProps({
  // filter out all relations
  fields: props => {
    return props.model.fields.edges.reduce(
      (list, edge) => {
        const {node} = edge

        if (['CREATE', 'UPDATE'].includes(props.permission.operation) && node.isReadonly) {
          return list
        }

        if (isScalar(node.typeIdentifier)) {
          return list.concat(node)
        }

        return list
      },
      []
    )
  },
})(ModelPermissionFields)

export default Relay.createContainer(MappedModelPermissionFields, {
  fragments: {
    permission: () => Relay.QL`
      fragment on ModelPermission {
        fieldIds
        operation
        applyToWholeModel
        isActive
      }
    `,
    model: () => Relay.QL`
      fragment on Model {
        fields(first: 100) {
          edges {
            node {
              id
              name
              isReadonly
              isList
              typeIdentifier
            }
          }
        }
      }
    `,
  },
})
