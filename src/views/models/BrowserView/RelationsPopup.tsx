import * as React from 'react'
import * as Relay from 'react-relay'
import { Field } from '../../../types/types'
import * as Immutable from 'immutable'
import { isScalar } from '../../../utils/graphql'
import { Lokka } from 'lokka'
import { Transport } from 'lokka-transport-http'
import * as cookiestore from '../../../utils/cookiestore'
import Icon from '../../../components/Icon/Icon'
import Popup from '../../../components/Popup/Popup'
import ScrollBox from '../../../components/ScrollBox/ScrollBox'
const classes: any = require('./RelationsPopup.scss')

interface Props {
  projectId: string
  originField: Field
  originItemId: string
  onCancel: () => void
}

interface ItemWrapper {
  isRelated: boolean
  item: any
}

interface State {
  items: Immutable.List<ItemWrapper>
}

class RelationsPopup extends React.Component<Props, State> {

  _lokka: any

  constructor (props: Props) {
    super(props)

    this.state = {
      items: Immutable.List<ItemWrapper>(),
    }

    const clientEndpoint = `${__BACKEND_ADDR__}/simple/v1/${props.projectId}`
    const token = cookiestore.get('graphcool_token')
    const headers = { Authorization: `Bearer ${token}` }
    const transport = new Transport(clientEndpoint, { headers })

    this._lokka = new Lokka({ transport })

    const relatedModel = props.originField.relatedModel
    const originModel = props.originField.model

    const fieldNames = relatedModel.fields.edges
      .map(({ node }) => node)
      .map((field) => isScalar(field.typeIdentifier)
        ? field.name
        : `${field.name} { id }`)
      .join(' ')
    const query = `
      {
        all${relatedModel.namePlural} {
          ${fieldNames}
        }
        ${originModel.name}(id: "${props.originItemId}") {
          ${props.originField.name} {
            ${fieldNames}
          }
        }
      }
    `

    this._lokka.query(query)
      .then((results) => {
        const allItems: any[] = results[`all${relatedModel.namePlural}`]
        const relatedItems: any[] = results[originModel.name][props.originField.name]
        const items = allItems.map((item) => ({
          item,
          isRelated: relatedItems.some((relatedItem) => relatedItem.id === item.id),
        }))

        this.setState({ items: Immutable.List(items) } as State)
      })
  }

  _toggleRelation (isRelated: boolean, itemId: string): void {
    const relationName = this.props.originField.relation.name
    const relatedModelName = this.props.originField.relatedModel.name
    const relatedFieldName = this.props.originField.reverseRelationField.name
    const originModelName = this.props.originField.model.name
    const originFieldName = this.props.originField.name

    const mutationArg1 = `${originFieldName}${relatedModelName}Id`
    const mutationArg2 = `${relatedFieldName}${originModelName}Id`

    const mutation = `{
      addTo${relationName}(
        ${mutationArg1}: "${this.props.originItemId}"
        ${mutationArg2}: "${itemId}"
      ) {
        id
      }
    }`

    this._lokka.mutate(mutation)
      .then(() => {
        const index = this.state.items.findIndex(({ item }) => item.id === itemId)
        const { item } = this.state.items.get(index)
        const items = this.state.items.set(index, { item, isRelated: !isRelated })
        this.setState({ items })
      })
  }

  render () {
    return (
      <Popup onClickOutside={this.props.onCancel} height='90%'>
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
                />
            </div>
            <div className={classes.selection}>
              <div className={`${true ? classes.active : ''}`}>All</div>
              <div className={`${false ? classes.active : ''}`}>Related</div>
              <div className={`${false ? classes.active : ''}`}>Unrelated</div>
            </div>
          </div>
          <div className={classes.list}>
            <ScrollBox>
              {this.state.items.map(({ isRelated, item }) => (
                <div
                  key={item.id}
                  className={`${classes.item} ${isRelated ? classes.related : ''}`}
                  onClick={() => this._toggleRelation(isRelated, item.id)}
                >
                  <div className={classes.check}>
                    <Icon
                      width={23}
                      height={23}
                      src={require('assets/new_icons/check.svg')}
                    />
                  </div>
                  <div>{JSON.stringify(item, null, 2)}</div>
                </div>
              ))}
            </ScrollBox>
          </div>
          <div className={classes.footer}>
            <div className={classes.savedIndicator}>
              All changes saved
            </div>
            <div className={classes.close}>
              Close
            </div>
          </div>
        </div>
      </Popup>
    )
  }
}

export default Relay.createContainer(RelationsPopup, {
  fragments: {
    originField: () => Relay.QL`
      fragment on Field {
        name
        relatedModel {
          id
          name
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
        reverseRelationField {
          name
        }
        model {
          name
        }
        relation {
          name
        }
      }
    `,
  },
})
