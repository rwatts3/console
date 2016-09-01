import * as React from 'react'
import * as Relay from 'react-relay'
import { Model } from '../../types/types'
import { isScalar } from '../../utils/graphql'
import {ScalarValue} from '../../types/utils'
import ClickOutside from 'react-click-outside'
import Autocomplete from 'react-autocomplete'
import {getLokka, queryNodes} from '../../utils/simpleapi'
const classes: any = require('./NodeSelector.scss')

interface Props {
  projectId: string
  value: string
  relatedModel: Model
  onSelect: (value: string) => void
  cancel: () => void
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

    const lokka = getLokka(this.props.projectId)

    const fields = props.relatedModel.fields.edges
      .map(({ node }) => node)

    queryNodes(lokka, props.relatedModel.namePlural, fields)
      .then((results) => {
        const nodes = results[`all${props.relatedModel.namePlural}`]
        this.setState({ nodes } as State)
      })
  }

  componentWillReceiveProps (nextProps: Props) {
    this.setState({ value: nextProps.value } as State)
  }

  render () {
    return (
      <ClickOutside
        onClickOutside={this.props.cancel}
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
          shouldItemRender={this.shouldNodeRender}
          inputProps={{autoFocus: true }}
          getItemValue={(node: ScalarValue) => node}
          onChange={(event, value) => this.setState({ value } as State)}
          onSelect={(value) => this.props.onSelect(value)}
          renderItem={this.renderNode}
        />
      </ClickOutside>
    )
  }

  private renderNode = (node, isHighlighted) => {
    return (
      <div
        key={node.id}
        className={`${classes.row} ${isHighlighted ? classes.highlighted : ''}`}
      >
        {JSON.stringify(node, null, 1)}
      </div>
    )
  }

  private shouldNodeRender = (node, value) => {
    return this.props.relatedModel.fields.edges
      .map((edge) => edge.node)
      .filter((field) => isScalar(field.typeIdentifier) && node[field.name])
      .some((field) => node[field.name].toString().toLowerCase().includes(value))
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
