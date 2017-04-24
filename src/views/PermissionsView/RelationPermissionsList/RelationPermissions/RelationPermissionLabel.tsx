import * as React from 'react' // tslint:disable-line
import * as cx from 'classnames'
import {$p, variables} from 'graphcool-styles'
import styled from 'styled-components'

export type RelationPermissionType = 'connect' | 'disconnect'

function getTagSettings(operation: RelationPermissionType) {
  switch (operation) {
    case 'connect':
      return {
        text: 'Connect',
        color: variables.pblue,
        containerClass: cx($p.bgPblue20),
      }
    case 'disconnect':
      return {
        text: 'Disconnect',
        color: variables.pbrown,
        containerClass: cx($p.bgPyellow40),
      }
    default:
      return null
  }
}

const PermissionLabel = (props) => {
  const {operation, isActive, className} = props

  const {text, color, containerClass} = getTagSettings(operation)

  const Text = styled.div`
    color: ${color};
  `

  return (
    <div className={cx('container', $p.br1, $p.ph6, $p.dib, $p.nowrap, $p.fw6, containerClass, className, {
      [$p.o50]: !isActive,
    })}>
      <Text>{text}</Text>
    </div>
  )
}

export default PermissionLabel
