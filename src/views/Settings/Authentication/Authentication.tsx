import * as React from 'react'
import {PermanentAuthToken} from '../../../types/types'

interface State {
  newTokenName: string
}

interface Props {
  authTokens: PermanentAuthToken[]
}

export default class Authentication extends React.Component<Props, State> {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <style jsx={true}>{`
          .headerTitle {
            @inherit: .black30, .f14, .fw6, .ttu;
          }

          .headerDescription {
            @inherit: .black50, .f16;
          }
        `}</style>
        <div className='headerTitle'>Permanent Auth Tokens</div>
        <div className='headerDescription'>You can use Permanent Access Tokens to grant access to authenticated
        actions as an alternative way to creating an authenticated user.</div>
      </div>
    )
  }
}
