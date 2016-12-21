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
    {props.isEditing ? (
      <div onClick={props.onDelete} className={cx($p.red, $p.pointer)}>Delete</div>
    ) : (
      <div></div>
    )}
    <div className={cx($p.flex, $p.flexRow, $p.itemsCenter)}>
      <div onClick={props.onCancel} className={cx($p.black50, $p.pointer)}>Cancel</div>
      <Button
        className={cx(
          $p.ml25,
          $p.pa16,
          $p.f16,
          $p.white,
          $p.br2,
          {
            [cx($p.bgBlack10, $p.noEvents)]: !props.isValid,
            [cx($p.bgGreen, $p.pointer)]: props.isValid,
          },
        )}
        onClick={(e: any) => {
          if (!props.isValid) {
            return
          }

          if (props.editing) {
            props.onUpdate(e)
          } else {
            props.onCreate(e)
          }
        }}
      >
        {props.editing ? (
          'Update'
        ) : (
          'Create'
        )}
      </Button>
    </div>
  </Container>
)
