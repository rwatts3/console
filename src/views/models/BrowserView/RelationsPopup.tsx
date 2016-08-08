import * as React from 'react'
import * as Relay from 'react-relay'
import { Field, DataItem } from '../../../types/types'
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
  item: DataItem
}

enum Selection { All, Related, Unrelated }

interface State {
  items: Immutable.List<ItemWrapper>
  selection: Selection
  filter: string
  success: boolean
}

class RelationsPopup extends React.Component<Props, State> {

  _lokka: any

  constructor (props: Props) {
    super(props)

    this.state = {
      items: Immutable.List<ItemWrapper>(),
      selection: Selection.All,
      filter: '',
      success: false,
    }

    const clientEndpoint = `${__BACKEND_ADDR__}/simple/v1/${props.projectId}`
    const token = cookiestore.get('graphcool_token')
    const headers = { Authorization: `Bearer ${token}` }
    const transport = new Transport(clientEndpoint, { headers })

    this._lokka = new Lokka({ transport })

    this._reload()
  }

  _reload = () => {
    const relatedModel = this.props.originField.relatedModel
    const originModel = this.props.originField.model

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
        ${originModel.name}(id: "${this.props.originItemId}") {
          ${this.props.originField.name} {
            ${fieldNames}
          }
        }
      }
    `

    return this._lokka.query(query)
      .then((results) => {
        const allItems: any[] = results[`all${relatedModel.namePlural}`]
        const relatedItems: any[] = results[originModel.name][this.props.originField.name]
        const items = allItems.map((item) => ({
          item,
          isRelated: relatedItems.some((relatedItem) => relatedItem.id === item.id),
        }))

        this.setState({ items: Immutable.List(items) } as State)
      })
  }

  _toggleRelation (isRelated: boolean, itemId: string): void {
    console.log(this.props.originField)
    const relationName = this.props.originField.relation.name
    const relatedModelName = this.props.originField.relatedModel.name
    // TODO fix this error where the reversRelationField is null
    const relatedFieldName = this.props.originField.reverseRelationField.name
    const originModelName = this.props.originField.model.name
    const originFieldName = this.props.originField.name

    const mutationPrefix = isRelated ? 'removeFrom' : 'addTo'
    const mutationArg1 = `${relatedFieldName}${originModelName}Id`
    const mutationArg2 = `${originFieldName}${relatedModelName}Id`

    const mutation = `{
      ${mutationPrefix}${relationName}(
        ${mutationArg1}: "${this.props.originItemId}"
        ${mutationArg2}: "${itemId}"
      ) {
        id
      }
    }`
    this._lokka.mutate(mutation)
      .then(this._reload)
      .then(() => this.setState({ success: true } as State))
  }

  render () {
    const relatedFields = this.props.originField.relatedModel.fields
    const filter = this.state.filter.toLowerCase()
    const filteredItems = this.state.items
      .filter(({ isRelated }) => {
        switch (this.state.selection) {
          case Selection.All: return true
          case Selection.Related: return isRelated
          case Selection.Unrelated: return !isRelated
        }
      })
      .filter(({ item }) => (
        relatedFields.edges
          .map((edge) => edge.node)
          .filter((field) => isScalar(field.typeIdentifier) && item[field.name])
          .some((field) => item[field.name].toString().toLowerCase().includes(filter))
      ))

    return (
      <Popup onClickOutside={this.props.onCancel} height='80%'>
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
                onChange={(e) => this.setState({ filter: e.target.value } as State)}
              />
            </div>
            <div className={classes.selection}>
              <div
                className={`${this.state.selection === Selection.All ? classes.active : ''}`}
                onClick={() => this.setState({ selection: Selection.All } as State)}
              >
                All
              </div>
              <div
                className={`${this.state.selection === Selection.Related ? classes.active : ''}`}
                onClick={() => this.setState({ selection: Selection.Related } as State)}
              >
                Related
              </div>
              <div
                className={`${this.state.selection === Selection.Unrelated ? classes.active : ''}`}
                onClick={() => this.setState({ selection: Selection.Unrelated } as State)}
              >
                Unrelated
              </div>
            </div>
          </div>
          <div className={classes.list}>
            <ScrollBox>
              {filteredItems.map(({ isRelated, item }) => (
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
            {this.state.success &&
              <div className={classes.savedIndicator}>
                All changes saved
              </div>
            }
            <div className={classes.close} onClick={this.props.onCancel}>
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
