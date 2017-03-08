import * as React from 'react'
import SchemaOverview from './SchemaOverview/SchemaOverview'
import SchemaEditor from './SchemaEditor'
import SchemaHeader from './SchemaHeader'
import * as Relay from 'react-relay'
import {Project, Viewer} from '../../types/types'

interface Props {
  viewer: Viewer
}

class NewSchemaView extends React.Component<Props,null> {
  render() {
    const {viewer} = this.props
    return (
      <div className='schema-view'>
        <style jsx>{`
          .schema-view {
          }
          .schema-wrapper {
            @p: .flex;
          }
        `}</style>
        <SchemaHeader />
        <div className='schema-wrapper'>
          <SchemaEditor project={viewer.project} />
          <SchemaOverview />
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(NewSchemaView, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
        project: projectByName(projectName: $projectName) {
          ${SchemaEditor.getFragment('project')}
        }
      }
    `,
  },
})
