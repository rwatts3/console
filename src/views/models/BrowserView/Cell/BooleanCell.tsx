import * as React from 'react'
import { CellProps } from './cells'
import ToggleButton from '../../../../components/ToggleButton/ToggleButton'
import { ToggleSide } from '../../../../components/ToggleButton/ToggleButton'

export default class BooleanCell extends React.Component<CellProps<boolean>, {}> {
  render() {
    return (
      <ToggleButton
        leftText='true'
        rightText='false'
        active={true}
        side={this.props.value ? ToggleSide.Right : ToggleSide.Left}
        onClickOutside={(side) => this.props.save(side === ToggleSide.Left ? true : false )}
        onKeyDown={this.props.onKeyDown}
      />
    )
  }
}
