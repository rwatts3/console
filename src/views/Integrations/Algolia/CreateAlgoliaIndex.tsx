import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { SearchProviderAlgolia, Model } from '../../../types/types'
import AlgoliaQuery from './AlgoliaQuery'
import mapProps from '../../../components/MapProps/MapProps'
import { $v, Icon } from 'graphcool-styles'
import AddAlgoliaSyncQueryMutation from '../../../mutations/AddAlgoliaSyncQueryMutation'
import { showNotification } from '../../../actions/notification'
import { onFailureShowNotification } from '../../../utils/relay'
import { ShowNotificationCallback } from '../../../types/utils'
import { connect } from 'react-redux'
import ConfirmOperationsPopup from './ConfirmOperationsPopup'
import Loading from '../../../components/Loading/Loading'

interface Props {
  algolia: SearchProviderAlgolia
  models: Model[]
  onRequestClose: () => void
  showNotification: ShowNotificationCallback
  noIndeces: boolean
}

interface State {
  selectedModel: Model
  fragment: string
  fragmentValid: boolean
  title: string
  loading: boolean
  saving: boolean
}

class CreateAlgoliaIndex extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = this.getInitialState(props)
  }
  getInitialState(props: Props): State {
    return {
      selectedModel: props.models[0],
      fragment: emptyAlgoliaFragment,
      fragmentValid: true,
      title: '',
      loading: false,
      saving: false,
    }
  }
  render() {
    const { algolia, models } = this.props
    const { selectedModel, fragment, title, loading } = this.state
    const valid = this.valid()
    return (
      <div className="create-algolia-index">
        <style jsx>{`
          .create-algolia-index {
            @p: .overflowAuto, .bgDarkBlue, .flex, .flexColumn, .justifyBetween,
              .w100, .overflowVisible, .relative;
            height: 100vh;
          }
          .header {
            @p: .pa38, .f14, .white40, .ttu, .fw6;
          }
          .footer {
            @p: .pa25, .flex, .itemsCenter, .justifyBetween, .z2;
            margin-bottom: 80px;
          }
          .button {
            @p: .pointer;
            padding: 9px 16px 10px 16px;
          }
          .delete {
            @p: .red;
          }
          .right {
            @p: .flex, .itemsCenter, .relative;
          }
          .button.cancel {
            @p: .f16, .white60;
          }
          .save {
            @p: .bgWhite10, .white30, .br2;
          }
          .save.active {
            @p: .bgGreen, .white;
          }
          .bottom {
            @p: .bgDarkerBlue, .flex1, .flex, .flexColumn, .justifyBetween;
          }
          .top {
            @p: .pa38, .relative;
            flex: 0 0 325px;
          }
          .new-index {
            @p: .absolute, .top0, .left0, .bgGreen, .white, .br2, .ttu, .f12,
              .fw6;
            padding: 2px 5px;
            margin-top: 15px;
            margin-left: -4px;
          }
          .step {
            @p: .fw6, .f14, .white40, .pt38, .ttu;
          }
          select {
            @p: .f25, .fw4, .darkerBlue, .br2, .relative, .w100;
            background: rgb(185, 191, 196);
            box-shadow: none;
            border: none;
            padding: 9px 15px 9px 14px;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
          }
          .select-wrapper {
            @p: .relative, .mt25;
            width: 219px;
          }
          .triangle {
            @p: .right0, .absolute, .top0;
            pointer-events: none;
            margin-top: 18px;
            margin-right: 13px;
          }
          .name-selection {
            @p: .f38, .fw3, .white, .mt16;
            background: none;
            &::placeholder {
              @p: .white50;
            }
          }
          .loading {
            @p: .flex, .top0, .right0, .bottom0, .left0, .z999, .itemsCenter,
              .justifyCenter;
          }
        `}</style>
        <style jsx global>{`
          .create-algolia-index .CodeMirror {
            @p: .bgDarkerBlue;
          }
          .create-algolia-index .CodeMirror-gutters {
            @p: .bgDarkerBlue;
          }
        `}</style>
        <div className="top">
          <div className="new-index">New index</div>
          <div className="step">
            {'1) Select a Model'}
          </div>
          <div className="select-wrapper">
            <select value={selectedModel.id} onChange={this.handleModelChange}>
              {models.map(model =>
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>,
              )}
            </select>
            <div className="triangle">
              <Icon
                src={require('graphcool-styles/icons/fill/triangle.svg')}
                width={8}
                height={8}
                color={$v.darkerBlue}
                rotate={90}
              />
            </div>
          </div>
          <div className="step">
            {'2) Choose a Name'}
          </div>
          <input
            value={title}
            placeholder="Select a name ..."
            className="name-selection"
            onChange={this.handleTitleChange}
          />
        </div>
        <div className="bottom">
          <div>
            <div className="header">
              {`3) Define a Query`}
            </div>
            <AlgoliaQuery
              algolia={algolia}
              fragment={fragment}
              onFragmentChange={this.handleFragmentChange}
              selectedModel={selectedModel}
            />
          </div>
          <div className="footer">
            <div className="button cancel" onClick={this.cancel}>
              Cancel
            </div>
            <div className="right">
              <div
                className={'button save' + (valid ? ' active' : '')}
                onClick={this.create}
              >
                Create Index
              </div>
              {valid &&
                selectedModel.itemCount > 0 &&
                this.state.saving &&
                <ConfirmOperationsPopup
                  numOperations={selectedModel.itemCount}
                  onCancel={this.close}
                  onConfirmBreakingChanges={this.create}
                  showReset={false}
                  saveLabel="Create Index"
                />}
            </div>
          </div>
        </div>
        {loading &&
          <div className="loading">
            <Loading color="white" />
          </div>}
      </div>
    )
  }

  private cancel = () => {
    if (this.props.noIndeces) {
      this.reset()
    } else {
      this.close()
    }
  }

  private reset = () => {
    this.setState(this.getInitialState(this.props))
  }

  private handleModelChange = (e: any) => {
    const modelId = e.target.value
    const model = this.props.models.find(m => m.id === modelId)
    this.setState(
      {
        selectedModel: model,
      } as State,
    )
  }

  private handleTitleChange = (e: any) => {
    this.setState(
      {
        title: e.target.value,
      } as State,
    )
  }

  private handleFragmentChange = (fragment: string, fragmentValid: boolean) => {
    this.setState(
      {
        fragment,
        fragmentValid,
      } as State,
    )
  }

  private create = () => {
    const { fragment, title, selectedModel, loading } = this.state
    const { algolia } = this.props

    if (this.valid() && !loading) {
      if (!this.state.saving && selectedModel.itemCount > 0) {
        return this.setState({ saving: true } as State)
      }
      this.setState({ loading: true } as State, () => {
        AddAlgoliaSyncQueryMutation.commit({
          modelId: selectedModel.id,
          indexName: title,
          fragment,
          searchProviderAlgoliaId: algolia.id,
        })
          .then(res => {
            this.setState({ loading: false } as State)
            this.close()
          })
          .catch(res => {
            this.setState({ loading: false } as State)
            onFailureShowNotification(res, this.props.showNotification)
          })
      })
    }
  }

  private close() {
    this.props.onRequestClose()
  }

  private valid() {
    return this.state.title.length > 0 && this.state.fragmentValid
  }
}

const ReduxContainer = connect(null, { showNotification })(CreateAlgoliaIndex)

const Container = mapProps({
  algolia: props => props.algolia,
  models: props => {
    return props.project.models.edges.map(edge => edge.node)
  },
})(ReduxContainer)

export default createFragmentContainer(Container, {
  project: graphql`
    fragment CreateAlgoliaIndex_project on Project {
      models(first: 1000) {
        edges {
          node {
            id
            name
            itemCount
          }
        }
      }
    }
  `,
  algolia: graphql`
    fragment CreateAlgoliaIndex_algolia on SearchProviderAlgolia {
      ...AlgoliaQuery_algolia
    }
  `,
})

const emptyAlgoliaFragment = `
  # Here you can select which data should be synced to algolia
  # Use Ctrl+Space for auto completion.
  # This is an example:
  {
    node {
      id
    }
  }
`
