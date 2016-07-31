import * as React from 'react'
import * as Relay from 'react-relay'
import { Viewer } from '../../types/types'
import Header from '../../components/Header/Header'
import ActionRow from './ActionRow.tsx'
const classes: any = require('./ActionsView.scss')

interface Props {
  viewer: Viewer & any
  params: any
}

interface State {
  showAddRow: boolean
}

class ActionsView extends React.Component<Props, State> {

  state = {
    showAddRow: false,
  }

  render () {
    return (
      <div className={classes.root}>
        <Header
          viewer={this.props.viewer}
          projectId={this.props.viewer.project.id}
          params={this.props.params}
        >
          <div onClick={() => this.setState({ showAddRow: true })}>+ Add Action</div>
        </Header>
        {this.state.showAddRow &&
          <ActionRow
            action={null}
            project={this.props.viewer.project}
            onSubmit={() => this.setState({ showAddRow: false })}
          />
        }
        {this.props.viewer.project.actions.edges.map((edge) => edge.node).map((action) => (
          <ActionRow
            key={action.id}
            action={action}
            projectId={this.props.viewer.project.id}
          />
        ))}
      </div>
    )
  }
}

export default Relay.createContainer(ActionsView, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        project: projectByName(projectName: $projectName) {
          id
          actions(first: 1000) {
            edges {
              node {
                id
                ${ActionRow.getFragment('action')}
              }
            }
          }
        }
        ${Header.getFragment('viewer')}
      }
    `,
  },
})
