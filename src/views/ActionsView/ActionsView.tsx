import * as React from 'react'
const mapProps: any = require('map-props')
import * as Relay from 'react-relay'
import { Action, Project } from '../../types/types'
import ActionRow from './ActionRow.tsx'
const classes: any = require('./ActionsView.scss')

interface Props {
  actions: Action[]
  project: Project
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
        <div onClick={() => this.setState({ showAddRow: true })}>+ Add Action</div>
        {this.state.showAddRow &&
          <ActionRow
            action={null}
            project={this.props.project}
            onSubmit={() => this.setState({ showAddRow: false })}
          />
        }
        {this.props.actions.map((action) => (
          <ActionRow
            key={action.id}
            action={action}
            project={this.props.project}
          />
        ))}
      </div>
    )
  }
}

const MappedActionsView = mapProps({
  params: (props) => props.params,
  actions: (props) => props.viewer.project.actions.edges.map(({ node }) => node),
  project: (props) => props.viewer.project,
})(ActionsView)

export default Relay.createContainer(MappedActionsView, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        project: projectByName(projectName: $projectName) {
          actions(first: 1000) {
            edges {
              node {
                id
                ${ActionRow.getFragment('action')}
              }
            }
          }
          ${ActionRow.getFragment('project')}
        }
      }
    `,
  },
})
