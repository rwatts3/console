import * as React from 'react' // tslint:disable-line
import * as cx from 'classnames'
import {Field, FieldType} from '../../../../types/types'

interface Props {
  field: Field
  disabled?: boolean
  selected?: boolean
  onClick?: () => void
  className?: string
}

const PermissionField = (props: Props) => {
  const {field, disabled, selected, className, onClick} = props
  const {name} = field
  return (
    <div
      className={cx(
        'permission-tag',
        className,
        {
          disabled,
          selected,
        },
      )}
      onClick={onClick}
    >
      <style jsx>{`
        .permission-tag {
          @p: .br2, .bgBlack04, .black60, .inlineFlex;
          padding: 6px 6px 6px 9px;
        }
        .permission-tag.selected {
          @p: .bgBlue, .white;
        }
        .permission-tag.disabled {
          @p: .o50;
        }
        .name {
          @p: .f16, .fw6;
        }
        .type {
          @p: .code, .f12, .br2, .bgBlack04, .black60, .ml6;
          padding: 4px 5px 3px 5px;
        }
        .permission-tag.selected .type {
          @p: .bgWhite20, .white;
        }
      `}</style>
      <div className='name'>{name}</div>
      <div className='type'>{renderType(field)}</div>
    </div>
  )
}

function renderType(field: Field) {
  const type = field.typeIdentifier + (field.isRequired ? '!' : '')
  return (field.isList ? `[${type}]` : type)
}

export default PermissionField
// $p.ph6, $p.dib, $p.code, $p.br1, {
//   [$p.o50]: disabled,
//   [$p.bgBlack10]: !selected,
//   [$p.black40]: !selected,
//   [$p.bgBlue]: selected,
//   [$p.white]: selected,
// },
//   className,
