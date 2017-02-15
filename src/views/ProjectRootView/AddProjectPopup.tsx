import * as React from 'react'
import * as Modal from 'react-modal'
import {fieldModalStyle} from '../../utils/modalStyle'
import FloatingInput from '../../components/FloatingInput/FloatingInput'
import Loading from '../../components/Loading/Loading'

interface Props {
  projectName: string
  onChangeProjectName: (projectName: string) => void
  onRequestClose: () => void
  onSubmit: () => void
  isOpen: boolean
  error: boolean
  showError: boolean
  loading: boolean
}

const modalStyling = {
  ...fieldModalStyle,
  content: {
    ...fieldModalStyle.content,
    width: 450,
  },
}

export default class AddProjectPopup extends React.Component<Props, null> {
  render() {
    const {projectName, isOpen, onChangeProjectName, onRequestClose, onSubmit, error, loading, showError} = this.props
    return (
      <Modal
        isOpen={isOpen}
        contentLabel='Alert'
        style={modalStyling}
        onRequestClose={onRequestClose}
      >
        <style jsx>{`
          .add-project {
            @p: .buttonShadow, .relative;
          }
          .body {
            @p: .bgWhite, .pa38;
          }
          .footer {
            @p: .pa25, .flex, .justifyBetween, .itemsCenter, .bt, .bBlack10;
            background: rgb(250,250,250);
          }
          .button {
            @p: .br2, .pointer;
            padding: 9px 16px 10px 16px;
          }
          .warning {
            @p: .white, .bgLightOrange;
          }
          .cancel {
            @p: .black50;
          }
          .green {
            @p: .white, .bgGreen;
          }
          .button.disabled {
            @p: .bgBlack20;
          }
          .title {
            @p: .f38, .fw3, .tc, .pb25;
          }
          .add-project :global(.label) {
            @p: .f16, .pa16, .black50, .fw3;
          }
          .add-project :global(.input) {
            @p: .pa16, .br2, .bn, .mb10, .f25, .fw3;
            line-height: 1.5;
          }
          .error {
            @p: .f14, .red;
          }
          .loading {
            @p: .absolute, .top0, .left0, .right0, .bottom0, .z2, .bgWhite80, .flex, .justifyCenter, .itemsCenter;
          }
        `}</style>
        <div className='add-project'>
          <div className='body'>
            <div className='title'>New Project</div>
            <FloatingInput
              labelClassName='label'
              className='input'
              label='Project Name'
              placeholder='Choose a project name'
              value={projectName}
              onChange={onChangeProjectName}
              autoFocus
            />
            {showError && error && (
              <div className='error'>
                The project name must begin with an uppercase letter
              </div>
            )}
          </div>
          <div className='footer'>
            <div className='button cancel' onClick={onRequestClose}>Cancel</div>
            <div className={'button green' + (error ? ' disabled' : '')} onClick={onSubmit}>Ok</div>
          </div>
          {loading && (
            <div className='loading'>
              <Loading />
            </div>
          )}
        </div>
      </Modal>
    )
  }
}
