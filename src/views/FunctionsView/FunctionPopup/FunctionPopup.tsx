import * as React from 'react'
import mapProps from '../../../components/MapProps/MapProps'
import * as Relay from 'react-relay'
import * as Modal from 'react-modal'
import modalStyle from '../../../utils/modalStyle'
import {withRouter} from 'react-router'
import ModalDocs from '../../../components/ModalDocs/ModalDocs'
import PopupHeader from '../../../components/PopupHeader'
import PopupFooter from '../../../components/PopupFooter'
import {Model, ServerlessFunction} from '../../../types/types'
import {
  getEmptyFunction, updateBinding, updateInlineCode, updateModel, updateName,
  updateWebhookUrl,
} from './functionPopupState'
import * as Codemirror from 'react-codemirror'
import Step0 from './Step0'
import * as cookiestore from 'cookiestore'
import Trigger from './Trigger'
import RequestPipelineFunction from './RequestPipelineFunction'

export type EventType = 'SSS' | 'RP' | 'CRON'
export const eventTypes: EventType[] = ['SSS', 'RP', 'CRON']

interface Props {
  params: any
  router: ReactRouter.InjectedRouter
  models: Model[]
}

interface State {
  activeTabIndex: number
  editing: boolean
  showErrors: boolean
  fn: ServerlessFunction
  loading: boolean
  eventType: EventType
  isInline: boolean
}

const customModalStyle = {
  overlay: modalStyle.overlay,
  content: {
    ...modalStyle.content,
    width: 700,
  },
}

class FunctionPopup extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {
      activeTabIndex: 2,
      editing: false,
      showErrors: false,
      fn: props.node || getEmptyFunction(),
      loading: false,
      // TODO reenable!!!
      // eventType: this.getEventTypeFromFunction(props.node),
      eventType: 'RP',
      isInline: false,
      // TODO reenable!!!
      // isInline: this.getIsInline(props.node),
    }
  }

  render() {
    const {models} = this.props
    const {activeTabIndex, editing, showErrors, fn, eventType, isInline} = this.state

    const changed = false
    const valid = true

    const tabs = this.getTabs()

    return (
      <Modal
        contentLabel='Function Popup'
        style={customModalStyle}
        isOpen
        onRequestClose={(e) => {
          if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
            return
          }
          this.close()
        }}
      >
        <ModalDocs
          title='How do functions work?'
          id='functions-popup'
          resources={[
            {
              title: 'Overview over Functions',
              type: 'guide',
              link: 'https://www.graph.cool/docs/reference/platform/authorization/overview-iegoo0heez/',
            },
          ]}
          videoId='l1KEssmlhPA'
        >
          <div
            className='function-popup'
          >
            <style jsx>{`
              .function-popup {
              }
              .popup-body {
                max-height: calc(100vh - 200px);
              }
            `}</style>
            <PopupHeader
              creatingTitle='New Function'
              editingTitle='Editing Function'
              errorInTab={this.errorInTab}
              onRequestClose={this.close}
              activeTabIndex={activeTabIndex}
              editing={editing}
              onSelectTab={this.setTabIndex}
              showErrors={showErrors}
              tabs={tabs}
            />
            <div className='popup-body'>
              {activeTabIndex === 0 && (
                <Step0
                  eventType={eventType}
                  onChangeEventType={this.handleEventTypeChange}
                />
              )}
              {activeTabIndex === 1 && eventType === 'RP' && (
                <Trigger
                  models={models}
                  selectedModelId={fn.modelId}
                  binding={fn.binding}
                  onModelChange={this.update(updateModel)}
                  onBindingChange={this.update(updateBinding)}
                />
              )}
              {activeTabIndex === 2 && eventType === 'RP' && (
                <RequestPipelineFunction
                  name={fn.name}
                  inlineCode={fn.inlineCode}
                  onInlineCodeChange={this.update(updateInlineCode)}
                  onNameChange={this.update(updateName)}
                  binding={fn.binding}
                  isInline={isInline}
                  onIsInlineChange={this.handleIsInlineChange}
                  onChangeUrl={this.update(updateWebhookUrl)}
                  webhookUrl={fn.webhookUrl}
                />
              )}
            </div>
            <PopupFooter
              entityName='Function'
              tabs={tabs}
              activeTabIndex={activeTabIndex}
              changed={changed}
              create={!editing}
              valid={valid}
              onCancel={this.cancel}
              onDelete={this.delete}
              onSubmit={this.submit}
              onSelectIndex={this.setTabIndex}
            />
          </div>
        </ModalDocs>
      </Modal>
    )
  }

  private handleIsInlineChange = (isInline: boolean) => {
    this.setState({isInline} as State)
  }

  private getTabs = () => {
    const {eventType} = this.state

    return ['Set Event Type', 'Choose Trigger', 'Define Function']
  }

  private handleEventTypeChange = (eventType: EventType) => {
    this.setState({eventType} as State)
  }

  private update = (func: Function, done?: Function) => {
    return (...params) => {
      this.setState(
        ({fn, ...state}) => {
          return {
            ...state,
            fn: func(fn, ...params),
          }
        },
        () => {
          if (typeof done === 'function') {
            done()
          }
        },
      )
    }
  }

  private createExtendFunction = () => {
    const {fn: {inlineCode}} = this.state
    const authToken = cookiestore.get('graphcool_auth_token')

    return fetch('https://bju4v1fpt2.execute-api.us-east-1.amazonaws.com/dev/', {
      method: 'post',
      body: JSON.stringify({code: inlineCode, authToken}),
    })
    .then(res => res.json())
  }

  private cancel = () => {
    // boring
  }

  private delete = () => {
    // smepty
  }

  private submit = () => {
    this.setState({loading: true} as State)
    this.createExtendFunction()
      .then(res => {
        const {url} = res
        const fn = {
          ...this.state.fn,
          url,
        }

        console.log('going to submit fn', fn)
      })
  }

  private close = () => {
    const {router, params} = this.props
    router.goBack()
  }

  private errorInTab = (index: number) => false

  private setTabIndex = (index: number) => {
    this.setState({activeTabIndex: index} as State)
  }

  private getEventTypeFromFunction(fn: ServerlessFunction | null): EventType {
    if (!fn) {
      return null
    }

    if (fn.hasOwnProperty('binding')) {
      return 'RP'
    }

    return 'CRON'
  }

  private getIsInline(fn: ServerlessFunction| null): boolean {
    if (fn) {
      if (fn.inlineCode && fn.inlineCode.length > 0) {
        return true
      } else {
        return false
      }
    }

    return true
  }
}

const MappedFunctionsPopup = mapProps({
  project: props => props.viewer.project,
  models: props => props.viewer.project.models.edges.map(edge => edge.node),
})(withRouter(FunctionPopup))

export const EditFunctionPopup = Relay.createContainer(MappedFunctionsPopup, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
        project: projectByName(projectName: $projectName) {
          id
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
        user {
          crm {
            information {
              isBeta
            }
          }
        }
      }
    `,
    node: () => Relay.QL`
      fragment on Node {
        id
        ... on Function {
          name
          ... on RequestPipelineMutationFunction {
            binding
          }
        }
      }
    `,
  },
})

const bindings = [
  'TRANSFORM_AGENT',
  'PRE_WRITE',
  'TRANSFORM_PAYLOAD',
]

export const CreateFunctionPopup = Relay.createContainer(MappedFunctionsPopup, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
        project: projectByName(projectName: $projectName) {
          id
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
        user {
          crm {
            information {
              isBeta
            }
          }
        }
      }
    `,
  },
})
