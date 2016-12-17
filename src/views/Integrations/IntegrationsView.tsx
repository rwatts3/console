import * as React from 'react'
import * as Relay from 'react-relay'
import Helmet from 'react-helmet'
import IntegrationsCardGrid from './IntegrationsCardGrid/IntegrationsCardGrid'
import IntegrationsHeader from './IntegrationsHeader/IntegrationsHeader'
import {$p} from 'graphcool-styles'
import * as cx from 'classnames'

interface Props {
  viewer: any
}

class IntegrationsView extends React.Component<Props, {}> {
  render() {
    const {project} = this.props.viewer
    return (
      <div className={cx($p.overflowScroll, $p.h100, $p.bgBlack04)}>
        <Helmet title='Integrations' />
        <IntegrationsHeader />
        <IntegrationsCardGrid project={project} />
      </div>
    )
  }
}

export default Relay.createContainer(IntegrationsView, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        project: projectByName(projectName: $projectName) {
          ${IntegrationsCardGrid.getFragment('project')}
        }
      }
    `,
  },
})
