import * as React from 'react'
import ResizableBox from '../../../components/ResizableBox'
const QueryEditor: any = require('../../SchemaView/Editor/QueryEditor').QueryEditor
import {Icon, $v} from 'graphcool-styles'
import * as cn from 'classnames'
import JsEditor from './JsEditor'
import Toggle from './Toggle'
import WebhookEditor from './WebhookEditor'
import * as Modal from 'react-modal'
import {fieldModalStyle} from '../../../utils/modalStyle'
import StepMarker from './StepMarker'

interface Props {
  schema: string
  onChange: (value: string) => void
  value: string
  isInline: boolean
  onIsInlineChange: (value: boolean) => void
  webhookUrl: string
  onChangeUrl: (url: string) => void
  headers: {[key: string]: string}
  onChangeHeaders: (headers: {[key: string]: string}) => void
  editing: boolean
}

interface State {
  inputWidth: number
  fullscreen: boolean
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
  constructor(props) {
    super(props)
    this.state = {
      inputWidth: 200,
      fullscreen: false,
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
  renderComponent() {
    const {inputWidth, fullscreen} = this.state
    const {schema, value, onChange, onIsInlineChange, isInline, onChangeUrl, webhookUrl} = this.props
    return (
      <div className={cn('request-pipeline-function-input', {fullscreen})}>
        <style jsx>{`
          .request-pipeline-function-input {
            @p: .br2, .buttonShadow, .flex;
            height: 250px;
            margin-left: -4px;
            margin-right: -4px;
          }
          .request-pipeline-function-input.fullscreen {
            @p: .pa60, .center;
            height: 100vh;
            max-width: 1400px;
          }
          .input {
            @p: .pa20, .relative, .br2, .brLeft;
            background: #F5F5F5;
          }
          .input :global(.CodeMirror-cursor) {
            @p: .dn;
          }
          .input :global(.CodeMirror-selected) {
            background: rgba(255,255,255,.1);
          }
          .input :global(.CodeMirror), .input :global(.CodeMirror-gutters) {
            background: transparent;
          }
          .input :global(.cm-punctuation) {
            color: rgba(0,0,0,.4);
          }
          .event-input {
            @p: .darkBlue30, .ttu, .f14, .fw6, .flex, .itemsCenter, .mb10;
            letter-spacing: 0.3px;
          }
          .event-input span {
            @p: .mr10;
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
        `}</style>
        <div className='input'>
          <div className='event-input'>
            <span>Event Input</span>
            <Icon src={require('graphcool-styles/icons/fill/lock.svg')} color={$v.darkBlue30} />
          </div>
          <ResizableBox
            id='schema-view'
            width={inputWidth}
            height={window.innerHeight - 64}
            hideArrow
            onResize={this.handleResize}
          >
            <QueryEditor
              value={schema}
              readOnly
              hideLineNumbers
              hideFold
              editorTheme='mdn-like'
            />
          </ResizableBox>
        </div>
        <div className='function'>
          <div className='head'>
            <div className='flex'>
              {!this.props.editing && (
                <StepMarker style={{left: -20, top: -1, position: 'relative'}}>2</StepMarker>
              )}
              <Toggle
                choices={['Inline Code', 'Webhook']}
                activeChoice={isInline ? 'Inline Code' : 'Webhook'}
                onChange={choice => choice === 'Inline Code' ? onIsInlineChange(true) : onIsInlineChange(false)}
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
              <JsEditor onChange={onChange} value={value} />
            ) : (
              <WebhookEditor
                onChangeUrl={this.props.onChangeUrl}
                url={webhookUrl}
                headers={this.props.headers}
                onChangeHeaders={this.props.onChangeHeaders}
              />
            )}
          </div>
        </div>
      </div>
    )
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
