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
  margin: 12px;
`

const ConnectionCheckmark = styled.div`
  width: 30px;
  height: 30px;
  background-color: #27AE60;
`

const Logo = styled.img`
  height: 54px;
`

export default class IntegrationsCard extends React.Component<Props, {}> {
  render() {
    const {integration} = this.props
    return (
      <Card className={cx($p.flex, $p.flexColumn, $p.pa38, $p.bgWhite, $p.buttonShadow)}>

        <div className={cx($p.w100, $p.flex, $p.flexRow, $p.justifyEnd)}>
          <ConnectionCheckmark
            className={cx(
              $p.br100,
              $p.flex,
              $p.itemsCenter,
              $p.justifyCenter,
            )}
          >
            <Icon
              src={require('../../../assets/icons/check.svg')}
              color='#fff'
            />
          </ConnectionCheckmark>
        </div>

        <div
          className={cx(
            $p.tc,
            $p.flex,
            $p.flexColumn,
            $p.justifyAround,
            $p.h100,
            $p.sansSerif,
          )}
        >
          <Logo src={integration.logoURI} alt='integration-logo' />
          <div className={cx($p.black50)}>
            {integration.description}
          </div>
          <div className={cx($p.flex, $p.flexRow, $p.justifyCenter, $p.itemsCenter, $p.mt38)}>
            <div
              className={cx(
                $p.ttu,
                $p.br2,
                $p.f14,
                $p.pv4,
                $p.ph10,
                $p.br2,
                $p.pointer,
                {
                  [`${$p.green} ${$p.bgGreen20}`]: integration.connected,
                  [`${$p.white} ${$p.bgBlue}`]: !integration.connected,
                },
              )}
            >
              {integration.connected ? 'Connected' : 'Activate'}
            </div>
          </div>
        </div>

      </Card>
    )
  }
}
