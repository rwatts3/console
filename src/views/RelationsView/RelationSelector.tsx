import * as React from 'react'
import {Model} from '../../types/types'
import ModelSelector from './ModelSelector'
import {classnames} from '../../utils/classnames'

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

export default class RelationSelector extends React.Component<Props, {}> {

  render() {
    const hasFields = this.props.leftModelId && this.props.rightModelId
    return (
      <div className={classes.root}>
        <ModelSelector
          isList={this.props.fieldOnRightModelIsList}
          onListChange={(value) => this.props.onFieldOnRightModelIsListChange(value)}
          selectedModelId={this.props.leftModelId}
          onModelChange={(id) => this.props.onLeftModelIdChange(id)}
          models={this.props.models}
        />
        <div className={classnames(classes.relationArrows, hasFields ? classes.hasFields : '')}>
          <div className={classnames(classes.relationArrow, classes.pointsRight)}>
            {hasFields &&
            <div className={classes.relationFieldInput}>
              <label>via field</label>
              <input
                type='text'
                value={this.props.fieldOnLeftModelName}
                onChange={(e: any) => this.props.onFieldOnLeftModelNameChange(e.target.value)}
              />
            </div>
            }

            <div className={classes.relationArrowBase}/>

          </div>
          <div className={classnames(classes.relationArrow, classes.pointsLeft)}>
            <div className={classnames(classes.relationArrowBase)}/>
            {hasFields &&
            <div className={classes.relationFieldInput}>
              <label>via field</label>
              <input
                type='text'
                value={this.props.fieldOnRightModelName}
                onChange={(e: any) => this.props.onFieldOnRightModelNameChange(e.target.value)}
              />
            </div>
            }
          </div>
        </div>
        <ModelSelector
          isDisabled={!this.props.leftModelId}
          isList={this.props.fieldOnLeftModelIsList}
          onListChange={(value) => this.props.onFieldOnLeftModelIsListChange(value)}
          selectedModelId={this.props.rightModelId}
          onModelChange={(id) => this.props.onRightModelIdChange(id)}
          models={this.props.models}
        />
      </div>
    )
  }
}
