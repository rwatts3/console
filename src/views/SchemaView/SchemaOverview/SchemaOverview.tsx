import * as React from 'react'
import SchemaOverviewHeader from './SchemaOverviewHeader'
import TypeList from './TypeList'
import * as Relay from 'react-relay'
import {Project} from '../../../types/types'
import AddType from './AddType'

interface Props {
  project: Project
}
export type SchemaOverviewFilter = 'detail' | 'overview'

interface State {
  activeFilter: SchemaOverviewFilter
  addingType: boolean
}

class SchemaOverview extends React.Component<Props,State> {
  constructor(props) {
    super(props)

    this.state = {
      activeFilter: 'detail',
      addingType: true,
    }
  }
  render() {
    const {activeFilter, addingType} = this.state
    return (
      <div className='schema-overview'>
        <style jsx={true}>{`
          .schema-overview {
            @p: .flex1, .bgDarkBlue, .overflowAuto;
            height: calc(100vh - 51px);
          }
        `}</style>
        {addingType ? (
          <AddType
            onRequestClose={this.closeAddType}
            projectId={this.props.project.id}
          />
        ) : (
          <SchemaOverviewHeader
            activeFilter={activeFilter}
            onChangeFilter={this.handleFilterChange}
            projectId={this.props.project.id}
            onOpenAddType={this.openAddType}
          />
        )}
        <TypeList
          activeFilter={activeFilter}
          project={this.props.project}
          opacity={addingType ? 0.5 : 1}
        />
      </div>
    )
  }
  private handleFilterChange = (filter: SchemaOverviewFilter) => {
    this.setState({activeFilter: filter} as State)
  }
  private closeAddType = () => {
    this.setState({addingType: false} as State)
  }
  private openAddType = () => {
    this.setState({addingType: true} as State)
  }
}

export default Relay.createContainer(SchemaOverview, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id
        ${TypeList.getFragment('project')}
      }
    `,
  },
})
