import * as React from 'react'
import {Project} from '../../../types/types'
import {SchemaOverviewFilter} from './SchemaOverview'
import * as Relay from 'react-relay'
import TypeBox from './TypeBox'

interface Props {
  project: Project
  activeFilter: SchemaOverviewFilter
}

class TypeList extends React.Component<Props,null> {
  render() {
    const {activeFilter, project} = this.props
    const models = project.models.edges.map(edge => edge.node)
    return (
      <div className='type-list'>
        <style jsx>{`
          .type-list {
            @p: .pa16;
          }
        `}</style>
        {models.map(model => (
          <TypeBox key={model.id} model={model} projectName={project.name} extended={activeFilter === 'detail'} />
        ))}
      </div>
    )
  }
}

export default Relay.createContainer(TypeList, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        name
        models(first: 100) {
          edges {
            node {
              id
              ${TypeBox.getFragment('model')}
            }
          }
        }
      }
    `,
  },
})
