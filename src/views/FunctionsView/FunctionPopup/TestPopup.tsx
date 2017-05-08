import * as React from 'react'
import * as Modal from 'react-modal'
import {fieldModalStyle} from '../../../utils/modalStyle'
import {Icon, $v} from 'graphcool-styles'
import TestLog from './TestLog'
import {FunctionBinding, Log} from '../../../types/types'
import {smoothScrollTo} from '../../../utils/smooth'
import DummyTestLog from './DummyTestLog'
import {generateTestEvent} from '../../../utils/functionTest'
import {EventType} from './FunctionPopup'
const ResultViewer: any = require('../FunctionLogs/ResultViewer').ResultViewer

interface Props {
  onRequestClose: () => void
  webhookUrl: string
  isInline: boolean
  isOpen: boolean
  schema: string
  binding: FunctionBinding
  eventType: EventType
}

interface State {
  input: string
  responses: TestResponse[]
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
    width: '100vw',
  },
  overlay: {
    ...fieldModalStyle.overlay,
    backgroundColor: 'rgba(23,42,58,.98)',
    // backgroundColor: 'rgba(36, 54, 66, 0.98)',
  },
}

export default class TestPopup extends React.Component<Props, State> {

  private ref: any

  constructor(props) {
    super(props)

    this.state = {
      responses: [],
      input: JSON.stringify(generateTestEvent(props.schema), null, 2),
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.schema !== nextProps.schema) {
      this.setState({input: JSON.stringify(generateTestEvent(nextProps.schema), null, 2)} as State)
    }
  }

  render() {
    const {onRequestClose, isOpen, binding, eventType} = this.props
    const {responses, input} = this.state
    return (
      <Modal
        onRequestClose={onRequestClose}
        contentLabel='Function Testing Popup'
        style={modalStyling}
        isOpen={isOpen}
      >
        <style jsx={true}>{`
          .test-popup {
            @p: .pa60, .center, .flex, .justifyCenter;
          }
          .close-icon {
            @p: .absolute, .top38, .right38, .pointer;
          }
          .input {
            @p: .flexFixed, .overflowHidden;
            width: 500px;
          }
          .intro {
            @p: .bgDarkBlue, .pa38;
          }
          .output {
            @p: .flexFixed, .ml38;
          }
          h2 {
            @p: .white, .f20, .fw6;
          }
          p {
            @p: .white50, .f16, .mt16;
          }
          .editor {
            @p: .bgDarkerBlue, .pa16;
          }
          .editor-head {
            @p: .f14, .fw6, .white30, .ttu;
          }
          .title {
            @p: .white40, .f16, .fw6, .ttu, .ml16;
          }
          .buttons {
            @p: .w100, .flex, .justifyEnd;
          }
          .header {
            @p: .mb16;
          }
          .logs {
            @p: .overflowAuto;
            max-height: calc(100vh - 120px);
          }
          .will-appear {
            @p: .mv20, .f16, .green;
          }
          .test-popup :global(.cross) {
            @p: .fixed, .top0, .right0, .pa60;
          }
        `}</style>
        <div className='test-popup'>
          <div className='close-icon'>
            <Icon
              src={require('graphcool-styles/icons/stroke/cross.svg')}
              stroke
              strokeWidth={3}
              color={$v.white}
              width={26}
              height={26}
              onClick={onRequestClose}
              className='cross'
            />
          </div>
          <div className='input'>
            <div className='intro'>
              <h2>
                {this.getTitle(eventType, binding)}
              </h2>
              <p>
                To test your function, choose a payload that represents a valid input,
                then run it and see in the logs, if it works.
              </p>
            </div>
            <div className='editor'>
              <div className='editor-head'>
                Define your event input
              </div>
              <ResultViewer
                value={input}
                editable
                onChange={this.handleInputChange}
              />
              <div className='buttons'>
                <div
                  className='butn primary'
                  onClick={this.runTest}
                >
                  <Icon
                    src={require('graphcool-styles/icons/fill/triangle.svg')}
                    color={$v.white}
                    width={10}
                    height={10}
                  />
                  <span>
                    Run
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='output'>
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
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  private getTitle(eventType: EventType, binding: FunctionBinding) {
    let title = 'Test the '
    if (eventType === 'RP') {
      return `${title} ${binding} hook point`
    }
  }

  private runTest = () => {
    const {webhookUrl, isInline} = this.props
    const {input} = this.state
    return fetch('https://bju4v1fpt2.execute-api.us-east-1.amazonaws.com/dev/execute/', {
      method: 'post',
      body: JSON.stringify({isInlineFunction: false, url: webhookUrl, event: input}),
    })
      .then(res => res.json())
      .then((res: any) => {
        this.setState(
          state => {
            return {
              ...state,
              responses: state.responses.concat(res),
            }
          },
          this.scrollDown,
        )
      })
  }

  private scrollDown = () => {
    if (this.ref) {
      const target = this.ref.scrollHeight - this.ref.clientHeight
      smoothScrollTo(this.ref, target, 20)
    }
  }

  private setRef = ref => {
    this.ref = ref
  }

  private handleInputChange = (input: string) => {
    this.setState({input} as State)
  }
}
