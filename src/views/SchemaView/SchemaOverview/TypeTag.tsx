import * as React from 'react'
import {Field} from '../../../types/types'
import {isScalar} from '../../../utils/graphql'
import {Icon, $v} from 'graphcool-styles'

interface Props {
  field: Field
}

export default class TypeTag extends React.Component<Props, null> {
  render() {
    const {field} = this.props

    let type: string = field.typeIdentifier
    if (field.isList) {
      type = `[${type}]`
    }
    if (field.isRequired) {
      type = `${type}!`
    }
    return (
      <div className='wrapper'>
        <style jsx>{`
          .wrapper {
            @p: .flex, .itemsCenter;
          }
          .type-tag {
            @p: .bgBlack04, .br2, .black50, .dib, .ml16, .f12, .flex, .itemsCenter;
            font-family:
                    'Source Code Pro',
                    'Consolas',
                    'Inconsolata',
                    'Droid Sans Mono',
                    'Monaco',
                    monospace;
            padding: 3px 6px 4px 6px;
            :global(i) {
              @p: .mr4;
            }
          }
          .type-tag + .type-tag {
            @p: .ml10;
          }
        `}</style>
        {field.isSystem && (
          <div className='type-tag'>SYSTEM</div>
        )}
        <div className='type-tag'>
          {!isScalar(field.typeIdentifier) && (
            <Icon
              width={14}
              height={14}
              src={require('assets/icons/link.svg')}
              stroke
              color={$v.gray60}
            />
          )}
          <span>
            {isScalar(field.typeIdentifier) ? (
              type
            ) : (
              field.relatedModel.name
            )}
          </span>
        </div>
      </div>
    )
  }
}
