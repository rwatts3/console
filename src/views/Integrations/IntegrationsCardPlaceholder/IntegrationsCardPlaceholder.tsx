import * as React from 'react'
import styled from 'styled-components'
import * as cx from 'classnames'
import {$p} from 'graphcool-styles'

const Card = styled.div`
  width: 317px;
  height: 322px;
  margin: 12px;
`

const LogoPlaceholder = styled.div`
  width: 173px;
  height: 30px;
`

const IntegrationsCardPlaceholder = () => {
  return (
    <Card className={cx(
      $p.flex,
      $p.flexColumn,
      $p.itemsCenter,
      $p.justifyCenter,
      $p.bgBlack10,
    )}>
      <div className={cx($p.w60, $p.hS38, $p.mb16, $p.bgBlack20)} />
      
      <div>
        <div className={cx($p.w60, $p.hS38, $p.bgBlack20)} />
        <div className={cx($p.w60, $p.hS38, $p.bgBlack20)} />
        <div className={cx($p.w60, $p.hS38, $p.bgBlack20)} />
      </div>
    </Card>
  )
}

export default IntegrationsCardPlaceholder
