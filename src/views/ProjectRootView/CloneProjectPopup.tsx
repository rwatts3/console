import * as React            from 'react'
import * as Relay            from 'react-relay'
import * as ReactDOM         from 'react-dom'
import {connect}             from 'react-redux'
import {ConsoleEvents}       from 'graphcool-metrics'
import * as cx               from 'classnames'
import styled                from 'styled-components'
import {withRouter}          from 'react-router'
import {
  $p,
  variables,
  Icon,
}                            from 'graphcool-styles'

import {validateProjectName} from '../../utils/nameValidator'
import tracker               from '../../utils/metrics'

import mapProps              from '../../components/MapProps/MapProps'

import CloneProjectMutation  from '../../mutations/CloneProjectMutation'
import Checkbox              from '../../components/Form/Checkbox'

interface Props {
  router: ReactRouter.InjectedRouter
  projectId: string
  customerId: string
}

interface State {
  showError: boolean
  projectName: string
  includeData: boolean
  includeMutationCallbacks: boolean
}

const Popup = styled.div`
  width: 600px;
  max-width: 90%;
`

const NameInput = styled.input`
  &::-webkit-input-placeholder {
  color: ${variables.gray20};
  opacity: 1;
}
  &::-moz-placeholder {
    color: ${variables.gray20};
    opacity: 1;
  }
  &:-ms-input-placeholder {
    color: ${variables.gray20};
    opacity: 1;
  }
  &:-moz-placeholder {
    color: ${variables.gray20};
    opacity: 1;
  }
`

const Warning = styled.div`
  bottom: -44px;
`

const Button = styled.button`
  padding: ${variables.size16};
  font-size: ${variables.size16};
  border: none;
  background: none;
  color: ${variables.gray50};
  border-radius: 2px;
  cursor: pointer;
  transition: color ${variables.duration} linear;

  &:hover {
    color: ${variables.gray70};
  }
`

const CloneButton = styled(Button)`
  background: ${variables.green};
  color: ${variables.white};

  &:hover {
    color: ${variables.white};
  }
`

const MiniHeadline = styled.div`
  margin-top: -13px;
`

const NestedCheckboxes = styled.div`
  padding-left: 12px;
`

class CloneProjectPopup extends React.Component<Props, State> {
  state = {
    showError: false,
    projectName: '',
    includeData: true,
    includeMutationCallbacks: false,
  }

  componentDidMount() {
    tracker.track(ConsoleEvents.Schema.Model.Popup.opened({type: 'Update'}))
  }

  render() {
    return (
      <div
        className={cx($p.flex, $p.bgBlack50, $p.w100, $p.h100, $p.justifyCenter, $p.itemsCenter)}
      >
        <Popup className={cx($p.bgWhite, $p.br2)} style={{pointerEvents: 'all'}}>
          <div className={cx($p.relative, $p.pa60, $p.bb, $p.bBlack20 )}>
            <div className={cx($p.relative)}>
              {this.state.showError && (
                <Warning
                  className={cx($p.absolute, $p.left0, $p.orange, $p.f14)}
                >
                  Projects must begin with an uppercase letter
                </Warning>
              )}
              <NameInput
                className={cx($p.fw3, $p.f38, $p.bNone, $p.lhSolid, $p.tl)}
                type='text'
                autoFocus
                placeholder='Clone of Instagram...'
                onKeyDown={e => e.keyCode === 13 && this.cloneProject()}
                value={this.state.projectName}
                onChange={this.onProjectNameChange}
              />
            </div>
          </div>
          <MiniHeadline className={cx($p.tc)}>
            <p className={cx($p.dib, $p.f16, $p.fw3, $p.bgWhite, $p.ph16, $p.relative)}>
              Clone Settings
            </p>
          </MiniHeadline>
          <div className={cx($p.pa60, $p.f25, $p.fw3)}>
            <Checkbox
              checked={true}
              label='Schema'
            />
            <NestedCheckboxes>
              <Checkbox
                checked={this.state.includeData}
                onClick={this.onIncludeDataToggle}
                nested={true}
                label='Data'
                forceHighlightVerticalLine={this.state.includeMutationCallbacks}
              />
              <Checkbox
                checked={this.state.includeMutationCallbacks}
                onClick={this.onIncludeMutationCallbacksToggle}
                nested={true}
                label='Mutation Callbacks'
              />
            </NestedCheckboxes>
          </div>
          <div
            className={cx($p.bt, $p.bBlack10, $p.pa25, $p.flex, $p.justifyBetween)}
          >
            <Button onClick={this.onCancelClick}>
              Cancel
            </Button>
            <CloneButton onClick={this.cloneProject}>
              Clone
            </CloneButton>
          </div>
        </Popup>
      </div>
    )
  }

  private onCancelClick = () => {
    // TODO: Track
    this.closePopup()
  }

  private onProjectNameChange = (e: any) => {
    // TODO: track
    this.setState({ projectName: e.target.value } as State)
  }

  private onIncludeDataToggle = () => {
    // TODO: track
    this.setState({ includeData: !this.state.includeData } as State)
  }

  private onIncludeMutationCallbacksToggle = () => {
    // TODO: track
    this.setState({ includeMutationCallbacks: !this.state.includeMutationCallbacks } as State)
  }

  private closePopup = () => {
    this.props.router.goBack()
  }

  private cloneProject = () => {
    const { projectId, customerId } = this.props
    const { projectName, includeData, includeMutationCallbacks } = this.state

    if (projectName != null && !validateProjectName(projectName)) {
      this.setState({showError: true} as State)

      // Don't submit as long as name is invalid
      return
    }

    // TODO: track
    // tracker.track(ConsoleEvents.Permissions.Popup.submitted({
    //   type: 'Update',
    //   name: projectName
    // }))

    Relay.Store.commitUpdate(
      new CloneProjectMutation({
        customerId,
        projectId,
        includeData,
        includeMutationCallbacks,
        name: projectName,
      }),
      {
        onSuccess: () => this.closePopup(),
        onFailure: (transaction) => console.log(transaction),
      },
    )
  }
}

const MappedCloneProjectPopup = mapProps({
  projectId: props => props.viewer && props.viewer.project && props.viewer.project.id || null,
  customerId: props => props.viewer && props.viewer.user && props.viewer.user.id || null,
})(CloneProjectPopup)

export default Relay.createContainer(withRouter(MappedCloneProjectPopup), {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user { id }
        project: projectByName(projectName: $projectName) { id }
      }
    `,
  },
})
