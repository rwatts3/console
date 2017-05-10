import * as React from 'react'
import {FunctionBinding} from '../../../types/types'
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
  onIsInlineChange: (isInline: boolean) => void
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
      webhookUrl, onChangeUrl, schema, editing, eventType, onChangeQuery, query,
    } = this.props
    return (
      <div className='request-pipeline-function'>
        <style jsx>{`
          .request-pipeline-function {
          }
          input {
            @p: .hf32, .blue, .ml38;
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
          <StepMarker active style={{marginTop: -36, marginLeft: -4}}>1</StepMarker>
        )}
        <div className='line' />
        {eventType === 'RP' && (
          <p>
            By creating a function at
            <span className='pre'>{binding}</span>
            {getText(binding)}
          </p>
        )}
        {eventType === 'SSS' && (
          <p>
            To create a server-side subscription, you need to
            <N>1</N>
            define a function name
            <N>2</N>
            define a trigger with some input (usually one or more mutations), as well as
            <N>3</N>
            write a function that get’s executed every time.
          </p>
        )}
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
          eventType={eventType}
          onChangeQuery={this.props.onChangeQuery}
          query={this.props.query}
          projectId={this.props.projectId}
        />
      </div>
    )
  }

  private nameChange = e => {
    this.props.onNameChange(e.target.value)
  }
}
