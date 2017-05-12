import * as React from 'react'
import {Icon, $v} from 'graphcool-styles'
import {Button} from '../../components/Links'

export default class AlreadyAuthenticated extends React.Component<{}, {}> {

  render() {
    return (
      <div className='already-authenticated'>
        <style jsx={true}>{`
          .already-authenticated {
            @p: .flex, .fixed, .top0, .left0, .right0, .bottom0, .w100;
            background-image: radial-gradient(circle at 49% 49%, #172a3a, #0f202d);
          }

          .logo {
            @p: .absolute, .left0, .top0, .pl60, .pt60;
          }

          .content {
            @p: .flex, .flexColumn, .itemsCenter, .justifyCenter, .white, .w100, .mh60;
            width: 530px;
          }

          .title {
            @p: .f38, .fw6, .white, .mb38;
          }

          .subtitle {
            @p: .f20, .white50;
          }

          .close-now {
            @p: .f20, .white50, .fw6;
          }

          .line {
            @p: .o20, .w100, .mv38;
            height: 2px;
            border: solid 2px #ffffff;
          }

          .call-to-action {
            @p: .flex, .flexRow, .itemsCenter, .justifyCenter, .mt25, .bgGreen, .white,
              .ttu, .fw6, .pv10, .ph16, .br2, .pointer;
            max-width: 200px;
          }

          .info {
            @p: .f16, .white60;
          }
        `}</style>
        <div className='logo'>
          <Icon
            color={$v.green}
            width={34}
            height={40}
            src={require('../../assets/icons/logo.svg')}
          />
        </div>
        <div className='content'>
          <div>
            <div className='title'>You're authenticated!</div>
            <div className='subtitle'>
              You're already logged into the Graphcool console. There's nothing more to do for you here.
            </div>
            <div className='close-now'>You can close this window now.</div>
            <div className='line' />
            <div className='info'>If you're stuck somewhere, you'll find all the answers in our Docs.</div>
            <Button
              target='https://www.graph.cool/docs'
              green
              className='mt25'>
              Read the docs
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
