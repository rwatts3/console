import * as React from 'react'
import * as cx from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import styled from 'styled-components'
import {Project} from '../../types/types'
import {$p} from 'graphcool-styles'
import IntegrationsCard from './IntegrationsCard'
import IntegrationsCardPlaceholder from './IntegrationsCardPlaceholder'
import {Icon} from 'graphcool-styles'

interface Props {
  project: Project
  params: any
  isBeta: boolean
}

class IntegrationsCardGrid extends React.Component<Props, {}> {
  render() {
    const isEnabled = this.props.project.integrations.edges.length > 0
      && this.props.project.integrations.edges[0].node.isEnabled
    const {params: {projectName}, isBeta} = this.props

    const providers = this.props.project.authProviders.edges.map(edge => edge.node)

    const anonEnabled = !!this.props.project.packageDefinitions.edges
      .map(edge => edge.node)
      .find(node => node.name === 'anonymous-auth-provider')

    const algoliaIntegration = {
      isEnabled,
      logoURI: require('../../assets/graphics/algolia-logo.svg'),
      description: 'Hosted Search API that delivers instant and relevant results from the first keystroke',
      link: `/${projectName}/algolia`,
    }

    const auth0Integration = {
      isEnabled: Boolean(providers.find(prov => prov.type === 'AUTH_PROVIDER_AUTH0' && prov.isEnabled)),
      logoURI: require('assets/graphics/auth0-logo-blue.svg'),
      description: 'Add authentication to your web and mobile apps in under 10 minutes',
      link: `/${projectName}/integrations/authentication/auth0`,
    }

    const digitsIntegration = {
      isEnabled: Boolean(providers.find(prov => prov.type === 'AUTH_PROVIDER_DIGITS' && prov.isEnabled)),
      logoURI: require('assets/graphics/digits.png'),
      description: <div>
        <div>
          The Digits integration is <b>deprecated</b> and will be removed on the 09/30/17
        </div>
        <a
          href='http://get.digits.com/blog/introducing-firebase-phone-authentication'
          target='_blank'
          onClick={e => e.stopPropagation()}
        >
          <b>Read more</b>
        </a>
      </div>,
      link: `/${projectName}/integrations/authentication/digits`,
    }

    const emailIntegration = {
      isEnabled: Boolean(providers.find(prov => prov.type === 'AUTH_PROVIDER_EMAIL' && prov.isEnabled)),
      logo: (
        <div className='email-auth-provider'>
          <style jsx>{`
            .email-auth-provider {
              @p: .flex, .itemsCenter, .w100, .justifyCenter;
            }
            .email {
              @p: .fw3, .f25, .ml16;
            }
          `}</style>
          <Icon
            src={require('assets/icons/logo.svg')}
            width={40}
            height={40}
            color='#00B861'
          />
          <div className='email'>
            Email-Password Auth
          </div>
        </div>
      ),
      description: 'Built-in Email-Password based Auth Provider',
      link: `/${projectName}/integrations/authentication/email`,
    }

    const anonymousIntegration = {
      isEnabled: anonEnabled,
      logo: (
        <div className='email-auth-provider'>
          <style jsx>{`
            .email-auth-provider {
              @p: .flex, .itemsCenter, .w100, .justifyCenter;
            }
            .email {
              @p: .fw3, .f25, .ml16;
            }
          `}</style>
          <Icon
            src={require('assets/icons/logo.svg')}
            width={40}
            height={40}
            color='#00B861'
          />
          <div className='email'>
            Anonymous Auth
          </div>
        </div>
      ),
      description: 'The anonymous auth provider can be used if you need temporary sessions.',
      link: `/${projectName}/integrations/authentication/anonymous`,
    }

    return (
      <div className={cx($p.flex, $p.flexColumn, $p.mr25)}>
        <div className={cx($p.flex, $p.flexRow)}>
          <IntegrationsCard integration={algoliaIntegration} />
          <IntegrationsCard integration={auth0Integration} />
          <IntegrationsCard integration={digitsIntegration} />
        </div>
        <div className={cx($p.flex, $p.flexRow)}>
          <IntegrationsCard integration={emailIntegration} />
          <IntegrationsCard integration={anonymousIntegration} />
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

export default createFragmentContainer(IntegrationsCardGrid, {
  project: graphql`
    fragment IntegrationsCardGrid_project on Project {
      integrations(first: 1000) {
        edges {
          node {
            id
            isEnabled
          }
        }
      }
      authProviders(first: 1000) {
        edges {
          node {
            isEnabled
            type
          }
        }
      }
      packageDefinitions(first: 1000) {
        edges {
          node {
            name
          }
        }
      }
    }
  `,
})
