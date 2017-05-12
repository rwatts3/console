import * as React from 'react'
import {Icon, $v} from 'graphcool-styles'
import {ProjectType} from './ExampleProject'
import {Button} from '../../../components/Links'

interface Props {
  className?: string
  projectType: ProjectType
}

const quickstartLogos = [
  require('graphcool-styles/icons/fill/reactLogoCentered.svg'),
  require('graphcool-styles/icons/fill/angularLogoCentered.svg'),
  require('graphcool-styles/icons/fill/vueLogoCentered.svg'),
  require('graphcool-styles/icons/fill/iOSLogoCentered.svg'),
  require('graphcool-styles/icons/fill/androidLogoCentered.svg'),
]

export default class ExampleProjectLeft extends React.Component<Props, {}> {

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
              @p: .flex, .justifyCenter, .white, .w100, .h100, .mv60;
            }

            .subtitle {
              @p: .f20, .white50, .mt20;
              width: 420px;
            }

            .subtitle-blank {
              @p: .f20, .white50, .mt20;
              width: 520px;
            }

            a {
              @p: .blue, .noUnderline;
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
            <div className='title'>{this._title()}</div>
            <div className={`${this.props.projectType === 'instagram' ? 'subtitle' : 'subtitle-blank'} mt96`}>
              {this._subtitle()} You can also edit all aspects of it
              using our <a href='https://console.graph.cool'>console</a>.
            </div>
            <iframe
              className='mv38'
              width='560'
              height='315'
              src='https://www.youtube.com/embed/SooujCyMHe4'
              frameBorder='0'
              allowFullScreen
            />
            <div className='line'/>
            {this._info()}
            {this._callToAction()}
          </div>
        </div>
      </div>
    )
  }

  _subtitle = (): string => {
    switch (this.props.projectType) {
      case 'instagram': return '...in your terminal. '
      case 'blank': return '...in your terminal. So now you can start building your frontend around it.'
    }
  }

  _title = (): string => {
    switch (this.props.projectType) {
      case 'instagram': return 'Your first project is waiting'
      case 'blank': return 'A new blank project is ready'
    }
  }

  _info = (): JSX.Element => {
    switch (this.props.projectType) {
      case 'instagram': return (
        <div className='info'>
          <style jsx={true}>{`
            .info {
              @p: .f16, .white60;
              max-width: 530px;
            }
          `}</style>
          Copy the endpoint from your terminal, get started with one of your frontend / mobile quickstart tutorials.
        </div>
      )
      case 'blank': return (
        <div className='info'>
          <style jsx={true}>{`
            .info {
              @p: .f16, .white60;
              max-width: 530px;
            }

            a {
              @p: .blue, .noUnderline;
            }
          `}</style>
          If you don't know where to start, check out our <a href=''>Quickstart</a>. In all other cases, you'll find
          all information you need in our documentation.
        </div>
      )
    }
  }

  _callToAction = (): JSX.Element => {
    switch (this.props.projectType) {
      case 'instagram': return (
        <div className='quickstart-logos'>
          <style jsx={true}>{`

            .quickstart-logos {
              @p: .flex, .flexRow, .itemsCenter, .mt38;
            }

            .quickstart-logo {
              @p: .mr25;
            }

            .call-to-action {
              @p: .flex, .flexRow, .itemsCenter, .bgGreen, .white, .ttu, .fw6, .pv10, .ph16, .br2, .pointer;
            }
          `}</style>
          {quickstartLogos.map(logo => (
            <div
              className='quickstart-logo'
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
          <Button green>Frontend Quickstart</Button>
        </div>
      )
      case 'blank': return (
        <Button green className='mt25'>Read the docs</Button>
      )
    }
  }

}
