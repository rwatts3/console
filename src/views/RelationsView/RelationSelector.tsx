import * as React from 'react'
import * as Relay from 'react-relay'
import {Model} from '../../types/types'
import ModelSelector from './ModelSelector'
import Icon from '../../components/Icon/Icon'

const classes: any = require('./RelationPopup.scss')
interface Props {
  viewer: any
  fieldOnLeftModelName: string
  fieldOnRightModelName: string
  fieldOnLeftModelIsList: boolean
  fieldOnRightModelIsList: boolean
  leftModelId: string
  rightModelId: string
}

interface State {

}

export default class RelationSelector extends React.Component<Props, State> {

  render() {
    return (
      <div>
        <ModelSelector
          isList={this.props.fieldOnRightModelIsList}
          onListChange={
            () => this.setState({fieldOnRightModelIsList: !this.props.fieldOnRightModelIsList} as State)
          }
          selectedModelId={this.props.leftModelId}
          onModelChange={(id) => this.setState({leftModelId: id} as State)}
          models={this.props.viewer.project.models.edges.map((edge) => edge.node)}
          fieldOnModelName={this.props.fieldOnLeftModelName}
          onFieldNameChange={(name) => this.setState({fieldOnLeftModelName: name} as State)}
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
          onListChange={
            () => this.setState({fieldOnLeftModelIsList: !this.props.fieldOnLeftModelIsList} as State)
          }
          selectedModelId={this.props.rightModelId}
          onModelChange={(id) => this.setState({rightModelId: id} as State)}
          models={this.props.viewer.project.models.edges.map((edge) => edge.node)}
          fieldOnModelName={this.props.fieldOnRightModelName}
          onFieldNameChange={(name) => this.setState({fieldOnRightModelName: name} as State)}
        />
      </div>
    )
  }
}
