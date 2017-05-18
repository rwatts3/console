import * as React from 'react'
import {FunctionBinding, FunctionType, Model, RequestPipelineMutationOperation} from '../../../types/types'
import RequestPipelineFunctionInput from './RequestPipelineFunctionInput'
import StepMarker from './StepMarker'
import {getText} from './data'
import {EventType} from './FunctionPopup'
import N from './N'

interface Props {
  name: string
  inlineCode: string
  onInlineCodeChange: (code: string) => void
  onNameChange: (name: string) => void
  binding: FunctionBinding
  isInline: boolean
  onTypeChange: (type: FunctionType) => void
  onChangeUrl: (url: string) => void
  webhookUrl: string
  schema: string
  headers: {[key: string]: string}
  onChangeHeaders: (headers: {[key: string]: string}) => void
  editing: boolean
  query: string
  onChangeQuery: (query: string) => void
  eventType: EventType
  projectId: string
  sssModelName: string
  modelName?: string
  operation?: RequestPipelineMutationOperation
  onTestRun?: () => void
  showErrors: boolean
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
      name, inlineCode, onInlineCodeChange, onNameChange, binding, isInline, onTypeChange,
      webhookUrl, onChangeUrl, schema, editing, eventType, onChangeQuery, query,
      showErrors,
    } = this.props
    return (
      <div className='request-pipeline-function'>
        <style jsx>{`
          .request-pipeline-function {
          }
          input {
            @p: .hf32, .blue, .pl38, .w100;
            line-height: 1.4;
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
            padding: 1px 3px;
          }
          pre {
            @p: .purple, .code, .br2, .bgDarkBlue04, .mh6, .dib, .f14;
            padding: 2px 4px;
          }
          .error {
            @p: .red, .pv16, .f16, .ml38;
          }
        `}</style>
        <input
          type='text'
          value={name}
          onChange={this.nameChange}
          placeholder='Set a function name...'
          autoFocus
        />
        {showErrors && (!name || name.length === 0) && (
          <div className='error'>Please give your function a name ⤴</div>
        )}
        {!editing && (
          <StepMarker active style={{marginTop: -36, marginLeft: -4}}>1</StepMarker>
        )}
        <div className='line' />
        {eventType === 'RP' && (
          <p>
            By creating a function at
            <span className='pre'>{binding}</span>
            {getText(binding)} <br/>
            Your function will be called when a
            <span className='pre'>{this.props.modelName}</span> is
            <span className='pre'>{this.props.operation.toLowerCase()}d</span>
          </p>
        )}
        {eventType === 'SSS' && (
          <p>
            To create a server-side subscription, you need to
            <N>1</N>
            define a function name
            <N>2</N>
            define a trigger with some input (usually one or more mutations for one type), as well as
            <N>3</N>
            write a function that get’s executed every time.
          </p>
        )}
        <p>
          The <pre>input</pre> argument represents the payload of the subscription. <br/>
          {eventType === 'RP' && (
            <span>
              You can either return a value or use the <pre>cb()</pre> function if you have an async flow.
            </span>
          )}
        </p>
        <RequestPipelineFunctionInput
          schema={schema}
          onChange={onInlineCodeChange}
          value={inlineCode}
          isInline={isInline}
          onTypeChange={onTypeChange}
          webhookUrl={webhookUrl}
          onChangeUrl={onChangeUrl}
          headers={this.props.headers}
          onChangeHeaders={this.props.onChangeHeaders}
          editing={this.props.editing}
          eventType={eventType}
          onChangeQuery={this.props.onChangeQuery}
          query={this.props.query}
          projectId={this.props.projectId}
          sssModelName={this.props.sssModelName}
          onTestRun={this.props.onTestRun}
          showErrors={this.props.showErrors}
        />
      </div>
    )
  }

  private nameChange = e => {
    this.props.onNameChange(e.target.value)
  }
}
