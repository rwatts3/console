import * as React from 'react'
import {Icon, $v} from 'graphcool-styles'

interface State {

}

interface Props {
  className?: string
}

export default class AuthenticateLeft extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div
        className={this.props.className}
      >
        <style jsx={true}>{`
          .authenticate-left {

          }

          .graphcool-cli-says {
            @p: .white50, .mono;
            font-size: 16px;
            font-weight: 500;
          }

          .title {
            @p: .f38, .fw6, .white;
          }

          .subtitle {
            @p: .f20, .white50;
          }

          .call-to-action {
            @p: .blue, .ttu, .f14, .fw6, .pointer;
          }

        `}</style>
        <div className='graphcool-cli-says'>graphcool-cli says...</div>
        <div className='title'>You need to authenticate first.</div>
        <div className='subtitle'>
          We will create an account for you that handles your first project, and hopefullu many more to come.
        </div>
        <div className='flex itemsCenter'>
          <div className='call-to-action hover'>Learn more on our website</div>
          <Icon
            className='ml10'
            src={require('graphcool-styles/icons/fill/fullArrowRight.svg')}
            width={14}
            height={11}
            color={$v.blue}
          />
        </div>
      </div>
    )
  }
}
