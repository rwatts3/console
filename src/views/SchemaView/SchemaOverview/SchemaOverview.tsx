import * as React from 'react'
import SchemaOverviewHeader from './SchemaOverviewHeader'

interface Props {

}
export type SchemaOverviewFilter = 'detail' | 'overview'

interface State {
  activeFilter: SchemaOverviewFilter
}

export default class SchemaOverview extends React.Component<Props,State> {
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
            @p: .flex1, .bgDarkBlue;
            height: calc(100vh - 57px);
          }
        `}</style>
        <SchemaOverviewHeader
          activeFilter={activeFilter}
          onChangeFilter={this.handleFilterChange}
        />
      </div>
    )
  }
  handleFilterChange = (filter: SchemaOverviewFilter) => {
    this.setState({activeFilter: filter})
  }
}
