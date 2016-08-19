import * as React from 'react'
import Popup from '../../../../components/Popup/Popup'
import Icon from '../../../../components/Icon/Icon'
import ScrollBox from '../../../../components/ScrollBox/ScrollBox'
import {getScalarEditCell, CellRequirements} from './cellgenerator'
import {TypedValue} from '../../../../types/utils'
import {atomicValueToString} from '../../../../utils/valueparser'
import {Field} from '../../../../types/types'
import {classnames} from '../../../../utils/classnames'
const classes: any = require('./ScalarListCell.scss')

interface State {
  values: TypedValue[]
  isEditing: boolean
  filter: string
  newValue: string
  valuesEdited: boolean
}

export default class ScalarListCell extends React.Component<CellRequirements, State> {

  private atomicField: Field = Object.assign({}, this.props.field, {isList: false})

  constructor(props: CellRequirements) {
    super(props)
    this.state = {
      isEditing: false,
      filter: '',
      newValue: null,
      values: this.props.value.slice(),
      valuesEdited: false,
    }
  }

  render() {
    const requirements: CellRequirements = {
      value: this.state.newValue,
      field: this.atomicField,
      projectId: this.props.projectId,
      nodeId: this.props.nodeId,
      methods: {
        save: this.handleNewValueChange,
        cancel: this.props.methods.cancel,
        onKeyDown: this.props.methods.onKeyDown,
      },
    }
    return (
      <Popup height='80%' onClickOutside={this.props.methods.cancel}>
        <div className={classes.root}>
          <div className={classes.header}>
            <div className={classes.filter}>
              <Icon
                src={require('assets/new_icons/search.svg')}
                width={30}
                height={30}
              />
              <input
                type='text'
                placeholder='Filter...'
                value={this.state.filter}
                onChange={(e) => null}
              />
            </div>
          </div>
          <div className={classes.list}>
            <ScrollBox>
              <div
                className={classes.item}
                onClick={ () => this.setState({isEditing: true} as State)}
              >
                {this.state.isEditing && getScalarEditCell(requirements)}
                {!this.state.isEditing && (
                  <span>
                      {this.state.newValue ? this.state.newValue : 'Add new item ...'}
                  </span>
                )}
                <Icon
                  onClick={this.addNewValue}
                  src={require('assets/new_icons/add_new.svg')}
                  width={14}
                  height={14}
                />
              </div>
              {this.props.value.map((value, index) => (
                <div
                  key={index}
                  className={classnames(classes.item, classes.existing)}
                  onClick={() => null}
                >
                  <div>{atomicValueToString(value, this.props.field, true)}</div>
                  <Icon
                    src={require('assets/new_icons/remove.svg')}
                    width={14}
                    height={14}
                    onClick={() => this.handleDeleteValue(index)}
                  />
                </div>
              ))}
            </ScrollBox>
          </div>
          <div className={classes.footer}>
            <div className={classes.savedIndicator}>
              {this.state.valuesEdited ? 'All changes saved' : ''}
            </div>
            <div className={classes.close} onClick={() => this.props.methods.cancel()}>
              Close
            </div>
          </div>
        </div>
      </Popup>
    )
  }

  private handleDeleteValue = (index: number) => {
    const result = this.state.values.slice(0)
    result.splice(index, 1)
    this.setState({
      values: result,
      valuesEdited: true,
    } as State)
    this.props.methods.save(result, true)
  }

  private handleNewValueChange = (value: TypedValue) => {
    this.setState({newValue: value, isEditing: true} as State)
  }

  private addNewValue = () => {
    const current = this.state.values.slice(0)
    current.push(this.state.newValue)
    this.setState({
      newValue: '',
      valuesEdited: true,
      values: current,
    } as State)
    this.props.methods.save(current, true)
  }
}
