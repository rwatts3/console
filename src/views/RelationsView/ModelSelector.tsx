import * as React from 'react'
import {Model} from '../../types/types'
const classes = require('./ModelSelector.scss')

interface Props {
  isList: boolean
  onListChange: () => void
  models: Model[]
  selectedModelId: string
  onModelChange: (modelId: string) => void
  fieldOnModelName: string
  onFieldNameChange: (name: string) => void
}

export default class ModelSelector extends React.Component<Props,{}> {

  render() {
    return (
      <span className={classes.root}>
        <a onClick={this.props.onListChange}>{this.getIsListText()}</a>
        <span className={classes.model}>
          <select onChange={(e) => this.props.onModelChange(e.target.value)}>
            <option selected={this.props.selectedModelId === null} disabled={true}>Select a Model ▾</option>
            {this.props.models.map((model) => (
              <option selected={this.props.selectedModelId === model.id}
                      key={model.id}
                      value={model.id}>
                {this.props.isList ? `[${model.name}]` : model.name}
              </option>
            ))}
          </select>
          <span>
            <div>
              <span className={classes.fieldTitle}>
                In Field:
              </span>
              <input value={this.props.fieldOnModelName}
                     type='text' placeholder='_______________'
                     onChange={(e) => this.props.onFieldNameChange(e.target.value)}
              />
            </div>
          </span>

        </span>
      </span>
    )
  }

  private getIsListText = (isList: boolean = this.props.isList) => {
    return isList ? 'Many' : 'One'
  }
}
