import * as React from 'react' // tslint:disable-line
import {$p, variables} from 'graphcool-styles'
import * as cx from 'classnames'
import styled from 'styled-components'

const Container = styled.div`
  height: 103px;
`

const Button = styled.button`
  transition: color ${variables.duration} linear;

  &:hover {
    opacity: 0.7;
  }
`

export default (props) => (
  <Container className={cx($p.flex, $p.justifyBetween, $p.white, $p.itemsCenter, $p.bt, $p.ph25)}>
    <div onClick={props.onCancel} className={cx($p.black50, $p.pointer)}>Cancel</div>
    <Button
      className={cx(
        $p.pa16,
        $p.f16,
        $p.white,
        $p.br2,
        {
          [cx($p.bgBlack10, $p.noEvents)]: !props.isValid,
          [cx($p.bgGreen, $p.pointer)]: props.isValid,
        }
      )}
      onClick={(e: any) => props.isValid && props.onCreate && props.onCreate(e)}
    >
      Create Permission
    </Button>
  </Container>
)
