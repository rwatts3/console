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
  selectedModel?: string
}

class TypeList extends React.Component<Props,null> {
  render() {
    const {activeFilter, project, opacity, selectedModel} = this.props
    const models = project.models.edges
      .map(edge => edge.node)
      .sort((a, b) => a.id < b.id ? 1 : -1)
    let style = {}
    if (typeof opacity === 'number' && !isNaN(opacity)) {
      style = {opacity}
    }
    return (
      <div className='type-list-wrapper'>
        <style jsx>{`
          .type-list-wrapper {
            @p: .h100, .flex, .flexColumn, .relative;
            &:after {
              @p: .absolute, .top0, .left0, .right0, .z2;
              content: "";
              height: 16px;
              background: linear-gradient(to bottom, rgba(23, 42, 58, 1), rgba(23, 42, 58, 0));
            }
          }
          .type-list {
            @p: .pl16, .pb16, .pr16, .overflowAuto, .h100;
          }
        `}</style>
        <div
          className='type-list'
          style={style}
        >
          {models.map(model => (
            <TypeBox
              key={model.id}
              model={model}
              projectName={project.name}
              extended={activeFilter === 'detail'}
              onEditModel={this.props.onEditModel}
              highlighted={selectedModel ? model.name === selectedModel : undefined}
            />
          ))}
        </div>
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
              name
              ${TypeBox.getFragment('model')}
            }
          }
        }
      }
    `,
  },
})
