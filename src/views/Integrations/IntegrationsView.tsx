import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import Helmet from 'react-helmet'
import IntegrationsCardGrid from './IntegrationsCardGrid'
import IntegrationsHeader from './IntegrationsHeader'
import { $p } from 'graphcool-styles'
import * as cx from 'classnames'
import { Viewer } from '../../types/types'

interface Props {
  viewer: Viewer
  location: any
  params: any
}

class IntegrationsView extends React.Component<Props, {}> {
  render() {
    const { viewer: { project, user }, params, location } = this.props

    return (
      <div className={cx($p.overflowScroll, $p.h100, $p.bgBlack04)}>
        <Helmet title="Integrations" />
        <IntegrationsHeader />
        <IntegrationsCardGrid
          isBeta={user.crm.information.isBeta}
          project={project}
          params={params}
        />
        {this.props.children}
      </div>
    )
  }
}

export default createFragmentContainer(IntegrationsView, {
  viewer: graphql`
    fragment IntegrationsView_viewer on Viewer {
      project: projectByName(projectName: $projectName) {
        ...IntegrationsCardGrid_project
      }
      user {
        crm {
          information {
            isBeta
          }
        }
      }
    }
  `,
})
