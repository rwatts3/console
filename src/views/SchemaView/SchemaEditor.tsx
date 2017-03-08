import * as React from 'react'
const Codemirror: any = require('react-codemirror')
import * as Relay from 'react-relay'
import {Project} from '../../types/types'

interface Props {
  project: Project
}

require('graphcool-graphiql/graphiql_dark.css')

class SchemaEditor extends React.Component<Props,null> {
  render() {
    require('codemirror/addon/hint/show-hint')
    require('codemirror/addon/comment/comment')
    require('codemirror/addon/edit/matchbrackets')
    require('codemirror/addon/edit/closebrackets')
    require('codemirror/addon/fold/foldgutter')
    require('codemirror/addon/fold/brace-fold')
    require('codemirror/addon/lint/lint')
    require('codemirror/keymap/sublime')
    require('codemirror-graphql/hint')
    require('codemirror-graphql/lint')
    require('codemirror-graphql/info')
    require('codemirror-graphql/jump')
    require('codemirror-graphql/mode')

    return (
      <div className='schema-editor'>
        <style jsx={true}>{`
          .schema-editor {
            @p: .flex1;
            border-top: 6px solid $darkBlue;
          }
          .schema-editor :global(.CodeMirror) {
            height: calc(100vh - 57px);
            padding: 25px;
          }
        `}</style>
        <Codemirror
          value={this.props.project.schema}
          options={{
            height: 'auto',
            viewportMargin: Infinity,
            mode: 'graphql',
            theme: 'graphiql',
            readOnly: true,
          }}
          onFocusChange={(focused) => {
            if (focused) {
              // TODO track
            }
          }}
        />
      </div>
    )
  }
}

export default Relay.createContainer(SchemaEditor, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        schema
      }
    `,
  },
})
