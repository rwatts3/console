import * as React from 'react'
import {Icon, $v} from 'graphcool-styles'
import {icons} from '../../../utils/permission'
import {PermissionMap} from './FieldItem'

interface Props {
  permissions: PermissionMap
}

export default class PermissionsTag extends React.Component<Props,null> {
  render() {
    const {permissions: {CREATE, READ, UPDATE, DELETE}} = this.props
    return (
      <div className='permissions-tag'>
        <style jsx>{`
          .permissions-tag {
            @p: .bgBlack04, .pa4, .flex, .itemsCenter;
            height: 21px;
            border-radius: 11px;
          }
        `}</style>
        {(!READ && !CREATE && !UPDATE && !DELETE) && (
          <Icon
            src={require('graphcool-styles/icons/fill/permissions.svg')}
            width={14}
            height={14}
            color={$v.gray40}
          />
        )}
        {READ && (
          <Icon src={icons['READ']} stroke strokeWidth={3} width={20} height={20} color={$v.gray40} />
        )}
        {CREATE && (
          <Icon
            src={require('graphcool-styles/icons/stroke/addFull.svg')}
            stroke
            strokeWidth={6}
            width={16}
            height={16}
            color={$v.gray40}
          />
        )}
        {UPDATE && (
          <Icon src={icons['UPDATE']} stroke strokeWidth={3} width={20} height={20} color={$v.gray40} />
        )}
        {DELETE && (
          <Icon src={icons['DELETE']} stroke strokeWidth={3} width={20} height={20} color={$v.gray40} />
        )}
      </div>
    )
  }
}
