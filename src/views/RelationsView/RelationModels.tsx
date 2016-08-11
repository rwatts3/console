import * as React from 'react'
import {Model} from '../../types/types'
import Icon from '../../components/Icon/Icon'
import PropTypes = React.PropTypes
const classes: any = require('./RelationModels.scss')

interface Props {
  leftModel: Model
  rightModel: Model
  projectName: string
}

export default class RelationModels extends React.Component<Props,{}> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  context: {
    router?: any
  }

  handleClick = (modelName: string) => {
    this.context.router.replace(`/${this.props.projectName}/models/${modelName}`)
  }

  render() {
    return (
      <span>
        <span className={classes.model} onClick={() => this.handleClick(this.props.leftModel.name)}>
          {this.props.leftModel.name}
        </span>
        <span className={classes.iconContainer}>
          <Icon
            className={classes.icon}
            width={18}
            src={require('assets/new_icons/bidirectional.svg')}
          />
        </span>
        <span className={classes.model} onClick={() => this.handleClick(this.props.rightModel.name)}>
          {this.props.rightModel.name}
        </span>
      </span>
    )
  }
}
