import * as React from 'react'
import * as Relay from 'react-relay'
import { findDOMNode } from 'react-dom'
import Loading from '../../../components/Loading/Loading'
import { classnames } from '../../../utils/classnames'
import { valueToString, stringToValue } from '../../../utils/valueparser'
import { Field } from '../../../types/types'
import ModelSelector from '../../../components/ModelSelector/ModelSelector'
import RelationsPopup from './RelationsPopup'
import { CellRequirements, getEditCell } from './Cell/cellgenerator'
const classes: any = require('./Cell.scss')

export type UpdateCallback = (success: boolean) => void

interface Props {
  field: Field
  projectId: string
  itemId: string
  value: any
  width: number
  update: (value: any, field: Field, callback: UpdateCallback) => void
  reload: () => void
}

interface State {
  editing: boolean
  loading: boolean
}

class Cell extends React.Component<Props, State> {

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
    if (!prevState.editing && this.state.editing && this.refs.input) {
      findDOMNode<HTMLInputElement>(this.refs.input).select()
    }
  }

  _startEditing(): void {
    if (this.props.field.name !== 'id') {
      this.setState({editing: true} as State)
    }
  }

  _cancel(shouldReload: boolean = false): void {
    this.setState({editing: false} as State)
    if (shouldReload) {
      this.props.reload()
    }
  }

  _save(value: any): void {
    if (value === null) {
      alert(`'${valueToString(value, this.props.field, true)}' is not a valid value for field ${this.props.field.name}`)
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

  _onKeyDown(e: React.KeyboardEvent<HTMLSelectElement | HTMLInputElement>): void {
    switch (e.keyCode) {
      case 13:
        this._save(stringToValue(e.target.value, this.props.field))
        break
      case 27:
        this._cancel()
        break
    }
  }

  _onEscapeTextarea(e: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.keyCode === 27) {
      this._save(stringToValue(e.target.value, this.props.field))
    }
  }

  _renderContent(): JSX.Element {
    if (this.state.loading) {
      return (
        <div className={classes.loading}>
          <Loading color='#B9B9C8'/>
        </div>
      )
    }

    if (this.state.editing) {
      let pack: CellRequirements = {
        field: this.props.field,
        value: this.props.value,
        projectId: this.props.projectId,
        itemId: this.props.itemId,
        methods: {
          save: this._save.bind(this),
          onKeyDown: this._onKeyDown.bind(this),
          cancel: this._cancel.bind(this),
          onEscapeTextarea: this._onEscapeTextarea.bind(this),
        },
      }
      return getEditCell(pack)
    }

    const valueString = valueToString(this.props.value, this.props.field, true)
    return (
      <span className={classes.value}>{valueString}</span>
    )
  }

  render(): JSX.Element {
    const rootClassnames = classnames({
      [classes.root]: true,
      [classes.null]: this.props.value === null,
      [classes.editing]: this.state.editing,
    })

    return (
      <div
        style={{ flex: `1 0 ${this.props.width}px` }}
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
                typeIdentifier
                enumValues
                relatedModel {
                    ${ModelSelector.getFragment('relatedModel')}
                }
                ${RelationsPopup.getFragment('originField')}
            }
        `,
    },
})
