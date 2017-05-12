import * as React from 'react'
import {Icon, $v} from 'graphcool-styles'
import AuthenticateLeft from './AuthenticateLeft'
import AuthenticateRight from './AuthenticateRight'

interface Props {
}

interface State {
}

export default class CLIAuthView extends React.Component<Props, State> {

  render () {
    return (
      <div className='cli-auth-view'>
        <style jsx={true}>{`

          .cli-auth-view {
            @p: .w100, .h100;
            background-image: radial-gradient(circle at 49% 49%, #172a3a, #0f202d);
          }

          .logo {
            @p: .pl60, .pt60;
          }

          .content {
            @p: .flex, .itemsCenter, .justifyCenter, .white, .mt96, .w100, .h100;
          }
        `}</style>
        <div className='logo'>
          <Icon
            color={$v.green}
            width={34}
            height={40}
            src={require('../../../assets/icons/logo.svg')}
          />
        </div>
        <div className='content'>
          <AuthenticateLeft
            className=''
          />
          <AuthenticateRight/>
        </div>
      </div>
    )
  }
}
