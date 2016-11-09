import * as React from 'react'
import {$p} from 'graphcool-styles'
import styled from 'styled-components'
import PermissionsHeaderTitle from './PermissionsHeaderTitle'

export default class PermissionsHeader extends React.Component<{}, {}> {
  render() {
    const Container = styled.div`
      // height: 184px; go back to this when we add the rest from the sketch design to the header
      height: 100px;
    `
    return (
      <Container className={$p.pa25}>
        <PermissionsHeaderTitle />
      </Container>
    )
  }
}
