import * as React from 'react'
import * as Relay from 'react-relay'
import {Model} from '../../../../types/types'
import ModelPermissionsHeader from './ModelPermissionsHeader'
import ModelPermissionsList from './ModelPermissionList'
import {$p} from 'graphcool-styles'
import * as cx from 'classnames'

interface Props {
  model: Model
}

class PermissionsList extends React.Component<Props, {}> {
  render() {
    const {model} = this.props
    return (
      <div className={cx($p.pa16, $p.mb25)}>
        <ModelPermissionsHeader model={model} />
        <ModelPermissionsList model={model} />
      </div>
    )
  }
}

export default Relay.createContainer(PermissionsList, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    model: () => Relay.QL`
      fragment on Model {
        ${ModelPermissionsHeader.getFragment('model')}
        ${ModelPermissionsList.getFragment('model')}
      }
    `,
  },
})
