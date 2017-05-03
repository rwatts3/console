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
import {getEmptyFunction, updateBinding, updateInlineCode, updateModel, updateName} from './functionPopupState'
import * as Codemirror from 'react-codemirror'

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
}

class FunctionPopup extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {
      activeTabIndex: 0,
      editing: false,
      showErrors: false,
      fn: props.node || getEmptyFunction(),
      loading: false,
    }
  }

  render() {
    const {models} = this.props
    const {activeTabIndex, editing, showErrors, fn} = this.state

    const changed = false
    const valid = true

    return (
      <Modal
        contentLabel='Function Popup'
        style={modalStyle}
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
                @p: .pa25;
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
              <input type='text' placeholder='Function Name' onChange={this.update(updateName)} />
              <div className='mt25'>
                <div>
                  Binding:
                </div>
                <select value={fn.binding} onChange={this.update(updateBinding)}>
                  {bindings.map(binding => (
                    <option key={binding} value={binding}>{binding}</option>
                  ))}
                </select>
              </div>
              <div className='mt25'>
                <div>
                  Model:
                </div>
                <select value={fn.modelId} onChange={this.update(updateModel)}>
                  {models.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
              </div>
              <div className='mt25'>
                <Codemirror
                  value={fn.inlineCode}
                  onChange={this.update(updateInlineCode)}
                  options={{
                    lineNumbers: true,
                    mode: 'javascript',
                    theme: 'mdn-like',
                    // theme: 'mdn-like',
                  }}
                />
              </div>
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

    return fetch('https://bju4v1fpt2.execute-api.us-east-1.amazonaws.com/dev/', {
      method: 'post',
      body: JSON.stringify({code: inlineCode}),
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
}

const tabs = ['Choose Type', 'Hook Point', 'Cot']

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
