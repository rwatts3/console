import * as React from 'react'
import {Relation, Cardinality, Model} from '../../types/types'
import Icon from 'graphcool-styles/dist/components/Icon/Icon'
import MutationsInfoBox from './MutationsInfoBox'

interface State {
  isEnteringRelationName: boolean
  isHoveringRelationName: boolean
  isEnteringRelationDescription: boolean
  isHoveringRelationDescription: boolean
}

interface Props {
  relationName: string
  relationDescription?: string
  onChangeRelationNameInput: Function
  onChangeRelationDescriptionInput: Function
  leftSelectedModel: Model | null
  rightSelectedModel: Model | null
  selectedCardinality: Cardinality | null
  fieldOnLeftModelName: string | null
  fieldOnRightModelName: string | null
}

export default class SetMutation extends React.Component<Props, State> {

  state = {
    isEnteringRelationName: true,
    isHoveringRelationName: false,
    isEnteringRelationDescription: false,
    isHoveringRelationDescription: false,
  }

  render() {

    const {isEnteringRelationName, isEnteringRelationDescription} = this.state
    const {relationName, relationDescription} = this.props

    return (
      <div className='container'>
        <style jsx={true}>{`

          .container {
            @inherit: .ph16, .pt38, .bgWhite;
          }

          .relationNameInputField {
            @inherit: .f38, .fw3, .w100, .ph25;
            color: rgba(42,127,211,1);
          }

          .descriptionInputField {
            @inherit: .f16, .w100, .ph25;
            color: rgba(42,127,211,1);
          }

        `}</style>
        {isEnteringRelationName || relationName.length === 0 ?
          (
            <div className='flex itemsCenter pr38'>
              <input
                className='relationNameInputField'
                autoFocus={true}
                placeholder='Set a name for the relation...'
                value={relationName}
                onKeyDown={this.handleKeyDownOnRelationName}
                onChange={(e: any) => {
                  this.props.onChangeRelationNameInput(e.target.value)
                  this.setState(
                    {
                    isEnteringRelationName: true,
                  } as State,
                  )
                }}
                onFocus={() =>
                  this.setState({
                    isEnteringRelationDescription: false,
                  } as State)
                }
              />
              <div className='flex itemsCenter'>
                <Icon
                  className='mh10 pointer'
                  src={require('../../assets/icons/cross_red.svg')}
                  width={15}
                  height={15}
                  onClick={() => {
                    this.props.onChangeRelationNameInput('')
                    this.setState({
                      isEnteringRelationName: false,
                    } as State)
                    }
                  }
                />
                <Icon
                  className='mh10 pointer'
                  src={require('../../assets/icons/confirm.svg')}
                  width={35}
                  height={35}
                  onClick={() =>
                    this.setState({
                      isEnteringRelationName: false,
                    } as State)
                  }
                />
              </div>
            </div>
          )
          :
          (
            <div
              className='flex itemsCenter pointer'
              onMouseEnter={() => this.setState({isHoveringRelationName: true} as State)}
              onMouseLeave={() => this.setState({isHoveringRelationName: false} as State)}
              onClick={() => this.setState({
                    isEnteringRelationName: true,
                    isHoveringRelationName: false,
                  } as State)}
            >
              <div className='ph25 f38 fw3 black80'>{relationName}</div>
              {this.state.isHoveringRelationName && (<Icon
                className='ml6'
                src={require('../../assets/icons/edit_project_name.svg')}
                width={20}
                height={20}
              />)}
            </div>
          )
        }
        {isEnteringRelationDescription ?
          (
            <div className='flex itemsCenter mv25'>
              <input
                className='descriptionInputField ph25'
                autoFocus={true}
                placeholder='Write a short description for the relation...'
                value={relationDescription}
                onKeyDown={this.handleKeyDownOnRelationDescription}
                onChange={(e: any) =>
                  this.props.onChangeRelationDescriptionInput(e.target.value)
                }
                onFocus={() =>
                  this.setState({
                    isEnteringRelationName: false,
                  } as State)
                }
              />
            </div>
          )
          :
          (relationDescription === null || relationDescription.length === 0) && (
            <div
              className='flex itemsCenter mv25 ph25 pointer'
              onClick={() => this.setState({
                isEnteringRelationDescription: true,
              } as State)}
            >
              <Icon
                src={require('../../assets/icons/edit_circle_gray.svg')}
                width={26}
                height={26}
              />
              <div className='f16 black40 ml16'>
                add description
                <span className='black30'> (optional)</span>
              </div>
            </div>
          ) ||
          relationDescription.length > 0 && (
            <div
              className='flex itemsCenter pointer'
              onMouseEnter={() => this.setState({isHoveringRelationDescription: true} as State)}
              onMouseLeave={() => this.setState({isHoveringRelationDescription: false} as State)}
              onClick={() => this.setState({
                    isEnteringRelationDescription: true,
                    isHoveringRelationDescription: false,
                  } as State)}
            >
              <div className='f16 black50 mv25 pl25 pr6'>{relationDescription}</div>
              {this.state.isHoveringRelationDescription && (<Icon
                className='ml6'
                src={require('../../assets/icons/edit_project_name.svg')}
                width={20}
                height={20}
              />)}
            </div>
          )
        }
        {this.props.leftSelectedModel && this.props.rightSelectedModel &&
        <MutationsInfoBox
          selectedCardinality={this.props.selectedCardinality}
          relationName={this.props.relationName}
          leftSelectedModel={this.props.leftSelectedModel}
          rightSelectedModel={this.props.rightSelectedModel}
          fieldOnLeftModelName={this.props.fieldOnLeftModelName}
          fieldOnRightModelName={this.props.fieldOnRightModelName}
        />
        }
      </div>
    )
  }

  private handleKeyDownOnRelationName = (e) => {
    if (e.keyCode === 13) {
      this.setState({
        isEnteringRelationName: false,
      } as State)
    } else if (e.keyCode === 27) {
      this.setState({
        isEnteringRelationName: false,
      } as State)
    }
  }

  private handleKeyDownOnRelationDescription = (e) => {
    if (e.keyCode === 13) {
      this.setState({
        isEnteringRelationDescription: false,
      } as State)
    } else if (e.keyCode === 27) {
      this.setState({
        isEnteringRelationDescription: false,
      } as State)
    }
  }

}
