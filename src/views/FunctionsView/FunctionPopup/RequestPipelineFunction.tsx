import * as React from 'react'
import {FunctionBinding} from '../../../types/types'
import RequestPipelineFunctionInput from './RequestPipelineFunctionInput'
import StepMarker from './StepMarker'

interface Props {
  name: string
  inlineCode: string
  onInlineCodeChange: (code: string) => void
  onNameChange: (name: string) => void
  binding: FunctionBinding
  isInline: boolean
  onIsInlineChange: (isInline: boolean) => void
  onChangeUrl: (url: string) => void
  webhookUrl: string
  schema: string
  headers: {[key: string]: string}
  onChangeHeaders: (headers: {[key: string]: string}) => void
  editing: boolean
}

interface State {

}

export default class RequestPipelineFunction extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    const {
      name, inlineCode, onInlineCodeChange, onNameChange, binding, isInline, onIsInlineChange,
      webhookUrl, onChangeUrl, schema, editing,
    } = this.props
    return (
      <div className='request-pipeline-function'>
        <style jsx>{`
          .request-pipeline-function {
          }
          input {
            @p: .hf32, .blue, .ml38;
          }
          .line {
            @p: .bgDarkBlue10, .ph16, .w100, .mv25;
            height: 2px;
          }
          p {
            @p: .f16, .darkBlue50, .pl38, .pr60, .pb25;
          }
          .pre {
            @p: .mono, .bgDarkBlue07, .br2, .ml4;
            padding: 1px 2px;
          }
        `}</style>
        <input
          type='text'
          value={name}
          onChange={this.nameChange}
          placeholder='Set a function name...'
          autoFocus
        />
        {!editing && (
          <StepMarker active style={{marginTop: -30, marginLeft: -4}}>1</StepMarker>
        )}
        <div className='line' />
        <p>
          By creating a function at
          <span className='pre'>{binding}</span>
          , you can manipulate your data before it get’s validated by our
          Constraints and Permissions APIs. Use this to transform credit card numbers, slugs etc.
        </p>
        <RequestPipelineFunctionInput
          schema={schema}
          onChange={onInlineCodeChange}
          value={inlineCode}
          isInline={isInline}
          onIsInlineChange={onIsInlineChange}
          webhookUrl={webhookUrl}
          onChangeUrl={onChangeUrl}
          headers={this.props.headers}
          onChangeHeaders={this.props.onChangeHeaders}
          editing={this.props.editing}
        />
      </div>
    )
  }

  private nameChange = e => {
    this.props.onNameChange(e.target.value)
  }
}
