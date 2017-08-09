import * as React from 'react'
import * as cn from 'classnames'

interface Props {
  onChange: (checked: boolean) => void
  checked: boolean
  height: number
  disabled?: boolean
  [key: string]: any
}

export default class CheckboxCell extends React.Component<Props, {}> {
  _toggle() {
    this.props.onChange(!this.props.checked)
  }

  render() {
    const { height, checked, onChange, ...rest } = this.props
    return (
      <div
        className="checkbox-cell"
        style={{
          height,
        }}
        onClick={() => this._toggle()}
        {...rest}
      >
        <style jsx={true}>{`
          .checkbox-cell {
            @p: .flex, .itemsCenter, .justifyCenter, .pointer;
          }
          .border {
            @p: .ba, .br100, .bBlack20, .flex, .itemsCenter, .justifyCenter;
            width: 16px;
            height: 16px;
            transition: $duration border-color;
          }
          .dot {
            @p: .ba, .bBlue, .br100, .bgBlue, .o0;
            height: 16px;
            width: 16px;
            transition: $duration opacity;
          }
          .checkbox-cell:hover .border,
          .border.active {
            @p: .bBlue;
          }
          .checkbox-cell:hover .dot,
          .active .dot {
            @p: .o100;
          }
        `}</style>
        <div
          className={cn('border', {
            active: checked,
          })}
        >
          <div className="dot" />
        </div>
      </div>
    )
  }
}
