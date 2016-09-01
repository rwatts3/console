import * as React from 'react'
const classes: any = require('./CheckboxCell.scss')

interface Props {
  onChange: (checked: boolean) => void
  checked: boolean
  height: number
  disabled?: boolean
}

export default class CheckboxCell extends React.Component<Props, {}> {

  _toggle () {
    this.props.onChange(!this.props.checked)
  }

  render () {
    return (
      <div className={classes.root} style={{height: this.props.height}} onClick={() => this._toggle()}>
        <input disabled={this.props.disabled} type='checkbox' checked={this.props.checked} />
      </div>
    )
  }
}
