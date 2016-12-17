import * as React from 'react'
import styled from 'styled-components'
import * as cx from 'classnames'
import {$p, Icon} from 'graphcool-styles'

// TODO move to Types dir
interface Integration {
  connected: boolean,
  logoURI: string,
  description: string
}

interface Props {
  integration: Integration 
}

const Card = styled.div`
  width: 317px;
  height: 322px;
  background-color: #dedede;
`
const ConnectionCheckmark = styled.div`
  width: 30px;
  height: 30px;
  background-color: #27AE60;
`

const IntegrationDetails = styled.div`
  background: papayawhip;
`

const Logo = styled.img`
  height: 54px;
`

const ConnectionStatus = styled.div`
  width: 109px;
  height: 30px;
  text-align: center;
  background-color: #4990E2;
`

export default class IntegrationsCard extends React.Component<Props, {}> {
  render() {
    const {integration} = this.props
    return (
      <Card className={cx($p.flex, $p.flexColumn)}>

        <div className={cx($p.w100, $p.flex, $p.flexRow, $p.justifyEnd)}>
          <ConnectionCheckmark className={cx($p.br100)}>
            <Icon
              src={require('../../../assets/icons/check.svg')}
              color='#fff'
            />
          </ConnectionCheckmark>
        </div>

        <IntegrationDetails 
          className={cx($p.tc, $p.flex, $p.flexColumn, $p.justifyAround, $p.h100)}
        >
          <Logo src={integration.logoURI} alt='integration-logo' />
          <div>
            {integration.description}
          </div>
          <ConnectionStatus className={cx($p.ttu)}>
            {integration.connected ? 'Connected' : 'Activate'}
          </ConnectionStatus>
        </IntegrationDetails>

      </Card>
    )
  }
}
