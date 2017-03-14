import * as React from 'react'
import SchemaOverviewHeader from './SchemaOverviewHeader'
import TypeList from './TypeList'
import * as Relay from 'react-relay'
import {Project, Model} from '../../../types/types'
import AddType from './AddType'
import Tether from '../../../components/Tether/Tether'

interface Props {
  project: Project
}
export type SchemaOverviewFilter = 'detail' | 'overview'

interface State {
  activeFilter: SchemaOverviewFilter
  addingType: boolean
  editingModel?: Model
}

class SchemaOverview extends React.Component<Props,State> {
  constructor(props) {
    super(props)

    this.state = {
      activeFilter: 'detail',
      addingType: false,
      editingModel: undefined,
    }
  }
  render() {
    const {activeFilter, addingType, editingModel} = this.state
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
              model={editingModel}
            />
          ) : (
            <Tether
              style={{
                pointerEvents: 'none',
              }}
              steps={[{
                step: 'STEP1_CREATE_POST_MODEL',
                title: `Create a Model called "Post"`,
                description: 'Models represent a certain type of data. To manage our Instagram posts, the "Post" model will have an image URL and a description.', // tslint:disable-line
              }]}
              offsetX={14}
              offsetY={-22}
              width={351}
              horizontal='left'
              key='STEP3_CLICK_ADD_NODE2'
              zIndex={1000}
            >
              <SchemaOverviewHeader
                activeFilter={activeFilter}
                onChangeFilter={this.handleFilterChange}
                projectId={this.props.project.id}
                onOpenAddType={this.openAddType}
              />
            </Tether>
          )}
        <TypeList
          activeFilter={activeFilter}
          project={this.props.project}
          opacity={addingType ? 0.5 : 1}
          onEditModel={this.handleEditModel}
        />
      </div>
    )
  }
  private handleFilterChange = (filter: SchemaOverviewFilter) => {
    this.setState({activeFilter: filter} as State)
  }
  private closeAddType = () => {
    this.setState({addingType: false, editingModel: undefined} as State)
  }
  private openAddType = () => {
    this.setState({addingType: true} as State)
  }
  private handleEditModel = (model: Model) => {
    this.setState({
      editingModel: model,
      addingType: true,
    } as State)
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
