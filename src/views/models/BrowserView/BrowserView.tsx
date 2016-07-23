import * as React from 'react'
import * as Relay from 'react-relay'
import { Link } from 'react-router'
const calculateSize: any = require('calculate-size')
import { Lokka } from 'lokka'
import * as Immutable from 'immutable'
import { Transport } from 'lokka-transport-http'
import * as PureRenderMixin from 'react-addons-pure-render-mixin'
import { isScalar } from 'utils/graphql'
import ScrollBox from '../../../components/ScrollBox/ScrollBox'
import Icon from '../../../components/Icon/Icon'
import * as cookiestore from '../../../utils/cookiestore'
import mapProps from '../../../components/MapProps/MapProps'
import Loading from '../../../components/Loading/Loading'
const Tether: any = (require('../../../components/Tether/Tether') as any).default
const HeaderCell: any = (require('./HeaderCell') as any).default
const ModelDescription: any = (require('../ModelDescription') as any).default
const Row: any = (require('./Row') as any).default
const NewRow: any = (require('./NewRow') as any).default
import CheckboxCell from './CheckboxCell'
import { valueToString, toGQL } from '../utils'
import { sideNavSyncer } from '../../../utils/sideNavSyncer'
import { Field, Model } from '../../../types/types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
const gettingStartedState: any = require('../../../reducers/GettingStartedState')
const classes: any = require('./BrowserView.scss')

function compareFields (a: Field, b: Field): number {
  if (a.name === 'id') {
    return -1
  }
  if (b.name === 'id') {
    return 1
  }
  return a.name.localeCompare(b.name)
}

interface Props {
  params: any
  fields: Field[]
  projectId: string
  model: Model
  gettingStartedState: any
  nextStep: () => void
}

interface State {
  items: Immutable.List<Immutable.Map<string, any>>
  loading: boolean
  orderBy: OrderBy
  filter: Immutable.Map<string, any>
  reachedEnd: boolean
  newRowVisible: boolean
  selectedItemIds: Immutable.List<string>
}

interface OrderBy {
  fieldName: string
  order: 'ASC' | 'DESC'
}

class BrowserView extends React.Component<Props, State> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  _lokka: any

  shouldComponentUpdate: any

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
    this._unmarshalItem = this._unmarshalItem.bind(this)

    const clientEndpoint = `${__BACKEND_ADDR__}/simple/v1/${this.props.projectId}`
    const token = cookiestore.get('graphcool_token')
    const headers = { Authorization: `Bearer ${token}`, 'X-GraphCool-Source': 'dashboard:data-tab' }
    const transport = new Transport(clientEndpoint, { headers })

    this._lokka = new Lokka({ transport })

    this.state = {
      items: Immutable.List<Immutable.Map<string, any>>(),
      loading: true,
      orderBy: {
        fieldName: 'id',
        order: 'DESC',
      },
      filter: Immutable.Map<string, any>(),
      reachedEnd: false,
      newRowVisible: false,
      selectedItemIds: Immutable.List<string>(),
    }
  }

  componentWillMount () {
    this._reloadData()
  }

  componentDidMount () {
    analytics.track('models/browser: viewed', {
      model: this.props.params.modelName,
    })
  }

  _handleScroll (e) {
    if (!this.state.loading && e.target.scrollHeight - (e.target.scrollTop + e.target.offsetHeight) < 100) {
      this._loadNextPage()
    }
  }

  _setSortOrder (field) {
    const order = this.state.orderBy.fieldName === field.name
      ? (this.state.orderBy.order === 'ASC' ? 'DESC' : 'ASC')
      : 'ASC'

    this.setState(
      {
        orderBy: {
          fieldName: field.name,
          order,
        },
      } as State,
      this._reloadData
    )
  }

  _loadData (skip: number): Promise<Immutable.List<Immutable.Map<string, any>>> {
    const fieldNames = this.props.fields
      .map((field) => isScalar(field.typeIdentifier)
        ? field.name
        : `${field.name} { id }`)
      .join(' ')

    const filterQuery = this.state.filter
      .filter((v) => v !== null)
      .map((value, fieldName) => `${fieldName}: ${value}`)
      .join(' ')

    const filter = filterQuery !== '' ? `filter: { ${filterQuery} }` : ''
    const orderBy = `orderBy: ${this.state.orderBy.fieldName}_${this.state.orderBy.order}`
    const query = `
      {
        all${this.props.model.namePlural}(take: 50 skip: ${skip} ${filter} ${orderBy}) {
          ${fieldNames}
        }
      }
    `
    return this._lokka.query(query)
      .then((results) => {
        const items = Immutable.List(results[`all${this.props.model.namePlural}`])
          .map(Immutable.Map)
          .map(this._unmarshalItem)
        const reachedEnd = items.isEmpty() || !this.state.items.isEmpty() &&
          this.state.items.last().get('id') === items.last().get('id')
        this.setState({ reachedEnd } as State)
        return items
      })
  }

  _unmarshalItem (item: Immutable.Map<string, any>): Immutable.Map<string, any> {
    return this.props.fields
      .filter((field) => field.typeIdentifier === 'DateTime')
      .map((field) => field.name)
      .reduce((acc, fieldName) => acc.set(fieldName, new Date(acc.get(fieldName))), item)
  }

  _loadNextPage () {
    if (this.state.reachedEnd) {
      return
    }

    this.setState({ loading: true } as State)

    this._loadData(this.state.items.size)
      .then((items) => {
        this.setState({
          items: this.state.items.concat(items),
          loading: false,
        } as State)
      })
  }

  _reloadData () {
    this.setState({ loading: true } as State)
    return this._loadData(0)
      .then((items) => {
        this.setState({ items, loading: false } as State)
        // _update side nav model item count
        this._updateSideNav()
      })
  }

  _updateFilter (value, field) {
    this.setState({ filter: this.state.filter.set(field.name, value) } as State, this._reloadData)

    // TODO: select cut set of selected and filtered items
    this.setState({ selectedItemIds: Immutable.List() } as State)
  }

  _deleteItem (itemId) {
    this.setState({ loading: true } as State)
    const mutation = `
      {
        delete${this.props.model.name}(
          id: "${itemId}"
        ) {
          id
        }
      }
    `
    return this._lokka.mutate(mutation)
      .then(analytics.track('models/browser: deleted item', {
        project: this.props.params.projectName,
        model: this.props.params.modelName,
      }))
  }

  _updateItem (value, field, callback, itemId, index) {
    const mutation = `
      {
        update${this.props.model.name}(
          id: "${itemId}"
          ${toGQL(value, field)}
        ) {
          id
        }
      }
    `
    this._lokka.mutate(mutation)
      .then(() => {
        callback(true)

        const { items } = this.state

        this.setState({ items: items.setIn([index, field.name], value) } as State)

        analytics.track('models/browser: updated item', {
          project: this.props.params.projectName,
          model: this.props.params.modelName,
          field: field.name,
        })
      })
      .catch(() => callback(false))
  }

  _addItem (fieldValues: any) {
    const inputString = fieldValues
      .mapToArray((fieldName, obj) => obj)
      .filter(({ value }) => value !== null)
      .map(({ field, value }) => toGQL(value, field))
      .join(' ')

    this.setState({ loading: true } as State)
    const mutation = `
      {
        create${this.props.model.name}(
          ${inputString},
        ) {
          id
        }
      }
    `
    this._lokka.mutate(mutation)
      .then(() => this._reloadData())
      .then(() => {
        this.setState({ newRowVisible: false } as State)

        analytics.track('models/browser: created item', {
          project: this.props.params.projectName,
          model: this.props.params.modelName,
        })

        // getting-started onboarding step
        if (this.props.model.name === 'Todo' && (
           this.props.gettingStartedState.isCurrentStep('STEP6_ADD_DATA_ITEM_1') ||
           this.props.gettingStartedState.isCurrentStep('STEP7_ADD_DATA_ITEM_2')
             )) {
          this.props.nextStep()
        }
      })
  }

  _calculateColumnWidths (): any {
    const cellFontOptions = {
      font: 'Open Sans',
      fontSize: '12px',
    }
    const headerFontOptions = {
      font: 'Open Sans',
      fontSize: '12px',
    }

    return this.props.fields.mapToObject(
      (field) => field.name,
      (field) => {
        const cellWidths = this.state.items
          .map((item) => item.get(field.name))
          .map((value) => valueToString(value, field, false))
          .map((str) => calculateSize(str, cellFontOptions).width + 40)
          .toArray()

        const headerWidth = calculateSize(`${field.name} ${field.typeIdentifier}`, headerFontOptions).width + 90

        const maxWidth = Math.max(...cellWidths, headerWidth)
        const lowerLimit = 150
        const upperLimit = 400

        return maxWidth > upperLimit ? upperLimit : (maxWidth < lowerLimit ? lowerLimit : maxWidth)
      }
    )
  }

  _onSelectRow (itemId) {
    if (this.state.selectedItemIds.includes(itemId)) {
      this.setState({ selectedItemIds: this.state.selectedItemIds.filter((id) => id !== itemId) } as State)
    } else {
      this.setState({ selectedItemIds: this.state.selectedItemIds.push(itemId) } as State)
    }
  }

  _isSelected (itemId) {
    return this.state.selectedItemIds.indexOf(itemId) > -1
  }

  _selectAllOnClick (checked) {
    if (checked) {
      const selectedItemIds = this.state.items.map((item) => item.get('id'))
      this.setState({selectedItemIds: selectedItemIds} as State)
    } else {
      this.setState({selectedItemIds: Immutable.List()} as State)
    }
  }

  _deleteSelectedItems () {
    if (confirm(`Do you really want to delete ${this.state.selectedItemIds.size} item(s)?`)) {
      // only reload once after all the deletions
      Promise.all(this.state.selectedItemIds.toArray().map((itemId) => {
        this._deleteItem(itemId)
      }))
      .then(() => this._reloadData())
      .then(() => {
        this.setState({ loading: false } as State)
      })

      this.setState({ selectedItemIds: Immutable.List() } as State)
    }
  }

  // THIS IS A HACK
  _updateSideNav () {
    sideNavSyncer.notifySideNav()
  }

  render () {
    const columnWidths = this._calculateColumnWidths()
    const tableWidth = this.props.fields.reduce((sum, { name }) => sum + columnWidths[name], 0) + 34 // 34 = checkbox

    return (
      <div className={classes.root}>
        <div className={classes.head}>
          <div className={classes.headLeft}>
            <div className={classes.title}>
              {this.props.model.name}
              <span className={classes.itemCount}>{this.props.model.itemCount} items</span>
            </div>
            <div className={classes.titleDescription}>
              <ModelDescription model={this.props.model} />
            </div>
          </div>
          <div className={classes.headRight}>
            <Tether
              steps={{
                STEP6_ADD_DATA_ITEM_1: `Add your first Todo item to the database.
                Type something in the input field below and hit enter.`,
                STEP7_ADD_DATA_ITEM_2: 'Well done. Let\'s add another one.',
              }}
              offsetX={-5}
              offsetY={5}
              width={290}
            >
              <div
                className={`${classes.button} ${classes.green}`}
                onClick={() => this.setState({ newRowVisible: true } as State)}
              >
                <Icon
                  width={16}
                  height={16}
                  src={require('assets/icons/add.svg')}
                />
                <span>Add item</span>
              </div>
            </Tether>
            <Link
              to={`/${this.props.params.projectName}/models/${this.props.params.modelName}/structure`}
              className={classes.button}
              >
              <Icon
                width={16}
                height={16}
                src={require('assets/icons/edit.svg')}
              />
              <span>Edit Structure</span>
            </Link>
            {this.state.selectedItemIds.size > 0 &&
              <div className={`${classes.button} ${classes.red}`} onClick={() => this._deleteSelectedItems()}>
                <Icon
                  width={16}
                  height={16}
                  src={require('assets/icons/delete.svg')}
                />
                <span>Delete Selected Items</span>
              </div>
            }
            <div className={classes.button} onClick={() => this._reloadData()}>
              <Icon
                width={16}
                height={16}
                src={require('assets/icons/refresh.svg')}
              />
            </div>
          </div>
        </div>
        {this.state.loading &&
          <div className={classes.loading}>
            <Loading color='#fff' />
          </div>
        }
        <div className={classes.table}>
          <div className={classes.tableContainer} style={{ width: tableWidth }}>
            <div className={classes.tableHead}>
              <CheckboxCell
                onChange={(checked) => this._selectAllOnClick(checked)}
                checked={this.state.selectedItemIds.size === this.state.items.size && this.state.items.size > 0}
              />
              {this.props.fields.map((field) => (
                <HeaderCell
                  key={field.id}
                  field={field}
                  width={columnWidths[field.name]}
                  sortOrder={this.state.orderBy.fieldName === field.name ? this.state.orderBy.order : null}
                  toggleSortOrder={() => this._setSortOrder(field)}
                  updateFilter={(value) => this._updateFilter(value, field)}
                />
              ))}
            </div>
            {this.state.newRowVisible &&
              <NewRow
                fields={this.props.fields}
                columnWidths={columnWidths}
                add={(data) => this._addItem(data)}
                cancel={(e) => this.setState({ newRowVisible: false } as State)}
              />
            }
            <div className={classes.tableBody} onScroll={(e) => this._handleScroll(e)}>
              <ScrollBox>
                <div className={classes.tableBodyContainer}>
                  {this.state.items.map((item, index) => (
                    <Row
                      key={item.get('id')}
                      fields={this.props.fields}
                      columnWidths={columnWidths}
                      item={item.toJS()}
                      update={(key, value, callback) => this._updateItem(key, value, callback, item.get('id'), index)}
                      isSelected={this._isSelected(item.get('id'))}
                      onSelect={(event) => this._onSelectRow(item.get('id'))}
                    />
                  ))}
                </div>
              </ScrollBox>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    gettingStartedState: state.gettingStartedState,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ nextStep: gettingStartedState.nextStep }, dispatch)
}

const ReduxContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BrowserView)

const MappedBrowserView = mapProps({
  params: (props) => props.params,
  fields: (props) => (
    props.viewer.model.fields.edges
      .map((edge) => edge.node)
      .filter((field) => isScalar(field.typeIdentifier) || !field.isList)
      .sort(compareFields)
  ),
  model: (props) => props.viewer.model,
  projectId: (props) => props.viewer.project.id,
})(ReduxContainer)

export default Relay.createContainer(MappedBrowserView, {
  initialVariables: {
    modelName: null, // injected from router
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        model: modelByName(projectName: $projectName, modelName: $modelName) {
          name
          namePlural
          itemCount
          fields(first: 100) {
            edges {
              node {
                id
                name
                typeIdentifier
                isList
                isRequired
                enumValues
                defaultValue
              }
            }
          }
          ${ModelDescription.getFragment('model')}
        }
        project: projectByName(projectName: $projectName) {
          id
        }
      }
    `,
  },
})
