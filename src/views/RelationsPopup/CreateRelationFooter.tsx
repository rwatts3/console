import * as React from 'react'
import {RelationPopupDisplayState} from '../../types/types'
import {Icon} from 'graphcool-styles'
import ConfirmPopup from './ConfirmPopup'

interface State {
  displayConfirmBreakingChangesPopup: boolean
  displayConfirmDeletionPopup: boolean,
}

interface Props {
  displayState: RelationPopupDisplayState
  switchDisplayState: Function
  onClickCreateRelation: Function
  onClickEditRelation: Function
  onClickDeleteRelation: Function
  canSubmit: boolean
  close: Function
  isEditingExistingRelation: boolean
  leftModelName?: string
  rightModelName?: string
  relationName?: string
  displayConfirmDeletionPopup: boolean,
}

export default class CreateRelationFooter extends React.Component<Props, State> {

  state = {
    displayConfirmBreakingChangesPopup: false,
    displayConfirmDeletionPopup: false,
  }

  constructor(props) {
    super(props)
    console.log(props.isEditingExistingRelation)
  }

  render() {
    return (
      <div className='container'>
        <style jsx={true}>{`
          .container {
            @inherit: .flex, .relative, .ph25, .pv16, .justifyBetween, .itemsCenter, .bt, .bBlack10, .bgBlack02;
            height: 77px;
          }

          .toggleDisplayStateButton {
            @inherit: .blue, .f14, .fw6, .ttu, .pointer;
          }

          .saveButton {
            @inherit: .white, .bgGreen, .pv10, .ph16, .f16, .pointer, .br2;
          }

        `}</style>
        <div
          className={`f16 pointer ${this.props.isEditingExistingRelation ? 'red' : 'black50'}`}
          onClick={!this.props.isEditingExistingRelation ?
            (() => this.props.close())
            :
            (() => {
               console.log('on click delete')
              this.setState({displayConfirmDeletionPopup: true} as State)
            })
          }
        >
          {this.props.isEditingExistingRelation ? 'Delete' : 'Cancel'}
        </div>
        {this.props.displayState === 'DEFINE_RELATION' ?
          (
            <div className='flex itemsCenter'>
              <div
                className='toggleDisplayStateButton'
                onClick={() => this.props.switchDisplayState('SET_MUTATION')}
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
          :
          (
            <div className='flex itemsCenter'>
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
                {this.props.isEditingExistingRelation ? 'Save Changes' : 'Create Relation'}
              </div>
            </div>
          )
        }
        {this.state.displayConfirmBreakingChangesPopup && <ConfirmPopup
          red={false}
          onCancel={() => this.setState({displayConfirmBreakingChangesPopup: false} as State)}
          leftModelName={this.props.leftModelName}
          rightModelName={this.props.rightModelName}
          onConfirmBreakingChanges={this.props.onClickEditRelation}
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
}
