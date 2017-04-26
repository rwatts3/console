import * as React from 'react'
import * as cn from 'classnames'
const Codemirror: any = require('react-codemirror')
import * as Relay from 'react-relay'
import {Project} from '../../types/types'
import * as FileSaver from 'file-saver'
import {sortSchema} from '../../../sortSchema'
import {Link} from 'react-router'
import MigrateProject from '../../mutations/Schema/MigrateProject'
import MigrationMessages from './MigrationMessages'
require('graphcool-graphiql/graphiql_dark.css')

interface Props {
  project: Project
  relay: any
  forceFetchSchemaView: () => void
}

export interface MigrationMessage {
  type: string
  action: string
  name: string
  description: string
  subDescriptions: MigrationSubMessage[]
}

export interface MigrationSubMessage {
  type: string
  action: string
  name: string
  description: string
}

export interface MigrationError {
  type: String
  field: String
  description: String
}

interface State {
  schema: string
  beta: boolean
  isDryRun: boolean
  messages: MigrationMessage[]
  errors: MigrationError[]
}

const mockMessages = [{
  "name": "Asd",
  "description": "The type `Asd` is updated.",
  "subDescriptions": [{
    "action": "Create",
    "description": "A new field with the name `sdf` and type `String` is created.",
    "name": "sdf",
    "type": "Field"
  }, {
    "action": "Update",
    "description": "The field `a` is updated.",
    "name": "a",
    "type": "Field"
  }, {
    "action": "Update",
    "description": "The field `newerName` is updated.",
    "name": "newerName",
    "type": "Field"
  }, {
    "action": "Update",
    "description": "The field `text` is updated.",
    "name": "text",
    "type": "Field"
  }],
  "type": "Type",
  "action": "Update"
}]


class SchemaEditor extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      // schema: sortSchema(props.project.schema, props.project.models.edges.map(edge => edge.node)),
      schema: props.project.schema,
      beta: true,
      isDryRun: true,
      messages: [],
      errors: [],
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.project.schema !== this.props.project.schema) {
      this.setState({schema: nextProps.project.schema} as State)
    }
  }
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
    const {schema, beta} = this.state

    const didChange = this.state.schema.trim() !== project.schema.trim()

    return (
      <div className={cn('schema-editor', {beta})}>
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
          .schema-editor:not(.beta) :global(.CodeMirror-cursor) {
            @p: .dn;
          }
          .schema-editor :global(.CodeMirror-selected) {
            background: rgba(255,255,255,.1);
          }

          .footer {
            @p: .flex, .w100, .pa25, .relative, .bgDarkerBlue, .flexFixed;
            /*&:after {
              @p: .absolute, .left0, .right0, .top0;
              z-index: 30;
              margin-top: -36px;
              content: "";
              height: 36px;
              background: linear-gradient(to top, $darkerBlue, rgba(15,32,46,0));
              pointer-events: none;
            }*/
          }
          .footer.editing {
            @p: .bgBlack30, .pa16, .justifyBetween;
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
          .apply-changes {
            @p: .bgGreen, .br2, .white, .f16, .pa10, .pointer;
          }
          .cancel {
            @p: .pa10, .white40, .f16, .pointer;
          }
        `}</style>
        <Codemirror
          value={schema}
          options={{
            height: 'auto',
            viewportMargin: Infinity,
            mode: 'graphql',
            theme: 'graphiql',
            readOnly: !beta,
            lineNumbers: true,
            tabSize: 2,
          }}
          onFocusChange={(focused) => {
            if (focused) {
              // TODO track
            }
          }}
          onChange={this.handleSchemaChange}
        />
        {didChange ? (
          <div>
            {(this.state.messages.length > 0 || this.state.errors.length > 0) && (
              <MigrationMessages messages={this.state.messages} errors={this.state.errors} />
            )}
            <div className='footer editing'>
              <div className='cancel' onClick={this.reset}>Cancel</div>
              <div className='apply-changes' onClick={this.updateSchema}>Apply Changes</div>
            </div>
          </div>
        ) : (
          <div className='footer'>
            <div className='button' onClick={this.downloadSchema}>Export Schema</div>
            <Link className='button' to={`/${project.name}/clone`}>Clone Project</Link>
          </div>
        )}
        {!beta && (
          <div className='soon-editable'>soon editable</div>
        )}
      </div>
    )
  }

  private updateSchema = () => {
    const {schema, isDryRun} = this.state
    const newSchema = this.addFrontmatter(schema)
    Relay.Store.commitUpdate(
      new MigrateProject({
        newSchema,
        isDryRun,
      }),
      {
        onSuccess: (res) => {
          console.log(res)
          if (isDryRun) {
            this.setState({
              messages: res.migrateProject.migrationMessages,
              isDryRun: false,
              errors: res.migrateProject.errors,
            } as State)
          } else {
            this.setState({messages: [], isDryRun: true, errors: []} as State)
            this.props.forceFetchSchemaView()
          }
        },
        onFailure: (transaction) => {
          console.log('fail', transaction)
        },
      },
    )
  }

  private reset = () => {
    this.setState({
      errors: [],
      messages: [],
      isDryRun: true,
    } as State)
  }

  private addFrontmatter(schema) {
    const {version, id} = this.props.project
    return `# projectId: ${id}
# version: ${version}\n` + schema
  }

  private handleSchemaChange = schema => {
    this.setState({schema} as State)
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
        id
        schema
        name
        version
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
