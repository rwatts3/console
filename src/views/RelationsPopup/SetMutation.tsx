import * as React from 'react'
import {Relation} from '../../types/types'
import Icon from 'graphcool-styles/dist/components/Icon/Icon'
import MutationsInfoBox from './MutationsInfoBox'

interface State {
  isEnteringRelationName: boolean
  isEnteringRelationDescription: boolean
  relationName: string
  relationDescription: string
}

interface Props {
  relation?: Relation
}

export default class SetMutation extends React.Component<Props, State> {

  state = {
    isEnteringRelationName: true,
    isEnteringRelationDescription: false,
    relationName: this.props.relation ? this.props.relation.name : '',
    relationDescription: this.props.relation ? this.props.relation.description : '',
  }

  render() {

    const {isEnteringRelationName, isEnteringRelationDescription, relationName, relationDescription} = this.state

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
            @inherit: .f16;
          }
        `}</style>
        {isEnteringRelationName ?
          (
            <input
              className='relationNameInputField'
              autoFocus={true}
              placeholder='Set a name for the relation...'
              value={this.state.relationName}
              onKeyDown={this.handleKeyDown}
              onChange={(e: any) => this.setState({relationName: e.target.value} as State)}
            />
          )
          :
          (
            <div className='ph25 f38 fw3 black50'>{relationName}</div>
          )
        }
        {isEnteringRelationDescription ?
          (
            <input
              className='descriptionInputField ph25'
              autoFocus={true}
              placeholder='Set a description for the relation...'
              value={this.state.relationName}
              onKeyDown={this.handleKeyDown}
              onChange={(e: any) => this.setState({relationName: e.target.value} as State)}
            />
          )
          :
          relationDescription.length === 0 && (
            <div className='flex itemsCenter mv25 ph25'>
              <Icon
                src={require('../../assets/icons/edit_circle_gray.svg')}
                width={26}
                height={26}
              />
              <div className='f16 black50 ml16'>add description </div>
            </div>
          ) ||
          relationDescription.length > 0 && (<div className='f16 black50'>{relationDescription}</div>)
        }
        <MutationsInfoBox/>
      </div>
    )
  }

  private handleKeyDown = (e) => {
    if (e.keyCode === 13) {
    } else if (e.keyCode === 27) {
      this.setState({
      } as State)
    }
  }

}
