import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {ReduxAction} from '../../types/reducers'
import {closePopup} from '../../actions/popup'
import styled from 'styled-components'
import {particles, variables} from 'graphcool-styles'
import * as cx from 'classnames'
import {validateModelName} from '../../utils/nameValidator'

interface Props {
  id: string
  closePopup: (id: string) => ReduxAction
  saveModel: (modelName: string) => ReduxAction
}

interface State {
  showError: boolean
}

class AddModelPopup extends React.Component<Props, State> {

  refs: {
    input: HTMLInputElement,
  }

  state = {
    showError: false,
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

    const SaveButton = styled(Button)`
      background: ${variables.green};
      color: ${variables.white};

      &:hover {
        color: ${variables.white};
      }
    `

    return (
      <div
        className={cx(
          particles.flex,
          particles.bgBlack50,
          particles.w100,
          particles.h100,
          particles.justifyCenter,
          particles.itemsCenter,
        )}
      >
        <Popup className={cx(particles.bgWhite, particles.br2)} style={{pointerEvents: 'all'}}>
          <div className={cx(particles.relative, particles.pa60)}>

            <div className={cx(particles.relative)}>
              {this.state.showError && (
                <Warning
                  className={cx(
                  particles.absolute,
                  particles.left0,
                  particles.orange,
                  particles.f14,
                )}
                >
                  Models must begin with an uppercase letter and only contain letters and numbers
                </Warning>
              )}
              <NameInput
                className={cx(
                  particles.fw3,
                  particles.f38,
                  particles.bNone,
                  particles.lhSolid,
                  particles.tl,
                )}
                type='text'
                autoFocus
                placeholder='New Model...'
                defaultValue=''
                onKeyDown={e => e.keyCode === 13 && this.saveModel()}
                ref='input'
              />
            </div>

          </div>
          <div
            className={cx(
              particles.bt,
              particles.bBlack10,
              particles.pa25,
              particles.flex,
              particles.justifyBetween,
            )}
          >
            <Button onClick={() => this.props.closePopup(this.props.id)}>
              Cancel
            </Button>
            <SaveButton onClick={this.saveModel}>
              Create
            </SaveButton>
          </div>
        </Popup>
      </div>
    )
  }

  private saveModel = () => {
    const modelName = (ReactDOM.findDOMNode(this.refs.input) as HTMLInputElement).value
    if (modelName != null && !validateModelName(modelName)) {
      this.setState({showError: true} as State)
      return
    }

    this.props.saveModel(modelName)
    this.props.closePopup(this.props.id)
  }

}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({closePopup}, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddModelPopup)
