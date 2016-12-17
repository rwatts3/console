import * as React from 'react'
import styled from 'styled-components'
import * as cx from 'classnames'
import {$p} from 'graphcool-styles'

const Container = styled.div`
  margin: 12px;
`

const IntegrationsHeader = () => {
  return (
    <Container>
      <h1 className={cx($p.f38)}>Integrations</h1>
      <h2 className={cx($p.f16, $p.black40)}>Integrate everything you need</h2>
    </Container>
  )
}

export default IntegrationsHeader
