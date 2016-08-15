import * as React from 'react'
import * as Relay from 'react-relay'
import { Model } from '../../types/types'
import { isScalar } from '../../utils/graphql'
import { Lokka } from 'lokka'
import { Transport } from 'lokka-transport-http'
import * as cookiestore from '../../utils/cookiestore'
import {ScalarValue} from '../../types/utils'
import ClickOutside from 'react-click-outside'
import Autocomplete from 'react-autocomplete'
const classes: any = require('./NodeSelector.scss')

interface Props {
  projectId: string
  value: string
  relatedModel: Model
  onSelect: (value: string) => void
  onCancel: () => void
  onFocus?: () => void
}

interface State {
  nodes: any[]
  value: string
}

class NodeSelector extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props)

    this.state = {
      nodes: [],
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
        const nodes = results[`all${props.relatedModel.namePlural}`]
        this.setState({ nodes } as State)
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

  _renderNode = (node, isHighlighted) => {
    return (
      <div
        key={node.id}
        className={`${classes.row} ${isHighlighted ? classes.highlighted : ''}`}
      >
        {JSON.stringify(node, null, 1)}
      </div>
    )
  }

  _shouldNodeRender = (node, value) => {
    return this.props.relatedModel.fields.edges
      .map((edge) => edge.node)
      .filter((field) => isScalar(field.typeIdentifier) && node[field.name])
      .some((field) => node[field.name].toString().toLowerCase().includes(value))
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
          value={this.state.value || ''}
          items={this.state.nodes}
          shouldItemRender={this._shouldNodeRender}
          inputProps={{autoFocus: true }}
          getItemValue={(node: ScalarValue) => node}
          onChange={(event, value) => this.setState({ value } as State)}
          onSelect={(value) => this.props.onSelect(value)}
          renderItem={this._renderNode}
        />
      </ClickOutside>
    )
  }
}

export default Relay.createContainer(NodeSelector, {
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
