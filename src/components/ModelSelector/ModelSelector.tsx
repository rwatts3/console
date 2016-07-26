import * as React from 'react'
import * as Relay from 'react-relay'
import { Model } from '../../types/types'
import { isScalar } from '../../utils/graphql'
import { Lokka } from 'lokka'
import { Transport } from 'lokka-transport-http'
import * as cookiestore from '../../utils/cookiestore'
const Autocomplete: any = require('react-autocomplete')
const classes: any = require('./ModelSelector.scss')

interface Props {
  projectId: string
  value: string
  model: Model
  select: (value: string) => void
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
      value: props.value,
    }

    const clientEndpoint = `${__BACKEND_ADDR__}/simple/v1/${props.projectId}`
    const token = cookiestore.get('graphcool_token')
    const headers = { Authorization: `Bearer ${token}` }
    const transport = new Transport(clientEndpoint, { headers })
    const lokka = new Lokka({ transport })

    const fieldNames = props.model.fields.edges
      .map(({ node }) => node)
      .map((field) => isScalar(field.typeIdentifier)
        ? field.name
        : `${field.name} { id }`)
      .join(' ')
    const query = `
      {
        all${props.model.namePlural} {
          ${fieldNames}
        }
      }
    `

    lokka.query(query)
      .then((results) => {
        const items = results[`all${props.model.namePlural}`]
        this.setState({ items } as State)
      })
  }

  _renderItem = (item, isHighlighted) => {
    return (
      <div
        key={item.id}
        className={`${classes.row} ${isHighlighted ? classes.highlighted : ''}`}
      >
        {JSON.stringify(item)}
      </div>
    )
  }

  _shouldItemRender = (item, value) => {
    return this.props.model.fields.edges.some(({ node }) => item[node.name].toLowerCase().includes(value))
  }

  render() {
    return (
      <Autocomplete
        value={this.state.value}
        items={this.state.items}
        shouldItemRender={this._shouldItemRender}
        inputProps={{ autoFocus: true }}
        getItemValue={(item) => item.id}
        onChange={(event, value) => this.setState({ value } as State)}
        onSelect={(value) => this.props.select(value)}
        renderItem={this._renderItem}
      />
    )
  }
}

export default Relay.createContainer(ModelSelector, {
  fragments: {
    model: () => Relay.QL`
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
