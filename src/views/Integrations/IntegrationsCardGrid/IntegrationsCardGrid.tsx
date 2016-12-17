import * as React from 'react'
import * as cx from 'classnames'
import styled from 'styled-components'
import {$p} from 'graphcool-styles'
import IntegrationsCard from '../IntegrationsCard/IntegrationsCard';
import IntegrationsCardPlaceholder from '../IntegrationsCardPlaceholder/IntegrationsCardPlaceholder'

const mockIntegration = {
  connected: false,
  logoURI: 'http://www.revalueyourit.com/assets/Algolia_logo_bg-white-0896a46b68512d010ae60f80a8634fac627eb45b7d0f6028e5af5fcf74549f9c.svg',
  description: 'Hosted Search API that delivers instant and relevant results from the first keystroke'
}

const IntegrationsCardGrid = (props) => {
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
            $p.black20
          )}
        >
          There's more<br />
          to come
        </div>
      </div>
    </div>
  )
}

export default IntegrationsCardGrid
