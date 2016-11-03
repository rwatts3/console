import * as React from 'react'
import * as Relay from 'react-relay'
import mapProps from '../../../../components/MapProps/MapProps'
import {Model, ModelPermission} from '../../../../types/types'
import {Icon} from 'graphcool-styles'

interface Props {
  model: Model
  permissions: ModelPermission[]
}

export type Operation = 'READ' | 'CREATE' | 'UPDATE' | 'DELETE'
class ModelPermissionsHeader extends React.Component<Props, {}> {
  render() {
    const {model, permissions} = this.props
    return (
      <div>
        <h1>{model.name}</h1>
        {permissions.map(permission => {
          switch (permission.operation) {
            case 'READ':
              return <Icon key={permission.id} src='graphcool-styles/icons/fill/apolloLogo.svg' />
            case 'CREATE':
              return <Icon key={permission.id} src='graphcool-styles/icons/fill/angularLogo.svg' />
            case 'UPDATE':
              return <Icon key={permission.id} src='graphcool-styles/icons/fill/graphcoolLogoSpaced.svg' />
            case 'DELETE':
              return <Icon key={permission.id} src='graphcool-styles/icons/fill/reactLogo.svg' />
            default:
              return <Icon key={permission.id} src='graphcool-styles/icons/fill/relayLogo.svg' />
          }
        })}
      </div>
    )
  }
}

const MappedPermissionsList = mapProps({
  model: props => props.model,
  permissions: props => props.model.permissions.edges.map(edge => edge.node),
})(ModelPermissionsHeader)

export default Relay.createContainer(MappedPermissionsList, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    model: () => Relay.QL`
      fragment on Model {
        name
        permissions(first: 100) {
          edges {
            node {
              isActive
              operation
            }
          }
        }
      }
    `,
  },
})
