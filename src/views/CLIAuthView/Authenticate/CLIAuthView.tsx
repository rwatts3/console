import * as React from 'react'
import {Icon, $v} from 'graphcool-styles'
import AuthenticateLeft from './AuthenticateLeft'
import AuthenticateRight from './AuthenticateRight'
import {ProjectType} from '../ExampleProject/ExampleProject'

interface Props {
  location: any
}

export default class CLIAuthView extends React.Component<Props, {}> {

  render () {
    // const schema = this.props.location.query.schema || ''
    const projectType = this.props.location.query.projectType
    return (
      <div className='cli-auth-view'>
        <style jsx={true}>{`

          .cli-auth-view {
            @p: .w100, .fixed, .top0, .left0, .right0, .bottom0, .flex, .itemsCenter, .justifyCenter, .white;
            background-image: radial-gradient(circle at 49% 49%, #172a3a, #0f202d);
          }

          .logo {
            @p: .absolute, .left0, .top0, .pl60, .pt60;
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
        <AuthenticateLeft className='mr60' />
        <AuthenticateRight projectType={projectType} className='ml60' />
      </div>
    )
  }
}
