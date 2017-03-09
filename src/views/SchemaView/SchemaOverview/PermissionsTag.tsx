import * as React from 'react'
import {Icon, $v} from 'graphcool-styles'
import {icons} from '../../../utils/permission'

interface Props {
  view: boolean
  add: boolean
  edit: boolean
  remove: boolean
}

export default class PermissionsTag extends React.Component<Props,null> {
  render() {
    const {view, add, edit, remove} = this.props
    return (
      <div className='permissions-tag'>
        <style jsx>{`
          .permissions-tag {
            @p: .bgBlack04, .pa4, .flex, .itemsCenter;
            height: 21px;
            border-radius: 11px;
          }
        `}</style>
        {view && (
          <Icon src={icons['READ']} stroke strokeWidth={3} width={20} height={20} color={$v.gray40} />
        )}
        {add && (
          <Icon
            src={require('graphcool-styles/icons/stroke/addFull.svg')}
            stroke
            strokeWidth={6}
            width={16}
            height={16}
            color={$v.gray40}
          />
        )}
        {edit && (
          <Icon src={icons['UPDATE']} stroke strokeWidth={3} width={20} height={20} color={$v.gray40} />
        )}
        {remove && (
          <Icon src={icons['DELETE']} stroke strokeWidth={3} width={20} height={20} color={$v.gray40} />
        )}
      </div>
    )
  }
}
