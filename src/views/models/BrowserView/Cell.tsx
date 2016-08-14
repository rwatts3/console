import * as React from 'react'
import * as Relay from 'react-relay'
import {findDOMNode} from 'react-dom'
import Loading from '../../../components/Loading/Loading'
import {classnames} from '../../../utils/classnames'
import {valueToString, stringToValue} from '../../../utils/valueparser'
import {Field} from '../../../types/types'
import NodeSelector from '../../../components/NodeSelector/NodeSelector'
import RelationsPopup from './RelationsPopup'
import {CellRequirements, getEditCell} from './Cell/cellgenerator'
import {TypedValue, ShowNotificationCallback} from '../../../types/utils'
import {isNonScalarList} from '../../../utils/graphql'
const classes: any = require('./Cell.scss')

export type UpdateCallback = (success: boolean) => void

interface Props {
  field: Field
  projectId: string
  nodeId: string
  value: any
  width: number
  update: (value: any, field: Field, callback: UpdateCallback) => void
  reload: () => void,
  addnew: boolean
}

interface State {
  editing: boolean
  loading: boolean
}

class Cell extends React.Component<Props, State> {

  static contextTypes = {
    showNotification: React.PropTypes.func.isRequired,
  }

  context: {
    showNotification: ShowNotificationCallback
  }

  refs: {
    [key: string]: any;
    input: HTMLInputElement
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      editing: false,
      loading: false,
    }
  }

  componentDidUpdate(prevState: State): void {
    // To enable dropdowns for <select>
    if (!prevState.editing && this.state.editing && this.refs.input) {
      findDOMNode<HTMLInputElement>(this.refs.input).select()
    }
  }

  _startEditing(): void {
    if (this.props.field.name !== 'id') {
      this.setState({editing: true} as State)
    }
  }

  _cancel = (shouldReload: boolean = false): void => {
    this.setState({editing: false} as State)
    if (shouldReload) {
      this.props.reload()
    }
  }

  _save = (value: TypedValue): void => {
    if (this.props.field.isRequired && value === null) {
      this.context.showNotification(
        `'${valueToString(value, this.props.field, true)}' is not a valid value for field ${this.props.field.name}`,
        'error'
      )
      this.setState({editing: false} as State)
      return
    }

    if (value === this.props.value) {
      this.setState({editing: false} as State)
      return
    }

    this.setState({loading: true} as State)
    this.props.update(value, this.props.field, () => {
      this.setState({
        editing: false,
        loading: false,
      } as State)
    })
  }

  _onKeyDown = (e: React.KeyboardEvent<HTMLSelectElement | HTMLInputElement>): void => {
    switch (e.keyCode) {
      case 13:
        this._save(stringToValue(e.target.value, this.props.field))
        break
      case 27:
        this._cancel()
        break
    }
  }

  _onEscapeTextarea = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.keyCode === 27) {
      this._save(stringToValue(e.target.value, this.props.field))
    }
  }

  _renderNew = (): JSX.Element => {
    const invalidStyle = classnames([classes.value, classes.id])
    if (this.props.field.name === 'id') {
      return (
        <span className={invalidStyle}>Id will be generated</span>
      )
    }

    if (isNonScalarList(this.props.field)) {
      return (
        <span className={invalidStyle}>Should be added later</span>
      )
    }

    return this._renderExisting()
  }

  _renderExisting = (): JSX.Element => {
    if (this.state.editing) {
      const reqs: CellRequirements = {
        field: this.props.field,
        value: this.props.value,
        projectId: this.props.projectId,
        nodeId: this.props.nodeId,
        methods: {
          save: this._save,
          onKeyDown: this._onKeyDown,
          cancel: this._cancel,
          onEscapeTextarea: this._onEscapeTextarea,
        },
      }
      return getEditCell(reqs)
    }
    const valueString = valueToString(this.props.value, this.props.field, true)
    return (
      <span className={classes.value}>{valueString}</span>
    )
  }

  _renderContent(): JSX.Element {

    if (this.state.loading) {
      return (
        <div className={classes.loading}>
          <Loading color='#B9B9C8'/>
        </div>
      )
    }

    if (this.props.addnew) {
      return this._renderNew()
    } else {
      return this._renderExisting()
    }
  }

  render(): JSX.Element {
    const rootClassnames = classnames({
      [classes.root]: true,
      [classes.null]: this.props.value === null,
      [classes.editing]: this.state.editing,
    })

    return (
      <div
        style={{ flex: `1 0 ${this.props.width}px`, justifyContent: 'center', alignItems: 'center' }}
        className={rootClassnames}
        onDoubleClick={() => this._startEditing()}
      >
        {this._renderContent()}
      </div>
    )
  }
}

export default Relay.createContainer(Cell, {
    fragments: {
        field: () => Relay.QL`
            fragment on Field {
                id
                name
                isList
                isRequired
                typeIdentifier
                enumValues
                relatedModel {
                    ${NodeSelector.getFragment('relatedModel')}
                }
                ${RelationsPopup.getFragment('originField')}
            }
        `,
    },
})
