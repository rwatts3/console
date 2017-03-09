import * as React from 'react'
import SchemaOverviewHeader from './SchemaOverviewHeader'
import TypeList from './TypeList'
import * as Relay from 'react-relay'
import {Project} from '../../../types/types'

interface Props {
  project: Project
}
export type SchemaOverviewFilter = 'detail' | 'overview'

interface State {
  activeFilter: SchemaOverviewFilter
}

class SchemaOverview extends React.Component<Props,State> {
  constructor(props) {
    super(props)

    this.state = {
      activeFilter: 'detail',
    }
  }
  render() {
    const {activeFilter} = this.state
    return (
      <div className='schema-overview'>
        <style jsx={true}>{`
          .schema-overview {
            @p: .flex1, .bgDarkBlue, .overflowAuto;
            height: calc(100vh - 51px);
          }
        `}</style>
        <SchemaOverviewHeader
          activeFilter={activeFilter}
          onChangeFilter={this.handleFilterChange}
          projectId={this.props.project.id}
        />
        <TypeList
          activeFilter={activeFilter}
          project={this.props.project}
        />
      </div>
    )
  }
  handleFilterChange = (filter: SchemaOverviewFilter) => {
    this.setState({activeFilter: filter})
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
