import * as React from 'react'
const QueryEditor: any = require('../../SchemaView/Editor/QueryEditor').QueryEditor
const ResultViewer: any = require('../FunctionLogs/ResultViewer').ResultViewer
import {Icon, $v} from 'graphcool-styles'
import * as cn from 'classnames'
import JsEditor from './JsEditor'
import Toggle from './Toggle'
import WebhookEditor from './WebhookEditor'
import * as Modal from 'react-modal'
import {fieldModalStyle} from '../../../utils/modalStyle'
import StepMarker from './StepMarker'
import {EventType} from './FunctionPopup'
import { buildClientSchema, introspectionQuery } from 'graphql'
import {CustomGraphiQL} from 'graphcool-graphiql'
import {getEventInput} from './TestPopup'
import TestButton from './TestButton'
import {FunctionType} from '../../../types/types'
import {getExampleEvent, getFakeSchema} from '../../../utils/example-generation/index'
import {throttle} from 'lodash'

interface Props {
  schema: string
  onChange: (value: string) => void
  value: string
  isInline: boolean
  onTypeChange: (type: FunctionType) => void
  webhookUrl: string
  onChangeUrl: (url: string) => void
  headers: {[key: string]: string}
  onChangeHeaders: (headers: {[key: string]: string}) => void
  editing: boolean
  eventType: EventType
  onChangeQuery: (query: string) => void
  query: string
  projectId: string
  sssModelName: string
  onTestRun?: () => void
  showErrors?: boolean
}

interface State {
  inputWidth: number
  fullscreen: boolean
  ssschema: any
  showExample: boolean
  exampleEvent: string
  fakeSchema: any
}

const modalStyling = {
  ...fieldModalStyle,
  content: {
    ...fieldModalStyle.content,
    width: window.innerWidth,
  },
  overlay: {
    ...fieldModalStyle.overlay,
    backgroundColor: 'rgba(15,32,46,.9)',
  },
}

export default class RequestPipelineFunctionInput extends React.Component<Props, State> {
  private updateExampleEvent = throttle(
    (fakeSchema: any, query?: string) => {
      const schema = fakeSchema || this.state.fakeSchema
      const subscriptionQuery = query || this.props.query
      getExampleEvent(schema, subscriptionQuery).then(res => {
        if (res) {
          this.setState({exampleEvent: JSON.stringify(res, null, 2)} as State)
        }
      })
    },
    300,
    {
      trailing: true,
    },
  )
  constructor(props) {
    super(props)
    this.state = {
      inputWidth: 200,
      fullscreen: false,
      ssschema: null,
      showExample: false,
      exampleEvent: '',
      fakeSchema: null,
    }
  }
  render() {
    const {fullscreen} = this.state

    if (fullscreen) {
      return (
        <Modal
          isOpen
          style={modalStyling}
          contentLabel='Function Editor'
          onRequestClose={this.toggleFullscreen}
        >
          {this.renderComponent()}
        </Modal>
      )
    }

    return this.renderComponent()
  }
  componentDidMount() {
    if (this.props.eventType === 'SSS') {
      this.fetchSSSchema()
    }
  }
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.eventType === 'SSS' && this.props.eventType !== 'SSS') {
      this.fetchSSSchema()
    }

    if (nextProps.query !== this.props.query) {
      this.updateExampleEvent(this.state.fakeSchema, nextProps.query)
    }
  }
  fetchSSSchema() {
    const {projectId} = this.props
    const endpointUrl = `${__BACKEND_ADDR__}/simple/v1/${projectId}`

    return fetch(endpointUrl, { // tslint:disable-line
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'x-graphcool-source': 'console:playground',
      },
      body: JSON.stringify({query: introspectionQuery}),
    })
      .then((response) => {
        return response.json()
      })
      .then((res: any) => {
        const ssschema = buildClientSchema(res.data)
        // trim out mutationType and queryType
        ssschema['_mutationType']['_fields'] = {}
        ssschema['_queryType']['_fields'] = {}
        const fullSchema = buildClientSchema(res.data)
        const fakeSchema = getFakeSchema(fullSchema)
        this.setState({ssschema, fakeSchema} as State)
        this.updateExampleEvent(fakeSchema)
      })
  }
  renderComponent() {
    const {inputWidth, fullscreen, showExample} = this.state
    const {
      schema, value, onChange, onTypeChange, isInline, onChangeUrl, webhookUrl, eventType, sssModelName,
    } = this.props
    const {onChangeQuery} = this.props

    const inputTitle = eventType === 'RP' ? 'Event Type' : 'Subscription Query'

    return (
      <div className={cn('request-pipeline-function-input', {
        fullscreen,
        rp: eventType === 'RP',
        sss: eventType === 'SSS',
      })}>
        <style jsx>{`
          .request-pipeline-function-input {
            @p: .br2, .buttonShadow, .flex;
            height: 320px;
            margin-left: -4px;
            margin-right: -4px;
          }
          .request-pipeline-function-input.fullscreen {
            @p: .pa60, .center;
            height: 100vh;
          }
          .input {
            @p: .pa20, .relative, .br2, .brLeft, .bgDarkBlue;
          }
          .input.rp :global(.CodeMirror-cursor) {
            @p: .dn;
          }
          .input.rp :global(.CodeMirror-selected) {
            background: rgba(255,255,255,.1);
          }
          .input :global(.CodeMirror), .input :global(.CodeMirror-gutters) {
            background: transparent;
          }
          .input.sss :global(.CodeMirror-gutters) {
            @p: .bgDarkBlue;
          }
          .input.sss :global(.variable-editor) {
            @p: .dn;
          }
          .input.sss {
            @p: .w50, .pl0, .pr0, .pb0, .flex, .flexColumn;
          }
          .input.sss :global(.graphiql-container) {
            @p: .flexAuto, .overflowAuto, .h100;
          }
          .input.sss :global(.CodeMirror-lines) {
            @p: .pt0;
          }
          .input.sss :global(.CodeMirror) {
            padding-left: 3px;
            font-size: 13px;
          }
          .input.sss :global(.docExplorerWrap) {
            height: auto;
          }
          .input.sss :global(.docs-button) {
            top: 120px;
          }
          .event-input {
            @p: .darkBlue30, .ttu, .f14, .fw6, .flex, .itemsCenter, .mb10;
            letter-spacing: 0.3px;
          }
          .event-input span {
            @p: .mr10;
          }
          .sss-input {
            @p: .f12, .ttu, .fw6, .white40, .mb10, .flexFixed, .flex, .pl16;
            letter-spacing: 0.4px;
          }
          .sss-editor {
            @p: .overflowAuto, .flexAuto, .flex, .flexColumn;
          }
          .function {
            @p: .br2, .brRight, .bgDarkerBlue, .flexAuto, .flex, .flexColumn;
          }
          .head {
            @p: .flex, .justifyBetween, .flexFixed, .pa16;
          }
          .head :global(i) {
            @p: .pointer;
          }
          .body {
            @p: .pt6, .flex, .flexColumn, .flexAuto, .br2, .brRight;
          }
          .body :global(.ReactCodeMirror) {
            width: 100%;
          }
        `}</style>
        <style jsx global>{`
          .CodeMirror-hints {
            @p: .z999;
          }
        `}</style>
        <div className={cn('input', {sss: eventType === 'SSS', rp: eventType === 'RP'})}>
          <div className='sss-input'>
            {eventType === 'SSS' && !this.props.editing && (
              <StepMarker style={{left: -29, top: -1, position: 'relative'}}>2</StepMarker>
            )}
            <Toggle
              choices={[inputTitle, 'Example Event']}
              activeChoice={this.state.showExample ? 'Example Event' : inputTitle}
              onChange={this.handleInputChange}
            />
          </div>
          {showExample && (
            <div className='sss-editor pl16'>
              <ResultViewer
                value={this.state.exampleEvent}
                editable
                onChange={this.handleExampleChange}
              />
            </div>
          )}
          {!showExample && eventType === 'RP' && (
            <QueryEditor
              value={schema}
              readOnly
              hideLineNumbers
              hideFold
            />
          )}
          {!showExample && eventType === 'SSS' && (
            <div className='sss-editor'>
              <CustomGraphiQL
                rerenderQuery={true}
                schema={this.state.ssschema}
                variables={''}
                query={this.props.query}
                fetcher={() => { return null }}
                disableQueryHeader
                queryOnly
                showDocs
                onEditQuery={onChangeQuery}
              />
            </div>
          )}
          {fullscreen && (
            <div className='flex justifyEnd pa25'>
              <TestButton onClick={this.props.onTestRun} className='o70' />
            </div>
          )}
        </div>
        <div className='function'>
          <div className='head'>
            <div className='flex'>
              {!this.props.editing && (
                <StepMarker style={{left: -20, top: -1, position: 'relative'}}>
                  {eventType === 'RP' && '2'}
                  {eventType === 'SSS' && '3'}
                </StepMarker>
              )}
              <Toggle
                choices={['Inline Code', 'Webhook']}
                activeChoice={isInline ? 'Inline Code' : 'Webhook'}
                onChange={choice => choice === 'Inline Code' ? onTypeChange('AUTH0') : onTypeChange('WEBHOOK')}
              />
            </div>
            <Icon
              src={
                fullscreen ? require('assets/icons/compress.svg') : require('assets/icons/extend.svg')
              }
              stroke
              strokeWidth={1.5}
              color={$v.white50}
              onClick={this.toggleFullscreen}
            />
          </div>
          <div className='body'>
            {isInline ? (
              <JsEditor
                onChange={onChange}
                value={value}
              />
            ) : (
              <WebhookEditor
                onChangeUrl={this.props.onChangeUrl}
                url={webhookUrl}
                headers={this.props.headers}
                onChangeHeaders={this.props.onChangeHeaders}
                showErrors={this.props.showErrors}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  private handleExampleChange = (exampleEvent: string) => {
    this.setState({exampleEvent} as State)
  }

  private handleInputChange = (_, i: number) => {
    const showExample = i === 1
    this.setState({showExample} as State)
  }

  private handleResize = (inputWidth: number) => {
    this.setState({inputWidth} as State)
  }

  private toggleFullscreen = () => {
    this.setState(state => {
      return {
        ...state,
        fullscreen: !state.fullscreen,
      }
    })
  }
}
