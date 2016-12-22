import * as React from 'react'
import * as cx from 'classnames'
import * as Relay from 'react-relay'
import styled from 'styled-components'
import {Project} from '../../types/types'
import {$p} from 'graphcool-styles'
import IntegrationsCard from './IntegrationsCard'
import IntegrationsCardPlaceholder from './IntegrationsCardPlaceholder'

interface Props {
  project: Project
  params: any
}

class IntegrationsCardGrid extends React.Component<Props, {}> {
  render() {
    const isEnabled = this.props.project.integrations.edges.length > 0
      && this.props.project.integrations.edges[0].node.isEnabled
    const {params: {projectName}} = this.props

    const mockIntegration = {
      isEnabled,
      logoURI: require('../../assets/graphics/algolia-logo.svg'),
      description: 'Hosted Search API that delivers instant and relevant results from the first keystroke',
      link: `/${projectName}/integrations/algolia`,
    }

    return (
      <div className={cx($p.flex, $p.flexColumn)}>
        <div className={cx($p.flex, $p.flexRow)}>
          <IntegrationsCard integration={mockIntegration} />
          <IntegrationsCardPlaceholder />
          <IntegrationsCardPlaceholder />
        </div>
        <div className={cx($p.flex, $p.flexRow)}>
          <IntegrationsCardPlaceholder />
          <IntegrationsCardPlaceholder />
          <div
            style={{width: '317px', height: '322px', margin: '12px'}}
            className={cx(
              $p.flex,
              $p.justifyCenter,
              $p.itemsCenter,
              $p.ttu,
              $p.tc,
              $p.sansSerif,
              $p.black20,
            )}
          >
            There's more<br />
            to come
          </div>
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(IntegrationsCardGrid, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        integrations(first: 100) {
          edges {
            node {
              id
              isEnabled
            }
          }
        }
      }
    `,
  },
})
