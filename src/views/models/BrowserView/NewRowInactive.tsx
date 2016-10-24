import * as React from 'react'
import {connect} from 'react-redux'
import {toggleNewRow} from '../../../actions/databrowser/ui'
import {Model, Field} from '../../../types/types'
import Icon from '../../../components/Icon/Icon'
import {classnames} from '../../../utils/classnames'
const classes: any = require('./NewRowInactive.scss')

interface Props {
  columnWidths: {[key: string]: number}
  model: Model
  toggleNewRow: (fields: Field[]) => any
  height: number
}

interface State {
  active: boolean
}

class NewRowInactive extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {
      active: this.isActive(),
    }
  }

  componentDidMount() {
    this.setActive()
  }

  componentDidReceiveProps() {
    this.setActive()
  }

  render() {
    const fields = this.props.model.fields.edges
      .map((edge) => edge.node)

    return (
      <div className={classnames(classes.root, {
        [classes.active]: this.state.active,
      })} onClick={() => this.toggleNewRow(fields)}>
        {fields.map(function(field, index) {
          return (
            <div
              key={field.id}
              style={{
                width: this.props.columnWidths[field.name] + (index === fields.length - 1 ? 1 : 0),
                height: this.props.height,
              }}
              className={classnames(classes.cell, {
                [classes.last]: index === fields.length - 1,
              })}
              onKeyDown={this.handleKeyDown}
            >
              {index === 0 && (
                <div className={classes.add}>
                  <Icon
                    width={12}
                    height={12}
                    src={require('assets/new_icons/add-plain.svg')}
                  />
                  <span>add new node ...</span>
                </div>
              )}
            </div>
          )
        }.bind(this))}
        <div
          style={{
                width: 250,
                height: this.props.height,
              }}
          className={classes.loading}
        >
          <div></div>
        </div>
      </div>
    )
  }

  private isActive = () => {
    const { model } = this.props
    const BLACKLIST = ['User', 'File']
    return (!model.isSystem && !BLACKLIST.includes(model.name))
  }

  private setActive = () => {
    const active = this.isActive()

    this.setState({
      active,
    })
  }

  private toggleNewRow = (fields: Field[]) => {
    // TODO get isSystem properly from the system api
    if (this.state.active) {
      console.log('toggling')
      this.props.toggleNewRow(fields)
    }
  }

}
export default connect(null, {
  toggleNewRow,
})(NewRowInactive)
