import * as React from 'react' // tslint:disable-line
import {$p} from 'graphcool-styles'
import * as cx from 'classnames'
import styled from 'styled-components'

const Container = styled.div`
  height: 103px;
`

export default (props) => (
  <Container className={cx($p.bgGreen)}>
    <div
      className={cx($p.f25, $p.fw4)}
    >
      Permissions for {props.params.modelName}
    </div>
  </Container>
)
