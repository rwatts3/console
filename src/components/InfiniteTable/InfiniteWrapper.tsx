import * as React from 'react'
import * as Relay from 'react-relay'
import InfiniteTable from './InfiniteTable'
import 'react-virtualized/styles.css'

interface Props {
  viewer: any
}

class InfiniteWrapper extends React.Component<Props ,{}> {
  render() {
    return (
      <div style={{height: '100vh'}}>
        <InfiniteTable model={this.props.viewer.model}/>
      </div>
     )
   }
}

export default Relay.createContainer(InfiniteWrapper, {
  initialVariables: {
    modelName: null, // injected from router
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        model: modelByName(projectName: $projectName, modelName: $modelName) {
          name
          namePlural
          itemCount
          fields(first: 1000) {
            edges {
              node {
                id
                name
                typeIdentifier
                isList
              }
            }
          }
        }
        project: projectByName(projectName: $projectName) {
          id
        }
      }
    `,
  },
})
