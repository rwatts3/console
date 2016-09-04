import * as React from 'react'
import {Model} from '../../types/types'
import Icon from '../../components/Icon/Icon'
import PropTypes = React.PropTypes
const classes: any = require('./RelationModels.scss')

interface Props {
  leftModel: Model
  leftModelIsList: boolean
  rightModel: Model
  rightModelIsList: boolean
  projectName: string
}

export default class RelationModels extends React.Component<Props,{}> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  context: {
    router?: any
  }

  render() {
    return (
      <span>
        <span className={classes.model} onClick={(e) => this.handleClick(e, this.props.leftModel.name)}>
          {this.props.rightModelIsList ? `[${this.props.leftModel.name}]` : this.props.leftModel.name}
        </span>
        <span className={classes.iconContainer}>
          <Icon
            className={classes.icon}
            width={18}
            src={require('assets/new_icons/bidirectional.svg')}
          />
        </span>
        <span className={classes.model} onClick={(e) => this.handleClick(e, this.props.rightModel.name)}>
          {this.props.leftModelIsList ? `[${this.props.rightModel.name}]` : this.props.rightModel.name}
        </span>
      </span>
    )
  }

  private handleClick = (e: any, modelName: string) => {
    e.preventDefault()
    e.stopPropagation()
    this.context.router.push(`/${this.props.projectName}/models/${modelName}`)
  }
}
