import * as React from 'react'
import {Project, Model} from '../../../types/types'
import {SchemaOverviewFilter} from './SchemaOverview'
import * as Relay from 'react-relay'
import TypeBox from './TypeBox'

interface Props {
  project: Project
  activeFilter: SchemaOverviewFilter
  opacity?: number
  onEditModel: (model: Model) => void
}

class TypeList extends React.Component<Props,null> {
  render() {
    const {activeFilter, project, opacity} = this.props
    const models = project.models.edges
      .map(edge => edge.node)
      .sort((a, b) => a.id < b.id ? 1 : -1)
    let style = {}
    if (typeof opacity === 'number' && !isNaN(opacity)) {
      style = {opacity}
    }
    return (
      <div
        className='type-list'
        style={style}
      >
        <style jsx>{`
          .type-list {
            @p: .pa16;
          }
        `}</style>
        {models.map(model => (
          <TypeBox
            key={model.id}
            model={model}
            projectName={project.name}
            extended={activeFilter === 'detail'}
            onEditModel={this.props.onEditModel}
          />
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
