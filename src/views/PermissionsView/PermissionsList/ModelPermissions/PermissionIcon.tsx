import * as React from 'react' // tslint:disable-line
import * as cx from 'classnames'
import {$p, Icon, variables} from 'graphcool-styles'
import styled from 'styled-components'
import {Operation} from '../../../../types/types'

function getIconSettings(operation: Operation) {
  switch (operation) {
    case 'READ':
      return {
        icon: {
          src: require('graphcool-styles/icons/stroke/viewSpaced.svg'),
          color: variables.pblue,
        },
        containerClass: cx($p.bgPblue20),
      }
    case 'CREATE':
      return {
        icon: {
          src: require('graphcool-styles/icons/stroke/editAddSpaced.svg'),
          color: variables.pgreen,
        },
        containerClass: cx($p.bgPlightgreen50),
      }
    case 'UPDATE':
      return {
        icon: {
          src: require('graphcool-styles/icons/stroke/editSpaced.svg'),
          color: variables.pbrown,
        },
        containerClass: cx($p.bgPyellow40),
      }
    case 'DELETE':
      return {
        icon: {
          src: require('graphcool-styles/icons/stroke/deleteSpaced.svg'),
          color: variables.pred,
        },
        containerClass: cx($p.bgPred20),
      }
    default:
      return null
  }
}

const DisabledIcon = styled(Icon)`
  &:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: ${$p.bBlack10};
    transform: rotate(45deg);
  }
`

const Container = styled.div`
  width: 26px;
  height: 26px;
`

const PermissionIcon = (props) => {
  const {operation, isActive, className} = props

  const IconClass = isActive ? DisabledIcon : Icon
  let {icon, containerClass} = getIconSettings(operation)

  let inactiveColor = {}
  if (!isActive) {
    delete icon.color
    inactiveColor = {
      color: variables.gray30,
    }

    containerClass = cx($p.ba, $p.bBlack10)
  }

  return (
    <Container className={cx($p.flex, $p.itemsCenter, $p.justifyCenter, $p.br100, containerClass, className)}>
      <IconClass {...icon} {...inactiveColor} stroke={true} strokeWidth={2} width={24} height={24} />
    </Container>
  )
}

export default PermissionIcon
