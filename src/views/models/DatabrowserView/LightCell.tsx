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
}
export class LightCell extends React.PureComponent<Props, {}> {
  render() {
    const {onClick, onDoubleClick, value, field} = this.props
    const valueString = valueToString(value, field, true)

    return (
      <div
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        className={cx(
          classes.root,
          particles.justifyCenter,
          particles.contentCenter,
          particles.overflowVisible,
        )}
      >
        <div className={classes.border}>
          <div className={classes.value}>
            {valueString}
          </div>
        </div>
      </div>
    )
  }
}
