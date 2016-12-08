import * as React            from 'react'
import * as ReactDOM         from 'react-dom'
import {connect}             from 'react-redux'
import {ConsoleEvents}       from 'graphcool-metrics'
import * as cx               from 'classnames'
import styled                from 'styled-components'
import {
  $p,
  variables,
  Icon,
}                            from 'graphcool-styles'

import {validateProjectName} from '../../utils/nameValidator'
import tracker               from '../../utils/metrics'

import {ReduxAction}         from '../../types/reducers'
import {closePopup}          from '../../actions/popup'

interface Props {
  id: string
  modelName: string
  duplicateProject: (projectName: string) => ReduxAction
  closePopup: (id: string) => ReduxAction
}

interface State {
  showError: boolean
}

class ClodeProjectPopup extends React.Component<Props, State> {
  refs: {
    input: HTMLInputElement,
  }

  state = {
    showError: false,
  }

  private saveProject = () => {
    const projectName = (ReactDOM.findDOMNode(this.refs.input) as HTMLInputElement).value

    tracker.track(ConsoleEvents.Schema.Model.Popup.submitted({type: 'Update', name: projectName}))

    if (projectName != null && !validateProjectName(projectName)) {
      this.setState({showError: true} as State)

      return
    }

    this.props.duplicateProject(projectName)
    this.props.closePopup(this.props.id)
  }

  private onCancelClick = () => {
    this.props.closePopup(this.props.id)
    tracker.track(ConsoleEvents.Schema.Model.Popup.canceled({type: 'Update'}))
  }

  componentDidMount() {
    tracker.track(ConsoleEvents.Schema.Model.Popup.opened({type: 'Update'}))
  }

  render() {
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
      bottom: -44px
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

    const CheckIcon = styled(Icon)`
      background-color: #4990E2
      display: inline-flex !important
      vertical-align: middle
      padding: 5px
      margin-right: 15px
      border-radius: 50%
    `

    const CloneButton = styled(Button)`
      background: ${variables.green};
      color: ${variables.white};

      &:hover {
        color: ${variables.white};
      }
    `

    return (
      <div
        className={cx(
          $p.flex,
          $p.bgBlack50,
          $p.w100,
          $p.h100,
          $p.justifyCenter,
          $p.itemsCenter,
        )}
      >
        <Popup className={cx($p.bgWhite, $p.br2)} style={{pointerEvents: 'all'}}>
          <div className={cx($p.relative, $p.pa60)}>
            <div className={cx($p.relative)}>
              {this.state.showError && (
                <Warning
                  className={cx(
                  $p.absolute,
                  $p.left0,
                  $p.orange,
                  $p.f14,
                )}
                >
                  Models must begin with an uppercase letter and only contain letters and numbers
                </Warning>
              )}
              <NameInput
                className={cx(
                  $p.fw3,
                  $p.f38,
                  $p.bNone,
                  $p.lhSolid,
                  $p.tl,
                )}
                type='text'
                autoFocus
                placeholder='Clone of Instagram...'
                onKeyDown={e => e.keyCode === 13 && this.saveProject()}
                ref='input'
              />
            </div>
          </div>
          <div className={cx($p.pa60, $p.f25, $p.fw3)}>
            <p className={cx($p.mv6)}>
              <CheckIcon
                color="white"
                src={require('../../assets/icons/check.svg')}
              />
              <span className={cx($p.dib, $p.vMid)}>
                Schema
              </span>
            </p>
            <div className={cx($p.pl25)}>
              <p className={cx($p.mv6)}>
                <CheckIcon
                  color="white"
                  src={require('../../assets/icons/check.svg')}
                />
                <span className={cx($p.dib, $p.vMid)}>
                  Data
                </span>
              </p>
              <p className={cx($p.mv6)}>
                <CheckIcon
                  color="white"
                  src={require('../../assets/icons/check.svg')}
                />
                <span className={cx($p.dib, $p.vMid)}>
                  Mutation Callbacks
                </span>
              </p>
            </div>
          </div>
          <div
            className={cx(
              $p.bt,
              $p.bBlack10,
              $p.pa25,
              $p.flex,
              $p.justifyBetween,
            )}
          >
            <Button onClick={this.onCancelClick}>
              Cancel
            </Button>
            <CloneButton onClick={this.saveProject}>
              Clone
            </CloneButton>
          </div>
        </Popup>
      </div>
    )
  }
}

export default connect(
  null,
  {
    closePopup,
  },
)(ClodeProjectPopup)
