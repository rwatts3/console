import * as React from 'react'
import * as CodeMirror from 'react-codemirror'

interface State {
  isFolded: boolean
}

interface Props {
  maxHeight: number
  options: any
  schema: string
}

export default class FoldableCodeMirror extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {
      isFolded: true,
    }
  }

  render() {
    return this.state.isFolded ? (
      <div style={{maxHeight: this.props.maxHeight}}>
        <CodeMirror
          options={this.props.options}>
          code={this.props.schema}
        </CodeMirror>
      </div>
      ) : (
        <CodeMirror
          options={this.props.options}>
          code={this.props.schema}
        </CodeMirror>
      )

  }
}
