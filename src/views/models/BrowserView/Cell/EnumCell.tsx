import * as React from 'react'
import {CellProps} from './cells'
import {stringToValue} from '../../../../utils/valueparser'
import { Combobox } from 'react-input-enhancements'
const classes: any = require('./EnumCell.scss')

interface State {
  value: string
}

export default class EnumCell extends React.Component<CellProps<string>, State> {

  private ref: any

  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value ? this.props.value : 'standard value',
    }
  }

  render() {
    return (
      <div
        className={classes.root}
        onBlur={this.props.cancel}
      >
        <Combobox
          ref={ref => this.ref = ref}
          value={this.state.value}
          onBlur={(e: any) => this.props.save(stringToValue(e.target.value, this.props.field))}
          onKeyDown={this.onKeyDown.bind(this)}
          options={this.props.field.enumValues}
          onSelect={(value: string) => {
            this.props.save(stringToValue(value, this.props.field))
          }}
          autosize
          className={classes.root}
        >
          {inputProps => {
            return <input
              {...inputProps}
              type='text'
              placeholder='No Value'
              autoFocus
            />
          }}
        </Combobox>
      </div>
    )
  }

  private onKeyDown = (e: any) => {
    // filter arrow keys
    if ([38,40].includes(e.keyCode)) {
      return
    }

    e.persist()

    // this is needed in order to have the Combobox receive the key
    // event before it pops up to the Cell
    setImmediate(() => {
      this.props.onKeyDown(e)
    })
  }
}
