import * as React from 'react'
import { CellProps } from './cells'
import { stringToValue } from '../../../../utils/valueparser'
import { Combobox } from 'react-input-enhancements'
const classes: any = require('./EnumCell.scss')
import ClickOutside from 'react-click-outside'

interface State {
  value: string
}

export default class EnumCell extends React.Component<
  CellProps<string>,
  State
> {
  private ref: any

  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value })
    }
  }

  render() {
    const selectedEnum = this.props.enums.find(
      en => this.props.field.enum.id === en.id,
    )
    const enumValues = selectedEnum ? selectedEnum.values : []
    return (
      <ClickOutside onClickOutside={this.props.cancel}>
        <div className={classes.root}>
          <Combobox
            ref={this.setRef}
            value={this.state.value}
            onKeyDown={this.handleKeyDown}
            onSelect={this.handleSelect}
            options={enumValues}
            autocomplete
            autosize
            className={classes.root}
          >
            {inputProps => {
              return (
                <input
                  {...inputProps}
                  type="text"
                  placeholder="No Value"
                  autoFocus
                />
              )
            }}
          </Combobox>
        </div>
      </ClickOutside>
    )
  }

  private setRef = ref => {
    this.ref = ref
  }

  private handleSelect = (value: string) => {
    this.setState({ value }, () => {
      this.props.save(stringToValue(value, this.props.field))
    })
  }

  private handleKeyDown = (e: any) => {
    // filter arrow keys
    if ([38, 40].includes(e.keyCode)) {
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
