import * as React from 'react'
import mapProps from '../../../components/MapProps/MapProps'
import * as Relay from 'react-relay'
import * as Modal from 'react-modal'
import modalStyle from '../../../utils/modalStyle'
import {Log, ServerlessFunction} from '../../../types/types'
import {withRouter} from 'react-router'

interface Props {
  logs: Log[]
  node: ServerlessFunction
  router: ReactRouter.InjectedRouter
}

interface State {

}

class FunctionLogsComponent extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    console.log(this.props)
    const {logs, node} = this.props
    return (
      <Modal
        contentLabel='Function Logs'
        style={modalStyle}
        isOpen
        onRequestClose={this.close}
      >
        <style jsx={true}>{`
          .function-logs {
            @p: .pa25;
          }
          .logs {
          }
          .log {
            @p: .mt25, .br2, .bgLightOrange, .pa16;
          }
      `}</style>
        <div className='function-logs'>
          <h1>Function Logs for {node.name}</h1>
          <div className='logs'>
            {logs.map(log => (
              <div className='log' key={log.id}>
                <div><b>requestId</b>: {log.requestId}</div>
                <div><b>status</b>: {log.status}</div>
                <div><b>duration</b>: {log.duration}</div>
                <div><b>timestamp</b>: {log.timestamp}</div>
                <div><b>message</b>: {log.message}</div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    )
  }

  private close = () => {
    this.props.router.goBack()
  }
}

const MappedFunctionLogs = mapProps({
  project: props => props.viewer.project,
  logs: props => props.node.logs.edges.map(edge => edge.node),
})(withRouter(FunctionLogsComponent))

export const FunctionLogs = Relay.createContainer(MappedFunctionLogs, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
        project: projectByName(projectName: $projectName) {
          id
          name
        }
        user {
          crm {
            information {
              isBeta
            }
          }
        }
      }
    `,
    node: () => Relay.QL`
      fragment on Node {
        id
        ... on Function {
          name
          logs(last: 500) {
            edges {
              node {
                id
                duration
                message
                requestId
                timestamp
                status
              }
            }
          }
        }
      }
    `,
  },
})
