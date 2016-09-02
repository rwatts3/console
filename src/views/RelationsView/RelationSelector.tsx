import * as React from 'react'
import * as Relay from 'react-relay'
import {Model} from '../../types/types'
import ModelSelector from './ModelSelector'
import Icon from '../../components/Icon/Icon'

const classes: any = require('./RelationPopup.scss')
interface Props {
  models: Model[]
  fieldOnLeftModelName: string
  fieldOnRightModelName: string
  fieldOnLeftModelIsList: boolean
  fieldOnRightModelIsList: boolean
  leftModelId: string
  rightModelId: string
  onFieldOnLeftModelNameChange: (value: string) => void
  onFieldOnRightModelNameChange: (value: string) => void
  onFieldOnLeftModelIsListChange: (value: boolean) => void
  onFieldOnRightModelIsListChange: (value: boolean) => void
  onLeftModelIdChange: (value: string) => void
  onRightModelIdChange: (value: string) => void
}

interface State {

}

export default class RelationSelector extends React.Component<Props, State> {

  render() {
    return (
      <div>
        <ModelSelector
          isList={this.props.fieldOnRightModelIsList}
          onListChange={() => this.props.onFieldOnRightModelIsListChange(!this.props.fieldOnRightModelIsList)}
          selectedModelId={this.props.leftModelId}
          onModelChange={(id) => this.props.onLeftModelIdChange(id)}
          models={this.props.models}
          fieldOnModelName={this.props.fieldOnLeftModelName}
          onFieldNameChange={(name) => this.props.onFieldOnLeftModelNameChange(name)}
        />
        <span className={classes.iconContainer}>
          <Icon
            className={classes.icon}
            width={18}
            src={require('assets/new_icons/bidirectional.svg')}
          />
        </span>
        <ModelSelector
          isList={this.props.fieldOnLeftModelIsList}
          onListChange={() => this.props.onFieldOnLeftModelIsListChange(!this.props.fieldOnLeftModelIsList)}
          selectedModelId={this.props.rightModelId}
          onModelChange={(id) => this.props.onRightModelIdChange(id)}
          models={this.props.models}
          fieldOnModelName={this.props.fieldOnRightModelName}
          onFieldNameChange={(name) => this.props.onFieldOnLeftModelNameChange(name)}
        />
      </div>
    )
  }
}
