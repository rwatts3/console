import * as React from 'react'
import * as Relay from 'react-relay'
import {ModelPermission, Field} from '../../../../types/types'
import {$p} from 'graphcool-styles'
import * as cx from 'classnames'
import mapProps from '../../../../components/MapProps/MapProps'
import {isScalar} from '../../../../utils/graphql'

interface Props {
  permission: ModelPermission
  fields: Field[]
}

class ModelPermissionFields extends React.Component<Props, {}> {
  render() {
    const {permission: {fieldIds}, fields} = this.props
    return (
      <div className={cx($p.flex, $p.flexRow, $p.ml16, $p.itemsCenter)}>
        <div className={cx($p.black50)}>in</div>
        {fields && fields.map(field =>
          <div
            key={field.id}
            className={cx($p.bgBlack10, $p.ph6, $p.black40, $p.dib, $p.ml10, $p.code, $p.br1, {
              [$p.o50]: !fieldIds.includes(field.id),
            })}
          >{field.name}</div>
        )}
      </div>
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
