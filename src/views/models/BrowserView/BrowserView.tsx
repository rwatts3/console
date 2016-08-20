import * as React from 'react'
import * as Relay from 'react-relay'
import {withRouter} from 'react-router'
import calculateSize from 'calculate-size'
import {Lokka} from 'lokka'
import {Transport} from 'lokka-transport-http'
import * as Immutable from 'immutable'
import * as PureRenderMixin from 'react-addons-pure-render-mixin'
import {isScalar, isNonScalarList} from '../../../utils/graphql'
import ScrollBox from '../../../components/ScrollBox/ScrollBox'
import Icon from '../../../components/Icon/Icon'
import * as cookiestore from '../../../utils/cookiestore'
import mapProps from '../../../components/MapProps/MapProps'
import Loading from '../../../components/Loading/Loading'
import {ShowNotificationCallback, TypedValue} from '../../../types/utils'
import Tether from '../../../components/Tether/Tether'
import NewRow from './NewRow'
import Row from './Row'
import HeaderCell from './HeaderCell'
import AddFieldCell from './AddFieldCell'
import CheckboxCell from './CheckboxCell'
import {toGQL, compareFields} from '../utils'
import {valueToString} from '../../../utils/valueparser'
import {sideNavSyncer} from '../../../utils/sideNavSyncer'
import {Field, Model, Viewer, Project} from '../../../types/types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import ModelHeader from '../ModelHeader'
import {GettingStartedState, nextStep} from '../../../reducers/GettingStartedState'
const classes: any = require('./BrowserView.scss')

interface Props {
  viewer: Viewer
  router: any
  route: any
  params: any
  fields: Field[]
  project: Project
  model: Model
  gettingStartedState: GettingStartedState
  nextStep: () => void
}

interface State {
  nodes: Immutable.List<Immutable.Map<string, any>>
  loading: boolean
  orderBy: OrderBy
  filter: Immutable.Map<string, any>
  filtersVisible: boolean
  reachedEnd: boolean
  newRowVisible: boolean
  selectedNodeIds: Immutable.List<string>
}

interface OrderBy {
  fieldName: string
  order: 'ASC' | 'DESC'
}

class BrowserView extends React.Component<Props, State> {

  static contextTypes = {
    showNotification: React.PropTypes.func.isRequired,
  }

  context: {
    showNotification: ShowNotificationCallback
  }

  shouldComponentUpdate: any

  private lokka: any

  constructor(props: Props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)

    const clientEndpoint = `${__BACKEND_ADDR__}/simple/v1/${this.props.project.id}`
    const token = cookiestore.get('graphcool_token')
    const headers = {Authorization: `Bearer ${token}`, 'X-GraphCool-Source': 'dashboard:data-tab'}
    const transport = new Transport(clientEndpoint, {headers})

    this.lokka = new Lokka({transport})

    this.state = {
      nodes: Immutable.List<Immutable.Map<string, any>>(),
      loading: true,
      orderBy: {
        fieldName: 'id',
        order: 'DESC',
      },
      filter: Immutable.Map<string, any>(),
      filtersVisible: false,
      reachedEnd: false,
      newRowVisible: false,
      selectedNodeIds: Immutable.List<string>(),
    }
  }

  componentWillMount = () => {
    this.reloadData()
  }

  componentDidMount = () => {
    analytics.track('models/browser: viewed', {
      model: this.props.params.modelName,
    })

    this.props.router.setRouteLeaveHook(this.props.route, () => {
      if (this.state.newRowVisible) {
        // TODO with custom dialogs use "return false" and display custom dialog
        return 'Are you sure you want to discard unsaved changes?'
      }
    })
  }

  render() {
    const columnWidths = this.calculateColumnWidths()
    const tableWidth = this.props.fields.reduce((sum, {name}) => sum + columnWidths[name], 0)
      + 34 // checkbox
      + 250 // add column

    return (
      <div className={`${classes.root} ${this.state.filtersVisible ? classes.filtersVisible : ''}`}>
        <ModelHeader
          params={this.props.params}
          model={this.props.model}
          viewer={this.props.viewer}
          project={this.props.project}
        >
          <Tether
            steps={{
              STEP6_ADD_DATA_ITEM_1: `Add your first Todo node to the database.`,
              STEP7_ADD_DATA_ITEM_2: 'Well done. Let\'s add another one.',
            }}
            offsetX={5}
            offsetY={5}
            width={260}
          >
            <div
              className={`${classes.button} ${this.state.newRowVisible ? '' : classes.green}`}
              onClick={() => this.setState({ newRowVisible: !this.state.newRowVisible } as State)}
            >
              <Icon
                width={16}
                height={16}
                src={require(`assets/icons/${this.state.newRowVisible ? 'close' : 'add'}.svg`)}
              />
              <span>{this.state.newRowVisible ? 'Cancel' : 'Add node'}</span>
            </div>
          </Tether>
          {this.state.selectedNodeIds.size > 0 &&
          <div className={`${classes.button} ${classes.red}`} onClick={this.deleteSelectedNodes}>
            <Icon
              width={16}
              height={16}
              src={require('assets/icons/delete.svg')}
            />
            <span>Delete Selected ({this.state.selectedNodeIds.size})</span>
          </div>
          }
          <div
            className={`${classes.button} ${this.state.filtersVisible ? classes.blue : ''}`}
            onClick={() => this.setState({ filtersVisible: !this.state.filtersVisible } as State)}
          >
            <Icon
              width={16}
              height={16}
              src={require('assets/icons/search.svg')}
            />
          </div>
          <div className={classes.button} onClick={this.reloadData}>
            <Icon
              width={16}
              height={16}
              src={require('assets/icons/refresh.svg')}
            />
          </div>
        </ModelHeader>
        {this.state.loading &&
        <div className={classes.loadingOverlay}>
          <Loading color='#B9B9C8'/>
        </div>
        }
        <div className={`${classes.table} ${this.state.loading ? classes.loading : ''}`}>
          <div className={classes.tableContainer} style={{ width: tableWidth }}>
            <div className={classes.tableHead}>
              <CheckboxCell
                onChange={this.selectAllOnClick}
                checked={this.state.selectedNodeIds.size === this.state.nodes.size && this.state.nodes.size > 0}
              />
              {this.props.fields.map((field) => (
                <HeaderCell
                  key={field.id}
                  field={field}
                  width={columnWidths[field.name]}
                  sortOrder={this.state.orderBy.fieldName === field.name ? this.state.orderBy.order : null}
                  toggleSortOrder={() => this.setSortOrder(field)}
                  updateFilter={(value) => this.updateFilter(value, field)}
                  filterVisible={this.state.filtersVisible}
                  params={this.props.params}
                />
              ))}
              <AddFieldCell params={this.props.params}/>
            </div>
            {this.state.newRowVisible &&
            <NewRow
              model={this.props.model}
              columnWidths={columnWidths}
              add={this.addNode}
              cancel={(e) => this.setState({ newRowVisible: false } as State)}
              projectId={this.props.project.id}
              reload={this.reloadData}
            />
            }
            <div className={classes.tableBody}>
              <ScrollBox onScroll={this.handleScroll}>
                <div className={classes.tableBodyContainer}>
                  {this.state.nodes.map((node, index) => (
                    <Row
                      key={node.get('id')}
                      model={this.props.model}
                      projectId={this.props.project.id}
                      columnWidths={columnWidths}
                      node={node.toJS()}
                      update={
                        (value, field, callback) => this.updateNode(value, field, callback, node.get('id'), index)
                      }
                      isSelected={this.isSelected(node.get('id'))}
                      onSelect={(event) => this.onSelectRow(node.get('id'))}
                      reload={this.reloadData}
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

  private handleScroll = (e) => {
    if (!this.state.loading && e.target.scrollHeight - (e.target.scrollTop + e.target.offsetHeight) < 100) {
      this.loadNextPage()
    }
  }

  private setSortOrder = (field: Field) => {
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
      this.reloadData
    )
  }

  private loadData = (skip: number, reload: boolean): Promise<Immutable.List<Immutable.Map<string, any>>> => {
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
    return this.lokka.query(query)
      .then((results) => {
        const nodes = Immutable.List(results[`all${this.props.model.namePlural}`])
          .map(Immutable.Map)

        // check if it's the end of the data
        const reachedEnd = !reload && (nodes.isEmpty() || (!this.state.nodes.isEmpty() &&
          this.state.nodes.last().get('id') === nodes.last().get('id')))
        this.setState({reachedEnd} as State)

        return nodes
      })
      .catch((err) => {
        err.rawError.forEach((error) => this.context.showNotification(error.message, 'error'))
        throw err
      })
  }

  private loadNextPage = () => {
    if (this.state.reachedEnd) {
      return
    }

    this.setState({loading: true} as State)

    this.loadData(this.state.nodes.size, false)
      .then((nodes) => {
        this.setState({
          nodes: this.state.nodes.concat(nodes),
          loading: false,
        } as State)
      })
  }

  private reloadData = () => {
    this.setState({loading: true, reachedEnd: false} as State)
    return this.loadData(0, true)
      .then((nodes) => {
        this.setState({nodes, loading: false} as State)
        // _update side nav model node count
        // THIS IS A HACK
        sideNavSyncer.notifySideNav()
      })
  }

  private updateFilter = (value: TypedValue, field: Field) => {
    this.setState({filter: this.state.filter.set(field.name, value)} as State, this.reloadData)

    // TODO: select cut set of selected and filtered nodes
    this.setState({selectedNodeIds: Immutable.List()} as State)
  }

  private deleteNode = (nodeId: string) => {
    this.setState({loading: true} as State)
    const mutation = `
      {
        delete${this.props.model.name}(
          id: "${nodeId}"
        ) {
          id
        }
      }
    `
    return this.lokka.mutate(mutation)
      .then(analytics.track('models/browser: deleted node', {
        project: this.props.params.projectName,
        model: this.props.params.modelName,
      }))
      .catch((err) => {
        err.rawError.forEach((error) => this.context.showNotification(error.message, 'error'))
      })
  }

  private updateNode = (value: TypedValue, field: Field, callback, nodeId: string, index: number) => {
    const mutation = `
      {
        update${this.props.model.name}(
          id: "${nodeId}"
          ${toGQL(value, field)}
        ) {
          id
        }
      }
    `
    this.lokka.mutate(mutation)
      .then(() => {
        callback(true)

        const {nodes} = this.state

        this.setState({nodes: nodes.setIn([index, field.name], value)} as State)

        analytics.track('models/browser: updated node', {
          project: this.props.params.projectName,
          model: this.props.params.modelName,
          field: field.name,
        })
      })
      .catch((err) => {
        callback(false)
        err.rawError.forEach((error) => this.context.showNotification(error.message, 'error'))
      })
  }

  private addNode = (fieldValues: { [key: string]: any }) => {

    const inputString = fieldValues
      .mapToArray((fieldName, obj) => obj)
      .filter(({value}) => value !== null)
      .filter(({field}) => (!isNonScalarList(field)))
      .map(({field, value}) => toGQL(value, field))
      .join(' ')

    const inputArgumentsString = inputString.length > 0 ? `(${inputString})` : ''

    this.setState({loading: true} as State)
    const mutation = `
      {
        create${this.props.model.name}${inputArgumentsString} {
          id
        }
      }
    `
    this.lokka.mutate(mutation)
      .then(() => this.reloadData())
      .then(() => {
        this.setState({newRowVisible: false} as State)

        analytics.track('models/browser: created node', {
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
      .catch((err) => {
        err.rawError.forEach((error) => this.context.showNotification(error.message, 'error'))
        this.setState({loading: false} as State)
      })
  }

  private calculateColumnWidths = (): any => {
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
        const cellWidths = this.state.nodes
          .map((node) => node.get(field.name))
          .map((value) => valueToString(value, field, false))
          .map((str) => calculateSize(str, cellFontOptions).width + 41)
          .toArray()

        const headerWidth = calculateSize(`${field.name} ${field.typeIdentifier}`, headerFontOptions).width + 90

        const maxWidth = Math.max(...cellWidths, headerWidth)
        const lowerLimit = 150
        const upperLimit = 400

        return maxWidth > upperLimit ? upperLimit : (maxWidth < lowerLimit ? lowerLimit : maxWidth)
      }
    )
  }

  private onSelectRow = (nodeId: string) => {
    if (this.state.selectedNodeIds.includes(nodeId)) {
      this.setState({selectedNodeIds: this.state.selectedNodeIds.filter((id) => id !== nodeId)} as State)
    } else {
      this.setState({selectedNodeIds: this.state.selectedNodeIds.push(nodeId)} as State)
    }
  }

  private isSelected = (nodeId: string): boolean => {
    return this.state.selectedNodeIds.indexOf(nodeId) > -1
  }

  private selectAllOnClick = (checked: boolean) => {
    if (checked) {
      const selectedNodeIds = this.state.nodes.map((node) => node.get('id'))
      this.setState({selectedNodeIds: selectedNodeIds} as State)
    } else {
      this.setState({selectedNodeIds: Immutable.List()} as State)
    }
  }

  private deleteSelectedNodes = () => {
    if (confirm(`Do you really want to delete ${this.state.selectedNodeIds.size} node(s)?`)) {
      // only reload once after all the deletions
      Promise.all(this.state.selectedNodeIds.toArray().map((nodeId) => this.deleteNode(nodeId)))
        .then(() => this.reloadData())
        .then(() => {
          this.setState({loading: false} as State)
        })

      this.setState({selectedNodeIds: Immutable.List()} as State)
    }
  }
}

const mapStateToProps = (state) => {
  return {
    gettingStartedState: state.gettingStartedState,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({nextStep: nextStep}, dispatch)
}

const ReduxContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BrowserView))

const MappedBrowserView = mapProps({
  params: (props) => props.params,
  fields: (props) => (
    props.viewer.model.fields.edges
      .map((edge) => edge.node)
      .sort(compareFields)
  ),
  model: (props) => props.viewer.model,
  project: (props) => props.viewer.project,
  viewer: (props) => props.viewer,
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
                    fields(first: 1000) {
                        edges {
                            node {
                                id
                                name
                                typeIdentifier
                                isList
                                ${HeaderCell.getFragment('field')}
                            }
                        }
                    }
                    ${Row.getFragment('model')}
                    ${NewRow.getFragment('model')}
                    ${ModelHeader.getFragment('model')}
                }
                project: projectByName(projectName: $projectName) {
                    id
                    ${ModelHeader.getFragment('project')}
                }
                ${ModelHeader.getFragment('viewer')}
            }
        `,
    },
})
