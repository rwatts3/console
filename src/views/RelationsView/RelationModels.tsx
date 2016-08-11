import * as React from 'react'
import {Model} from '../../types/types'
import Icon from '../../components/Icon/Icon'
const classes: any = require('./RelationModels.scss')

interface Props {
  leftModel: Model
  rightModel: Model
}

export default class RelationModels extends React.Component<Props,{}> {
  render() {
    return (
      <span>
        <span className={classes.model}>
          {this.props.leftModel.name}
        </span>
        <span className={classes.iconContainer}>
          <Icon
            className={classes.icon}
            width={18}
            src={require('assets/new_icons/bidirectional.svg')}
          />
        </span>
        <span className={classes.model}>
          {this.props.rightModel.name}
        </span>
      </span>
    )
  }
}
