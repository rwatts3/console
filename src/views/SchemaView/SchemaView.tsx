import * as React from 'react'
import SchemaOverview from './SchemaOverview/SchemaOverview'
import SchemaEditor from './SchemaEditor'
import SchemaHeader from './SchemaHeader'
import * as Relay from 'react-relay'
import {Viewer} from '../../types/types'
import ResizableBox from '../../components/ResizableBox'
import {throttle} from 'lodash'

interface Props {
  viewer: Viewer
  location: any
  params: any
  relay: any
}

interface State {
  editorWidth: number
  typesChanged: boolean
}

class NewSchemaView extends React.Component<Props, State> {
  private handleResize = throttle(
    (_, {size}) => {
      localStorage.setItem('schema-editor-width', size.width)
    },
    300,
  )

  constructor(props) {
    super(props)

    this.state = {
      editorWidth: parseInt(localStorage.getItem('schema-editor-width'), 10) || (window.innerWidth - 290) / 2,
      typesChanged: false,
    }
  }
  render() {
    const {viewer, location, params} = this.props
    const {editorWidth, typesChanged} = this.state
    const editingModelName = location.pathname.endsWith(`${params.modelName}/edit`) ? params.modelName : undefined
    return (
      <div className='schema-view'>
        <style jsx>{`
          .schema-view {
            @p: .flex, .flexColumn, .h100, .itemsStretch;
            background-color: rgb(11,20,28);
            border-left: 6px solid #08131B;
          }
          .schema-wrapper {
            @p: .flex, .h100, .pt6, .bgDarkBlue;
          }
        `}</style>
        <SchemaHeader
          projectName={viewer.project.name}
          location={this.props.location}
          typesChanged={typesChanged}
        />
        <div className='schema-wrapper'>
          <ResizableBox
            id='schema-view'
            width={editorWidth}
            height={window.innerHeight - 64}
            hideArrow
            onResize={this.handleResize}
          >
            <SchemaEditor
              project={viewer.project}
              forceFetchSchemaView={this.props.relay.forceFetch}
              onTypesChange={this.handleTypesChange}
            />
          </ResizableBox>
          <SchemaOverview
            location={location}
            project={viewer.project}
            editingModelName={editingModelName}
          />
        </div>
        {this.props.children}
      </div>
    )
  }

  private handleTypesChange = typesChanged => {
    this.setState({typesChanged} as State)
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
          id
          name
          ${SchemaEditor.getFragment('project')}
          ${SchemaOverview.getFragment('project')}
        }
      }
    `,
  },
})
