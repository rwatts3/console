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
import {generateTestEvent} from '../../../utils/functionTest'
import {smoothScrollTo} from '../../../utils/smooth'
import TestLog from './TestLog'
import DummyTestLog from './DummyTestLog'
import ResizableBox from '../../../components/ResizableBox'
import Loading from '../../../components/Loading/Loading'

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
  updateFunction: () => Promise<any>
}

interface State {
  inputWidth?: number
  fullscreen: boolean
  ssschema: any
  showExample: boolean
  exampleEvent: string
  fakeSchema: any
  responses: TestResponse[]
  loading: boolean
}

export interface TestResponse {
  duration: number
  isError: boolean
  timestamp: string
  inline?: {
    errors: TestError[]
    event: string
    logs: string,
  }
  webhook?: {
    request: {
      body: string
      headers: any
      url: string,
    },
    response: {
      body: string
      statusCode: number,
    },
  }
}

export interface TestError {
  code: number
  error: string
  message: string
  stack: string
}

const modalStyling = {
  ...fieldModalStyle,
  content: {
    ...fieldModalStyle.content,
    width: window.innerWidth,
  },
  overlay: {
    ...fieldModalStyle.overlay,
    backgroundColor: 'rgba(23,42,58,.98)',
  },
}

export default class RequestPipelineFunctionInput extends React.Component<Props, State> {
  private logsRef: any
  private lastQuery: string
  private updateSSSExampleEvent = throttle(
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
      responses: [],
      loading: false,
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
    } else if (this.props.eventType === 'RP') {
      this.updateRPExampleEvent()
    }
  }
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.eventType === 'SSS' && this.props.eventType !== 'SSS') {
      this.fetchSSSchema()
    }

    if (nextProps.eventType === 'RP' && this.props.eventType !== 'RP') {
      this.updateRPExampleEvent()
    }

    if (nextProps.query !== this.props.query) {
      this.updateSSSExampleEvent(this.state.fakeSchema, nextProps.query)
    }
  }
  updateRPExampleEvent() {
    const exampleEvent = JSON.stringify(generateTestEvent(this.props.schema), null, 2)
    this.setState({exampleEvent} as State)
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
        this.updateSSSExampleEvent(fakeSchema)
      })
  }
  renderComponent() {
    const {inputWidth, fullscreen, showExample, responses} = this.state
    const {
      schema, value, onChange, onTypeChange, isInline, onChangeUrl, webhookUrl, eventType, sssModelName,
    } = this.props
    const {onChangeQuery} = this.props

    const inputTitle = eventType === 'RP' ? 'Event Type' : 'Subscription Query'

    return (
      <div className={cn('request-pipeline-function-input', 'sss', {
        fullscreen,
      })}>
        <style jsx>{`
          .request-pipeline-function-input {
            @p: .br2, .buttonShadow, .flex;
            height: 320px;
            margin-left: -4px;
            margin-right: -4px;
          }
          .request-pipeline-function-input.fullscreen {
            @p: .pa0, .center;
            height: 100vh;
          }
          .input {
            @p: .pa20, .relative, .br2, .brLeft, .bgDarkBlue, .flexFixed;
          }
          .fullscreen .input {
            height: 100vh;
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
            @p: .pl0, .pr0, .pb0, .flex, .flexColumn;
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
            @p: .pt6, .flex, .flexColumn, .flexAuto, .br2, .brRight, .relative;
          }
          .test-button {
            @p: .absolute, .bottom0, .right0, .mb25, .mr25;
          }
          .body :global(.ReactCodeMirror) {
            width: 100%;
          }

          /* Testing */
          .output {
            @p: .flexFixed, .pa38;
          }
          h2 {
            @p: .white, .f20, .fw6;
          }
          p {
            @p: .white50, .f16, .mt16;
          }
          .title {
            @p: .white40, .f16, .fw6, .ttu, .ml16;
          }
          .buttons {
            @p: .w100, .flex, .justifyEnd;
          }
          .header {
            @p: .mb16, .flex, .itemsCenter, .justifyBetween;
          }
          .logs {
            @p: .overflowAuto, .relative;
            max-height: calc(100vh - 120px);
          }
          .will-appear {
            @p: .mv20, .f16, .green;
          }
          .loading {
            @p: .absolute, .top0, .left0, .right0, .bottom0, .flex, .itemsCenter, .justifyCenter;
          }
          .clear {
            @p: .f12, .ttu, .br2, .mr38, .fw6, .pointer, .darkerBlue, .z999;
            letter-spacing: 0.2px;
            padding: 4px 8px;
            background: #b8bfc4;
          }
          .clear:hover {
            @p: .o70;
          }
          .loading {
            @p: .absolute, .top0, .left0, .right0, .bottom0, .flex, .itemsCenter, .justifyCenter;
          }
        `}</style>
        <style jsx global>{`
          .CodeMirror-hints {
            @p: .z999;
          }
        `}</style>
        <ResizableBox
          id='function-event'
          width={window.innerWidth / 3 - 120}
          height={window.innerHeight - 64}
          hideArrow
          onResize={this.handleResize}
        >
          <div className={cn('input', 'sss')}>
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
              <div className='sss-editor pl16 flexAuto'>
                <ResultViewer
                  value={this.state.exampleEvent}
                  editable
                  onChange={this.handleExampleChange}
                />
              </div>
            )}
            {!showExample && eventType === 'RP' && (
              <div className='pl25 flexAuto'>
                <QueryEditor
                  value={schema}
                  onChange={this.handleExampleChange}
                  readOnly
                  hideLineNumbers
                  hideFold
                />
              </div>
            )}
            {!showExample && eventType === 'SSS' && (
              <div className='sss-editor flexAuto'>
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
          </div>
        </ResizableBox>
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
            {fullscreen && (
              <div className='test-button'>
                <TestButton onClick={this.runTest} className='o70' />
              </div>
            )}
          </div>
        </div>
        {fullscreen && (
          <div className='output'>
            <ResizableBox
              id='function-logs'
              width={window.innerWidth / 3 - 120}
              height={window.innerHeight - 64}
              hideArrow
              left
            >
              <div className='header'>
                <div className='flex itemsCenter'>
                  <Icon
                    src={require('graphcool-styles/icons/fill/logs.svg')}
                    color={$v.white40}
                    width={24}
                    height={24}
                  />
                  <div className='title'>
                    Your Test Logs
                  </div>
                </div>
                <div className='clear' onClick={this.clear}>Clear</div>
              </div>
              <div className='logs' ref={this.setRef}>
                {responses.length === 0 && (
                  <div className='will-appear'>
                    The logs for your test function will appear here.
                  </div>
                )}
                {responses.length > 0 ? responses.map(res => (
                  <TestLog response={res} key={res.timestamp} />
                )) : (
                  [0,1,2].map(i => (
                    <DummyTestLog key={i} />
                  ))
                )}
                {this.state.loading && (
                  <div className='loading'>
                    <Loading color={$v.white50} />
                  </div>
                )}
              </div>
            </ResizableBox>
          </div>
        )}
      </div>
    )
  }

  private clear = () => {
    this.setState({responses: []} as State)
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

  private runTest = () => {
    this.props.updateFunction()
      .then(() => {
        const {webhookUrl, isInline} = this.props
        const {exampleEvent} = this.state
        this.setLoading(true)
        return fetch('https://d0b5iw4041.execute-api.eu-west-1.amazonaws.com/prod/execute/', {
          method: 'post',
          body: JSON.stringify({isInlineFunction: isInline, url: webhookUrl, event: exampleEvent}),
        })
          .then(res => res.json())
          .then((res: any) => {
            this.setState(
              state => {
                return {
                  ...state,
                  responses: [res].concat(state.responses),
                }
              },
              this.scrollUp,
            )
            this.setLoading(false)
          })
      })
  }

  private setLoading(loading: boolean) {
    this.setState({loading} as State)
  }

  private setRef = logsRef => {
    this.logsRef = logsRef
  }

  private scrollUp = () => {
    if (this.logsRef) {
      smoothScrollTo(this.logsRef, 0, 20)
    }
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
