import * as React from 'react'
import Left from './Left'
import Right from './Right'
import * as cookiestore from 'cookiestore'

interface Props {
  location: any
}

export default class CLIAuthSuccessInitView extends React.Component<Props, {}> {

  async componentWillMount() {
    const {cliToken} = this.props.location.query

    await fetch(`${__CLI_AUTH_TOKEN_ENDPOINT__}/update`, {
      method: 'POST',
      body: JSON.stringify({
        authToken: cookiestore.get('graphcool_auth_token'),
        cliToken,
      }),
    })
  }

  render() {
    const {projectType} = this.props.location.query

    return (
      <div className='example-project'>
        <style jsx={true}>{`
            .example-project {
              @p: .w100, .h100, .flex, .fixed, .top0, .left0, .right0, .bottom0;
            }
        `}</style>
        <Left
          projectType={projectType}
        />
        <Right
          projectType={projectType}
        />
      </div>
    )
  }
}
