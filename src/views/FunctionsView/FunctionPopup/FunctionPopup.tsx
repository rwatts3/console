import * as React from 'react'
import mapProps from '../../../components/MapProps/MapProps'
import * as Relay from 'react-relay'
import * as Modal from 'react-modal'
import modalStyle from '../../../utils/modalStyle'
import {withRouter} from 'react-router'
import ModalDocs from '../../../components/ModalDocs/ModalDocs'
import PopupHeader from '../../../components/PopupHeader'
import PopupFooter from '../../../components/PopupFooter'
import {Model, Project, ServerlessFunction} from '../../../types/types'
import {
  didChange,
  getEmptyFunction, isValid, updateAuth0Id, updateBinding, updateInlineCode, updateModel, updateName, updateOperation,
  updateWebhookHeaders,
  updateWebhookUrl,
} from './functionPopupState'
import * as Codemirror from 'react-codemirror'
import Step0 from './Step0'
import * as cookiestore from 'cookiestore'
import Trigger from './Trigger'
import RequestPipelineFunction from './RequestPipelineFunction'
import {RelayProp} from 'react-relay'
import {showNotification} from '../../../actions/notification'
import {connect} from 'react-redux'
import AddRequestPipelineMutationFunction from '../../../mutations/Functions/AddRequestPipelineMutationFunction'
import {onFailureShowNotification} from '../../../utils/relay'
import {ShowNotificationCallback} from '../../../types/utils'
import Loading from '../../../components/Loading/Loading'
import UpdateRequestPipelineMutationFunction from '../../../mutations/Functions/UpdateRequestPipelineMutationFunction'
import DeleteFunction from '../../../mutations/Functions/DeleteFunction'
import {Icon, $v} from 'graphcool-styles'
import TestPopup from './TestPopup'

export type EventType = 'SSS' | 'RP' | 'CRON'
export const eventTypes: EventType[] = ['SSS', 'RP', 'CRON']

interface Props {
  params: any
  router: ReactRouter.InjectedRouter
  models: Model[]
  relay: RelayProp
  schema: string
  showNotification: ShowNotificationCallback
  project: Project
  node: ServerlessFunction
}

export interface FunctionPopupState {
  activeTabIndex: number
  editing: boolean
  showErrors: boolean
  fn: ServerlessFunction
  loading: boolean
  eventType: EventType
  isInline: boolean
  showTest: boolean
}

const customModalStyle = {
  overlay: modalStyle.overlay,
  content: {
    ...modalStyle.content,
    width: 700,
  },
}

class FunctionPopup extends React.Component<Props, FunctionPopupState> {

  constructor(props: Props) {
    super(props)

    // prepare node that comes from the server
    if (props.node) {
      if (props.node.model) {
        props.node.modelId = props.node.model.id
      }
      if (props.node.auth0Id && props.node.auth0Id.length > 0) {
        props.node._webhookUrl = props.node.webhookUrl
        props.node.webhookUrl = ''
      }
      if (props.node.webhookHeaders && props.node.webhookHeaders.length > 0) {
        try {
          this.props.node._webhookHeaders = JSON.parse(props.node.webhookHeaders)
        } catch (e) {
          //
        }
      }
    }

    this.state = {
      activeTabIndex: 0,
      editing: Boolean(props.node),
      showErrors: false,
      fn: props.node || getEmptyFunction(props.models),
      loading: false,
      eventType: this.getEventTypeFromFunction(props.node),
      isInline: this.getIsInline(props.node),
      showTest: false,
    }

    // selectedModelName: null,
    //   modelSelected: false,
    //   binding: null,
    //   operation: null,
    // TODO put in schema of selected fn
    this.props.relay.setVariables({
      modelSelected: true,
      operation: 'CREATE',
      selectedModelName: 'User',
      binding: 'PRE_WRITE',
    })
  }

  componentDidUpdate(prevProps: Props, prevState: FunctionPopupState) {
    if (prevState.fn.modelId !== this.state.fn.modelId ||
        prevState.fn.operation !== this.state.fn.operation ||
        prevState.fn.binding !== this.state.fn.binding
    ) {
      this.props.relay.setVariables({
        modelSelected: true,
        operation: this.state.fn.operation,
        selectedModelName: this.props.models.find(model => model.id === this.state.fn.modelId).name,
        binding: this.state.fn.binding,
      })
    }
  }

  render() {
    const {models, schema} = this.props
    const {activeTabIndex, editing, showErrors, fn, eventType, isInline, loading, showTest} = this.state

    const changed = didChange(this.state.fn, this.props.node)
    const valid = isValid(this.state)

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
                @p: .bgWhite, .relative;
              }
              .popup-body {
                max-height: calc(100vh - 200px);
              }
              .loading {
                @p: .absolute, .bgWhite70, .flex, .itemsCenter, .justifyCenter, .z999;
                top: -10px;
                left: -10px;
                right: -10px;
                bottom: -10px;
                box-shadow: 0 0 5px 5px rga(255,255,255,0.7);
                content: "";
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
              {activeTabIndex === 0 && !editing && (
                <Step0
                  eventType={eventType}
                  onChangeEventType={this.handleEventTypeChange}
                />
              )}
              {activeTabIndex === 1 && !editing && eventType === 'RP' && (
                <Trigger
                  models={models}
                  selectedModelId={fn.modelId}
                  binding={fn.binding}
                  onModelChange={this.update(updateModel)}
                  onBindingChange={this.update(updateBinding)}
                  operation={fn.operation}
                  onChangeOperation={this.update(updateOperation)}
                />
              )}
              {eventType === 'RP' && (editing ? (activeTabIndex === 0) : (activeTabIndex === 2)) && (
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
                  schema={schema}
                  headers={fn._webhookHeaders}
                  onChangeHeaders={this.update(updateWebhookHeaders)}
                  editing={editing}
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
              getButtonForTab={this.footerButtonForTab}
            />
            {loading && (
              <div className='loading'>
                <Loading />
              </div>
            )}
            <TestPopup
              onRequestClose={this.closeTestPopup}
              webhookUrl={((fn.webhookUrl && fn.webhookUrl.length > 0 && fn.webhookUrl) || fn._webhookUrl)}
              isInline={isInline}
              isOpen={showTest}
              schema={schema}
              eventType={eventType}
              binding={fn.binding}
            />
          </div>
        </ModalDocs>
      </Modal>
    )
  }

  private closeTestPopup = () => {
    this.setState({showTest: false} as FunctionPopupState)
  }

  private footerButtonForTab = (index: number) => {
    const {editing, eventType} = this.state
    if (editing || this.state.eventType === 'RP' && index === 2) {
      return (
        <div className='btn' onClick={this.showTestPopup}>
          <style jsx>{`
            .btn {
              @p: .bgWhite, .darkBlue70, .f16, .ph16, .br2, .flex, .itemsCenter, .buttonShadow, .pointer;
              padding-top: 9px;
              padding-bottom: 10px;
            }
            .btn span {
              @p: .ml10;
            }
          `}</style>
          <Icon
            src={require('graphcool-styles/icons/fill/triangle.svg')}
            color={$v.darkBlue40}
            width={10}
            height={10}
          />
          <span>
            Test Run
          </span>
        </div>
      )
    }

    return null
  }

  private showTestPopup = () => {
    this.setLoading(true)
    this.createExtendFunction()
      .then((res: any) => {
        const {url, fn} = res
        this.update(updateWebhookUrl)(url)
        this.update(updateAuth0Id)(fn)
        this.setLoading(false)
        this.setState({showTest: true} as FunctionPopupState)
      })
  }

  private handleIsInlineChange = (isInline: boolean) => {
    this.setState({isInline} as FunctionPopupState)
  }

  private getTabs = () => {
    const {eventType} = this.state

    if (eventType === 'RP' && this.state.editing) {
      return ['Update Function']
    }

    return ['Set Event Type', 'Choose Trigger', 'Define Function']
  }

  private handleEventTypeChange = (eventType: EventType) => {
    this.setState({eventType} as FunctionPopupState)
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

    return fetch('https://bju4v1fpt2.execute-api.us-east-1.amazonaws.com/dev/create/', {
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
    this.setLoading(true)
    Relay.Store.commitUpdate(
      new DeleteFunction({
        functionId: this.props.node.id,
        projectId: this.props.project.id,
      }),
      {
        onSuccess: () => {
          this.close()
          this.setLoading(false)
        },
        onFailure: (transaction) => {
          onFailureShowNotification(transaction, this.props.showNotification)
          this.setLoading(false)
        },
      },
    )
  }

  private submit = () => {
    this.setState({loading: true} as FunctionPopupState)
    if (this.state.isInline) {
      this.createExtendFunction()
        .then((res: any) => {
          const {url, fn} = res
          if (this.state.editing) {
            this.updateFunction(url, fn)
          } else {
            this.create(url, fn)
          }
        })
    } else {
      const {webhookUrl} = this.state.fn
      if (this.state.editing) {
        this.updateFunction(webhookUrl)
      } else {
        this.create(webhookUrl)
      }
    }
  }

  private create(webhookUrl?: string, auth0Id?: string) {
    const {fn, isInline} = this.state
    const input = {
      ...fn,
      projectId: this.props.project.id,
      webhookUrl: webhookUrl || fn.webhookUrl,
      auth0Id: auth0Id || fn.auth0Id,
      webhookHeaders: fn._webhookHeaders ? JSON.stringify(fn._webhookHeaders) : '',
      inlineCode: isInline ? fn.inlineCode : '',
    }
    this.setLoading(true)
    Relay.Store.commitUpdate(
      new AddRequestPipelineMutationFunction(input),
      {
        onSuccess: () => {
          this.close()
          this.setLoading(false)
        },
        onFailure: (transaction) => {
          onFailureShowNotification(transaction, this.props.showNotification)
          this.setLoading(false)
        },
      },
    )
  }

  private updateFunction(webhookUrl?: string, auth0Id?: string) {
    const {fn} = this.state
    const input = {
      ...fn,
      projectId: this.props.project.id,
      webhookUrl: webhookUrl || fn.webhookUrl,
      headers: fn.webhookHeaders,
      auth0Id: auth0Id || fn.auth0Id,
      functionId: fn.id,
    }
    this.setLoading(true)
    Relay.Store.commitUpdate(
      new UpdateRequestPipelineMutationFunction(input),
      {
        onSuccess: () => {
          this.close()
          this.setLoading(false)
        },
        onFailure: (transaction) => {
          onFailureShowNotification(transaction, this.props.showNotification)
          this.setLoading(false)
        },
      },
    )
  }

  private close = () => {
    const {router, params} = this.props
    router.goBack()
  }

  private errorInTab = (index: number) => false

  private setTabIndex = (index: number) => {
    this.setState({activeTabIndex: index} as FunctionPopupState)
  }

  private getEventTypeFromFunction(fn: ServerlessFunction | null): EventType {
    if (!fn) {
      return null
    }

    if (fn.hasOwnProperty('binding')) {
      return 'RP'
    }

    return 'RP'
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

  private setLoading = (loading: boolean) => {
    this.setState({loading} as FunctionPopupState)
  }
}

const ConnectedFunctionPopup = connect(null, {showNotification})(FunctionPopup)

const MappedFunctionPopup = mapProps({
  project: props => props.viewer.project,
  models: props => props.viewer.project.models.edges.map(edge => edge.node),
  schema: props => props.viewer.model && props.viewer.model.requestPipelineFunctionSchema,
  node: props => props.node,
})(withRouter(ConnectedFunctionPopup))

export const EditFunctionPopup = Relay.createContainer(MappedFunctionPopup, {
  initialVariables: {
    projectName: null, // injected from router
    selectedModelName: null,
    modelSelected: false,
    binding: null,
    operation: null,
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
        model: modelByName(modelName: $selectedModelName projectName: $projectName) @include(if: $modelSelected) {
          requestPipelineFunctionSchema(binding: $binding operation: $operation)
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
      fragment on Function {
        id
        name
        inlineCode
        isActive
        type
        auth0Id
        webhookHeaders
        webhookUrl
        ... on RequestPipelineMutationFunction {
          binding
          model {
            id
          }
          operation
        }
      }
    `,
  },
})

const fragment = Relay.QL`
  fragment on RequestPipelineMutationFunction {
    binding
    model {
      id
    }
    operation
  }
`

const bindings = [
  'TRANSFORM_AGENT',
  'PRE_WRITE',
  'TRANSFORM_PAYLOAD',
]

export const CreateFunctionPopup = Relay.createContainer(MappedFunctionPopup, {
  initialVariables: {
    projectName: null, // injected from router
    selectedModelName: null,
    modelSelected: false,
    binding: null,
    operation: null,
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
        model: modelByName(modelName: $selectedModelName projectName: $projectName) @include(if: $modelSelected) {
          requestPipelineFunctionSchema(binding: $binding operation: $operation)
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