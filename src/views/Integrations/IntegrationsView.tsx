import * as React from 'react'
import * as Relay from 'react-relay'
import Helmet from 'react-helmet'
import IntegrationsCardGrid from './IntegrationsCardGrid/IntegrationsCardGrid'
import IntegrationsHeader from './IntegrationsHeader/IntegrationsHeader'

export default class IntegrationsView extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <Helmet title='Integrations' />
        <IntegrationsHeader />
        <IntegrationsCardGrid />
      </div>
    )
  }
}
