import * as React from 'react'
import {Field} from '../../../types/types'
import TypeTag from './TypeTag'
import {Link} from 'react-router'
import PermissionsTag from './PermissionsTag'

interface Props {
  projectName: string
  field: Field
}

export default class FieldItem extends React.Component<Props, null> {
  render() {
    const {field} = this.props
    return (
      <Link to={`/`}>
        <div className='field-item'>
          <style jsx>{`
            .field-item {
              @p: .pa16, .flex, .justifyBetween, .nowrap, .bt, .bBlack10;
            }
            .name {
              @p: .fw6, .black60;
            }
            .flexy {
              @p: .flex, .itemsCenter;
            }
            .unique {
              @p: .br2, .ba, .bBlack30, .black30, .f10, .fw7, .ttu, .mr10;
              padding: 3px 4px 4px 6px;
            }
          `}</style>
          <div className='flexy'>
            <span className='name'>
              {field.name}
            </span>
            <TypeTag field={field} />
          </div>
          <div className='flexy'>
            <div>
              {field.isUnique && (
                <div className='unique'>Unique</div>
              )}
            </div>
            <PermissionsTag
              view={true}
              add={true}
              edit={true}
              remove={true}
            />
          </div>
        </div>
      </Link>
    )
  }
}
