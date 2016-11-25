import * as React from 'react' // tslint:disable-line
import * as cx from 'classnames'
import {$p} from 'graphcool-styles'

export default (props) => {
  const {name, disabled, selected, className, onClick} = props
  return (
    <div
      className={cx(
        $p.ph6, $p.dib, $p.code, $p.br1, {
          [$p.o50]: disabled,
          [$p.bgBlack10]: !selected,
          [$p.black40]: !selected,
          [$p.bgBlue]: selected,
          [$p.white]: selected,
        },
        className,
      )}
      onClick={onClick}
    >
      {name}
    </div>
  )
}
