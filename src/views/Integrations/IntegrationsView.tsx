import * as React from 'react'
import * as Relay from 'react-relay'
import Helmet from 'react-helmet'
import IntegrationsCardGrid from './IntegrationsCardGrid/IntegrationsCardGrid'
import IntegrationsHeader from './IntegrationsHeader/IntegrationsHeader'
import {$p} from 'graphcool-styles'
import * as cx from 'classnames'

export default class IntegrationsView extends React.Component<{}, {}> {
  render() {
    return (
      <div className={cx($p.overflowScroll, $p.h100, $p.bgBlack04)}>
        <Helmet title='Integrations' />
        <IntegrationsHeader />
        <IntegrationsCardGrid />
      </div>
    )
  }
}
