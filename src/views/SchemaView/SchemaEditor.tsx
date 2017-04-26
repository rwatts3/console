import * as React from 'react'
const Codemirror: any = require('react-codemirror')
import * as Relay from 'react-relay'
import {Project} from '../../types/types'
import * as FileSaver from 'file-saver'
import {sortSchema} from '../../../sortSchema'
import {Link} from 'react-router'

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

    const {project} = this.props
    const sortedSchema = sortSchema(this.props.project.schema, this.props.project.models.edges.map(edge => edge.node))

    return (
      <div className='schema-editor'>
        <style jsx={true}>{`
          .schema-editor {
            @p: .w50, .bgDarkerBlue, .flex, .flexColumn, .relative;
          }
          .schema-editor :global(.CodeMirror) {
            @p: .h100;
            padding: 25px;
            padding-left: 16px;
          }
          .schema-editor :global(.ReactCodeMirror) {
            @p: .flex1, .overflowAuto;
          }
          .schema-editor :global(.CodeMirror-cursor) {
            @p: .dn;
          }
          .schema-editor :global(.CodeMirror-selected) {
            background: rgba(255,255,255,.1);
          }

          .footer {
            @p: .flex, .w100, .pa25, .relative, .bgDarkerBlue, .flexFixed;
            &:after {
              @p: .absolute, .left0, .right0, .top0;
              z-index: 30;
              margin-top: -36px;
              content: "";
              height: 36px;
              background: linear-gradient(to top, $darkerBlue, rgba(15,32,46,0));
              pointer-events: none;
            }
          }
          .schema-editor :global(.button) {
            @p: .bgWhite04, .fw6, .f14, .white50, .ttu, .br2, .pointer, .o50, .mr16;
            padding: 7px 9px 8px 11px;
            letter-spacing: 0.53px;
            transition: $duration linear opacity;
          }
          .schema-editor :global(.button:hover) {
            @p: .o100;
          }
          .soon-editable {
            @p: .absolute, .ma25, .top0, .right0, .ttu, .f14, .fw6, .white30;
          }
        `}</style>
        <Codemirror
          value={sortedSchema}
          options={{
            height: 'auto',
            viewportMargin: Infinity,
            mode: 'graphql',
            theme: 'graphiql',
            readOnly: true,
            lineNumbers: true,
          }}
          onFocusChange={(focused) => {
            if (focused) {
              // TODO track
            }
          }}
        />
        <div className='footer'>
          <div className='button' onClick={this.downloadSchema}>Export Schema</div>
          <Link className='button' to={`/${project.name}/clone`}>Clone Project</Link>
        </div>
        <div className='soon-editable'>soon editable</div>
      </div>
    )
  }

  private downloadSchema = () => {
    const blob = new Blob([this.props.project.schema], {type: 'text/plain;charset=utf-8'})
    FileSaver.saveAs(blob, `${this.props.project.name}.schema`)
  }
}

export default Relay.createContainer(SchemaEditor, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        schema
        name
        models(first: 100) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `,
  },
})
