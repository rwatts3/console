import * as React from 'react'
const classes: any = require('./Cell.scss')
import * as cx from 'classnames'
import {particles} from 'graphcool-styles'
import {valueToString} from '../../../utils/valueparser'
import {Field} from '../../../types/types'

interface Props {
  onClick: () => void
  onDoubleClick: () => void
  value: string
  field: Field
  rowSelected?: boolean
  rowHasCursor?: boolean
}
export class LightCell extends React.PureComponent<Props, {}> {
  render() {
    const {onClick, onDoubleClick, value, field, rowSelected, rowHasCursor} = this.props
    const valueString = valueToString(value, field, true)

    return (
      <div
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        className={cx(
          classes.root,
          particles.contentCenter,
          particles.overflowVisible,
          particles.flexAuto,
          {
            [particles.bgWhite]: (!rowHasCursor && !rowSelected),
            [particles.bgBlue]: rowSelected,
            [particles.white]: rowSelected,
          }
        )}
      >
        <div className={cx(classes.border, particles.flexAuto)}>
          <div className={classes.value}>
            {valueString}
          </div>
        </div>
      </div>
    )
  }
}
