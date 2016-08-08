import * as React from 'react'
import * as Relay from 'react-relay'
import { Model } from '../../types/types'
import { isScalar } from '../../utils/graphql'
import { Lokka } from 'lokka'
import { Transport } from 'lokka-transport-http'
import * as cookiestore from '../../utils/cookiestore'
import {ScalarValue} from '../../types/utils'
const ClickOutside: any = (require('react-click-outside') as any).default
const Autocomplete: any = require('react-autocomplete')
const classes: any = require('./ModelSelector.scss')

interface Props {
  projectId: string
  value: string
  relatedModel: Model
  onSelect: (value: string) => void
  onCancel: () => void
  onFocus?: () => void
}

interface State {
  items: any[]
  value: string
}

class ModelSelector extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props)

    this.state = {
      items: [],
      value: props.value || '',
    }

    const clientEndpoint = `${__BACKEND_ADDR__}/simple/v1/${props.projectId}`
    const token = cookiestore.get('graphcool_token')
    const headers = { Authorization: `Bearer ${token}` }
    const transport = new Transport(clientEndpoint, { headers })
    const lokka = new Lokka({ transport })

    const fieldNames = props.relatedModel.fields.edges
      .map(({ node }) => node)
      .map((field) => isScalar(field.typeIdentifier)
        ? field.name
        : `${field.name} { id }`)
      .join(' ')
    const query = `
      {
        all${props.relatedModel.namePlural} {
          ${fieldNames}
        }
      }
    `

    lokka.query(query)
      .then((results) => {
        const items = results[`all${props.relatedModel.namePlural}`]
        this.setState({ items } as State)
      })
  }

  componentWillReceiveProps (nextProps: Props) {
    this.setState({ value: nextProps.value } as State)
  }

  _onFocus = () => {
    if (this.props.onFocus) {
      this.props.onFocus()
    }
  }

  _renderItem = (item, isHighlighted) => {
    return (
      <div
        key={item.id}
        className={`${classes.row} ${isHighlighted ? classes.highlighted : ''}`}
      >
        {JSON.stringify(item, null, 1)}
      </div>
    )
  }

  _shouldItemRender = (item, value) => {
    return this.props.relatedModel.fields.edges
      .map((edge) => edge.node)
      .filter((field) => isScalar(field.typeIdentifier) && item[field.name])
      .some((field) => item[field.name].toString().toLowerCase().includes(value))
  }

  render () {
    return (
      <ClickOutside
        onClickOutside={this.props.onCancel}
        style={{ width: '100%' }}
      >
        <Autocomplete
          wrapperProps={{ className: classes.wrapper }}
          menuStyle={{
            padding: 0,
            position: 'absolute',
            maxHeight: 300,
            top: '100%',
            left: 0,
            background: '#fff',
            overflow: 'auto',
            zIndex: 100,
          }}
          value={this.state.value}
          items={this.state.items}
          shouldItemRender={this._shouldItemRender}
          inputProps={{autoFocus: true }}
          getItemValue={(item: ScalarValue) => item}
          onChange={(event, value) => this.setState({ value } as State)}
          onSelect={(value) => this.props.onSelect(value)}
          renderItem={this._renderItem}
        />
      </ClickOutside>
    )
  }
}

export default Relay.createContainer(ModelSelector, {
  fragments: {
    relatedModel: () => Relay.QL`
      fragment on Model {
        id
        namePlural
        fields(first: 1000) {
          edges {
            node {
              typeIdentifier
              name
            }
          }
        }
      }
    `,
  },
})
