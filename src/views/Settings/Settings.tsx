import * as React from 'react'
import * as Relay from 'react-relay'
import {Viewer} from '../../types/types'
import TabBar from './TabBar'

interface Props {
  viewer: Viewer
  params: any
}

class Settings extends React.Component<Props, {}> {

  constructor(props) {
    super(props)
  }

  render() {
    return (

      <div className='topHeader'>
        <style jsx={true}>{`

          .topHeader {
            @inherit: .bgBlack04;
          }

          .topHeaderContent {
            @inherit: .f38, .fw3, .pl25, .pt16, .mb38;
          }

        `}</style>
        <div className='topHeaderContent'>Settings</div>
        <TabBar params={this.props.params} />
        {this.props.children}
      </div>
    )
  }
}

export default Relay.createContainer(Settings, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`

      fragment on Viewer {
        id
        user {
          name
        }
      }
    `,
  },
})
