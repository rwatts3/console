import * as React from 'react'
const classes: any = require('./Cell.scss')
import * as cx from 'classnames'
import {$p} from 'graphcool-styles'
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
          $p.contentCenter,
          $p.overflowVisible,
          $p.flexAuto,
          {
            [$p.bgWhite]: (!rowHasCursor && !rowSelected),
            [$p.bgBlue]: rowSelected,
            [$p.white]: rowSelected,
          }
        )}
      >
        <div className={cx(classes.border, $p.flexAuto)}>
          <div className={classes.value}>
            {valueString}
          </div>
        </div>
      </div>
    )
  }
}
