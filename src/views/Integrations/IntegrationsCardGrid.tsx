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

    const algoliaIntegration = {
      isEnabled,
      logoURI: require('../../assets/graphics/algolia-logo.svg'),
      description: 'Hosted Search API that delivers instant and relevant results from the first keystroke',
      link: `/${projectName}/integrations/algolia`,
    }

    const auth0Integration = {
      isEnabled: null,
      logoURI: require('assets/graphics/auth0-logo-blue.svg'),
      description: 'Add authentication to your web and mobile apps in under 10 minutes',
      link: `/${projectName}/integrations/authentication/auth0`,
    }

    const digitsIntegration = {
      isEnabled: null,
      logoURI: require('assets/graphics/digits.png'),
      description: 'No more passwords. Powerful login that grows your mobile graph',
      link: `/${projectName}/integrations/authentication/digits`,
    }

    return (
      <div className={cx($p.flex, $p.flexColumn)}>
        <div className={cx($p.flex, $p.flexRow)}>
          <IntegrationsCard integration={algoliaIntegration} />
          <IntegrationsCard integration={auth0Integration} />
          <IntegrationsCard integration={digitsIntegration} />
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
