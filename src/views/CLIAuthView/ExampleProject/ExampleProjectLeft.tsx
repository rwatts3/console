import * as React from 'react'
import {Icon, $v} from 'graphcool-styles'

interface State {

}

interface Props {
  className?: string
}

const quickstartLogos = [
  require('graphcool-styles/icons/fill/reactLogoCentered.svg'),
  require('graphcool-styles/icons/fill/angularLogoCentered.svg'),
  require('graphcool-styles/icons/fill/vueLogoCentered.svg'),
  require('graphcool-styles/icons/fill/iOSLogoCentered.svg'),
  require('graphcool-styles/icons/fill/androidLogoCentered.svg'),
]

export default class ExampleProjectLeft extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div className='example-project-left'>
        <style jsx={true}>{`

            .example-project-left {
              @p: .w100, .h100;
              background-image: radial-gradient(circle at 49% 49%, #172a3a, #0f202d);
            }

            .logo {
              @p: .pl60, .pt60;
            }

            .title {
              @p: .f38, .fw6, .white;
            }

            .content {
              @p: .flex, .itemsCenter, .justifyCenter, .white, .w100, .h100;
            }

            .subtitle {
              @p: .f20, .white50, .mt20;
              width: 420px;
            }

            a {
              @p: .blue, .noUnderline;
            }

            .info {
              @p: .f16, .white60;
              max-width: 530px;
            }

            .quickstartLogos {
              @p: .flex, .flexRow, .itemsCenter, .mt38;
            }

            .quickstartLogo {
              @p: .mr25;
            }

            .call-to-action {
              @p: .flex, .flexRow, .itemsCenter, .bgGreen, .white, .ttu, .fw6, .pv10, .ph16, .br2;
            }

            .line {
              @p: .o20, .w100, .mb38;
              height: 2px;
              border: solid 2px #ffffff;
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
          <div>
            <div className='title'>Your first project is waiting.</div>
            <div className='subtitle mt96'>
              ...in your terminal. You can also edit all aspects of it
              using our <a href='https://console.graph.cool'>console</a>.
            </div>
            <iframe
              className='mv38'
              width='560'
              height='315'
              src='https://www.youtube.com/embed/SooujCyMHe4'
              frameBorder='0'
              allowfullscreen
            />
            <div className='line'/>
            <div className='info'>
              Copy the endpoint from your terminal, get started with one of your frontend / mobile quickstart tutorials.
            </div>
            <div className='quickstartLogos'>
              {quickstartLogos.map(logo => (
                <div
                  className='quickstartLogo'
                >
                <Icon
                  key={logo}
                  src={logo}
                  width={30}
                  height={30}
                  color={$v.white50}
                />
                </div>
              ))}
              <div className='call-to-action'>
                <div>Frontend Quickstart</div>
                <Icon
                  className='ml10'
                  src={require('graphcool-styles/icons/fill/fullArrowRight.svg')}
                  color={$v.white}
                  width={14}
                  height={11}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
