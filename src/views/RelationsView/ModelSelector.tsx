import * as React from 'react'
import {Model} from '../../types/types'
import {classnames} from '../../utils/classnames'
const classes = require('./ModelSelector.scss')

interface Props {
  isDisabled?: boolean
  isList: boolean
  onListChange: (value: boolean) => void
  models: Model[]
  selectedModelId: string
  onModelChange: (modelId: string) => void
}

export default class ModelSelector extends React.Component<Props,{}> {

  render() {
    return (
      <div className={
        classnames(classes.root, this.props.isList ? classes.isMany : '', this.props.isDisabled ? classes.disabled : '')
      }>
        <div className={classes.rootContainer}>
          <div className={classes.sizeToggle}>
            <div
              onClick={() => this.props.onListChange(false)}
              className={!this.props.isList ? classes.active : ''}
            >
              One
            </div>
            <div
              onClick={() => this.props.onListChange(true)}
              className={this.props.isList ? classes.active : ''}
            >
                Many
            </div>
          </div>
          <div className={classes.modelSelect}>
            <select
              value={this.props.selectedModelId ? this.props.selectedModelId : 'default value'}
              onChange={(e: any) => this.props.onModelChange(e.target.value)}
            >
              <option value={'default value'} disabled>Select Model</option>
              {this.props.models.sort(this.modelCompare).map((model) => (
                <option key={model.id} value={model.id}>{this.props.isList ? model.namePlural : model.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    )
  }

  private modelCompare(a: Model, b: Model) {
    if (a.name < b.name) {
      return -1
    }
    if (a.name > b.name) {
      return 1
    }
    return 0
  }
}
