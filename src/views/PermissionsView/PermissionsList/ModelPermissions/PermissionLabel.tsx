import * as React from 'react' // tslint:disable-line
import * as cx from 'classnames'
import {$p, variables} from 'graphcool-styles'
import styled from 'styled-components'
import {Operation} from '../../../../types/types'

function getTagSettings(operation: Operation) {
  switch (operation) {
    case 'READ':
      return {
        text: 'View Data',
        color: variables.pblue,
        containerClass: cx($p.bgPblue20),
      }
    case 'CREATE':
      return {
        text: 'Create Node',
        color: variables.pgreen,
        containerClass: cx($p.bgPlightgreen50),
      }
    case 'UPDATE':
      return {
        text: 'Edit Data',
        color: variables.pbrown,
        containerClass: cx($p.bgPyellow40),
      }
    case 'DELETE':
      return {
        text: 'Delete Node',
        color: variables.pred,
        containerClass: cx($p.bgPred20),
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
    <div className={cx($p.br1, $p.ph6, $p.dib, $p.nowrap, containerClass, className, {
      [$p.o50]: !isActive,
    })}>
      <Text>{text}</Text>
    </div>
  )
}

export default PermissionLabel
