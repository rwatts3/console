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
      <div className={`${classes.root} ${classes.isMany}`}>
        <div className={classes.rootContainer}>
          <div className={classes.sizeToggle}>
            <div>One</div>
            <div className={classes.active}>Many</div>
          </div>
          <div className={classes.modelSelect}>
            <select>
              <option selected disabled>Select Model</option>
              <option value="1">Projects</option>
              <option value="1">Pokemons</option>
              <option value="1">Stuff</option>
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

  private getIsListText = (isList: boolean = this.props.isList) => {
    return isList ? 'Many' : 'One'
  }
}
