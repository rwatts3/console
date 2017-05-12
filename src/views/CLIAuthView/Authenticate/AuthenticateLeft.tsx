import * as React from 'react'
import {A} from '../../../components/Links'

interface Props {
  className?: string
}

export default class AuthenticateLeft extends React.Component<Props, {}> {

  render() {
    return (
      <div
        className={`${this.props.className}`}
      >
        <style jsx={true}>{`

          .graphcool-cli-says {
            @p: .white50, .mono, .ml20;
            font-size: 16px;
            font-weight: 500;
          }

          .title {
            @p: .f38, .fw6, .white, .mt38;
          }

          .subtitle {
            @p: .f20, .white50, .mt38;
            width: 540px;
          }

          .call-to-action {
            @p: .blue, .ttu, .f14, .fw6, .pointer, .mt25;
          }

        `}</style>
        <div className='flex itemsCenter'>
          <img src={require('../../../assets/graphics/terminal.svg')}/>
          <div className='graphcool-cli-says'>graphcool-cli says...</div>
        </div>
        <div className='title'>You need to authenticate first.</div>
        <div className='subtitle'>
          We will create an account for you that handles your first project, and hopefully many more to come.
        </div>
        <A className='mt38' target=''>Learn more on our website</A>
      </div>
    )
  }
}

