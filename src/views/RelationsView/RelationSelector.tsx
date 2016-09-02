import * as React from 'react'
import * as Relay from 'react-relay'
import {Model} from '../../types/types'
import ModelSelector from './ModelSelector'
import Icon from '../../components/Icon/Icon'

const classes: any = require('./RelationSelector.scss')
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
      <div className={classes.root}>
        <ModelSelector
          isList={this.props.fieldOnRightModelIsList}
          onListChange={() => this.props.onFieldOnRightModelIsListChange(!this.props.fieldOnRightModelIsList)}
          selectedModelId={this.props.leftModelId}
          onModelChange={(id) => this.props.onLeftModelIdChange(id)}
          models={this.props.models}
          fieldOnModelName={this.props.fieldOnLeftModelName}
          onFieldNameChange={(name) => this.props.onFieldOnLeftModelNameChange(name)}
        />
        <div className={`${classes.relationArrows} ${classes.hasFields}`}>
          <div className={`${classes.relationArrow} ${classes.pointsRight}`}>
            <div className={classes.relationFieldInput}>
              <label>via field</label><input type="text" value="categories" />
            </div>

            <div className={`${classes.relationArrowBase}`}/>

          </div>
          <div className={`${classes.relationArrow} ${classes.pointsLeft}`}>
            <div className={`${classes.relationArrowBase}`}/>
            <div className={classes.relationFieldInput}>
              <label>via field</label><input type="text" value="projects" />
            </div>

          </div>
        </div>
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
