import * as React from 'react'
import { Icon, $v } from 'graphcool-styles'
import { Button } from '../../components/Links'
import { redirectURL, updateAuth } from '../../utils/auth'

interface Props {
  location: any
  router: any
}

export default class CLIAuthorizeView extends React.Component<Props, {}> {
  render() {
    return (
      <div className="already-authenticated">
        <style jsx={true}>{`
          .already-authenticated {
            @p: .flex, .fixed, .top0, .left0, .right0, .bottom0, .w100;
            background-image: radial-gradient(
              circle at 49% 49%,
              #172a3a,
              #0f202d
            );
          }

          .logo {
            @p: .absolute, .left0, .top0, .pl60, .pt60;
          }

          .content {
            @p: .flex, .flexColumn, .itemsCenter, .justifyCenter, .white, .w100,
              .mh60;
            width: 530px;
          }

          .title {
            @p: .f38, .fw6, .white;
          }

          .subtitle {
            @p: .f20, .white50, .mt20;
          }

          .line {
            @p: .o20, .w100, .mv38;
            height: 0px;
            border: solid 1px #ffffff;
          }

          .call-to-action {
            @p: .flex, .flexRow, .itemsCenter, .justifyCenter, .mt25, .bgGreen,
              .white, .ttu, .fw6, .pv10, .ph16, .br2, .pointer;
            max-width: 200px;
          }

          h2 {
            @p: .white80, .f20, .mt38, .mb10, .fw6;
          }

          .permissions {
            @p: .pa16, .bWhite10, .ba, .br2, .f16, .white60, .inlineFlex,
              .itemsCenter;
          }
        `}</style>
        <div className="logo">
          <Icon
            color={$v.green}
            width={34}
            height={40}
            src={require('../../assets/icons/logo.svg')}
          />
        </div>
        <div className="content">
          <div>
            <div className="title">Authorize Graphcool CLI</div>
            <div className="subtitle">
              The Graphcool CLI would like permission to access your account
              locally.
            </div>
            <h2>Review permissions</h2>
            <div className="permissions">
              <Icon
                src={require('assets/icons/schema.svg')}
                color={$v.white60}
                width={18}
                height={18}
              />
              <span className="ml10">
                Read &amp; Write Project Data &amp; Schema
              </span>
            </div>
            <div>
              <Button
                green
                className="mt38"
                hideArrow={true}
                onClick={this.authorize}
              >
                Authorize CLI
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  private authorize = () => {
    const { location, router } = this.props
    const { authTrigger, cliToken } = location.query
    updateAuth(cliToken).then(() => {
      const redirect = redirectURL(authTrigger)
      if (redirect.startsWith('http')) {
        window.location.href = redirect
      } else {
        router.replace(redirect)
      }
    })
  }
}
