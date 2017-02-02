import * as React from 'react'
import {RelationPopupDisplayState} from '../../types/types'
import {Icon} from 'graphcool-styles'
import ConfirmPopup from './ConfirmPopup'

interface State {
  displayConfirmDeletionPopup: boolean
}

interface Props {
  displayState: RelationPopupDisplayState
  switchDisplayState: Function
  onClickCreateRelation: Function
  onClickEditRelation: Function
  onClickDeleteRelation: Function
  resetToInitialState: Function
  canSubmit: boolean
  close: Function
  isEditingExistingRelation: boolean
  leftModelName?: string
  rightModelName?: string
  relationName?: string
  displayConfirmBreakingChangesPopup: boolean
}

export default class CreateRelationFooter extends React.Component<Props, State> {

  state = {
    displayConfirmDeletionPopup: false,
  }

  render() {
    return (
      <div className='container'>
        <style jsx={true}>{`
          .container {
            @inherit: .flex, .relative, .ph25, .pv16, .justifyBetween, .itemsCenter, .bt, .bBlack10, .bgBlack02;
            height: 77px;
          }
        `}</style>
        {this.generateLeftSideForFooter()}
        {this.props.displayState === 'DEFINE_RELATION' && !this.props.isEditingExistingRelation ?
          this.generateRightSideForFooterForCreatingNewRelation()
          :
          this.generateRightSideForFooterForEditingExistingRelation()
        }
        {this.props.displayConfirmBreakingChangesPopup && <ConfirmPopup
          red={false}
          onCancel={() => console.log('displayConfirmBreakingChangesPopup')}
          leftModelName={this.props.leftModelName}
          rightModelName={this.props.rightModelName}
          onConfirmBreakingChanges={this.props.onClickEditRelation}
          onResetBreakingChanges={this.props.resetToInitialState}
        />}
        {this.state.displayConfirmDeletionPopup && <ConfirmPopup
          red={true}
          onCancel={() => this.setState({displayConfirmDeletionPopup: false} as State)}
          leftModelName={this.props.leftModelName}
          rightModelName={this.props.rightModelName}
          relationName={this.props.relationName}
          onConfirmDeletion={this.props.onClickDeleteRelation}
        />}
      </div>
    )
  }

  private generateLeftSideForFooter = (): JSX.Element => {
    return (
      <div
        className={`f16 pointer ${this.props.isEditingExistingRelation ? 'red' : 'black50'}`}
        onClick={!this.props.isEditingExistingRelation ?
            (() => this.props.close())
            :
            (() => {
              this.setState({displayConfirmDeletionPopup: true} as State)
            })
          }
      >
        {this.props.isEditingExistingRelation ? 'Delete' : 'Cancel'}
      </div>
    )
  }

  private generateRightSideForFooterForCreatingNewRelation = (): JSX.Element => {
    return (
      <div className='flex itemsCenter'>
        <style jsx={true}>{`
            .toggleDisplayStateButton {
              @inherit: .blue, .f14, .fw6, .ttu, .pointer;
            }
          `}</style>
        <div
          className='toggleDisplayStateButton'
          onClick={() => this.props.switchDisplayState('SET_MUTATIONS')}
        >
          Set Mutations
        </div>
        <Icon
          className='ml6'
          src={require('../../assets/icons/blue_arrow_left.svg')}
          width={17}
          height={12}
          rotate={180}
        />
      </div>
    )
  }

  private generateRightSideForFooterForEditingExistingRelation = (): JSX.Element => {
    return (
      <div className='flex itemsCenter'>
        <style jsx={true}>{`
            .toggleDisplayStateButton {
              @inherit: .blue, .f14, .fw6, .ttu, .pointer;
            }
            .saveButton {
              @inherit: .white, .bgGreen, .pv10, .ph16, .f16, .pointer, .br2;
            }          `
        }</style>
        {this.props.displayState === 'SET_MUTATIONS' as RelationPopupDisplayState ?

          <div className={`flex itemsCenter ${this.props.displayConfirmBreakingChangesPopup && 'mr96'}`}>
            <Icon
              className='mr6'
              src={require('../../assets/icons/blue_arrow_left.svg')}
              width={17}
              height={12}
            />
            <div
              className='toggleDisplayStateButton'
              onClick={() => this.props.switchDisplayState('DEFINE_RELATION')}
            >
              Define Relations
            </div>
          </div>

          :

          <div className={`flex itemsCenter ${this.props.displayConfirmBreakingChangesPopup && 'mr96'}`}>
            <div
              className='toggleDisplayStateButton'
              onClick={() => this.props.switchDisplayState('SET_MUTATIONS')}
            >
              Set Mutations
            </div>
            <Icon
              className='ml6'
              src={require('../../assets/icons/blue_arrow_left.svg')}
              width={17}
              height={12}
              rotate={180}
            />
          </div>

        }
        <div
          className={`saveButton ml25 ${!this.props.canSubmit && 'o50'}`}
          onClick={
                  this.props.canSubmit &&
                  (this.props.isEditingExistingRelation ?
                    () => this.props.onClickEditRelation()
                    :
                    () => this.props.onClickCreateRelation()
                  )
                }
        >
          Save Changes
        </div>
      </div>
    )
  }
}
