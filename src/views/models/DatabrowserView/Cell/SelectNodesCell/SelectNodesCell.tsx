import * as React from 'react'
import * as fetch from 'isomorphic-fetch'
import * as Modal from 'react-modal'
import {Icon, $v} from 'graphcool-styles'
import Table from './Table'
import SearchBox from './SearchBox'
import * as Immutable from 'seamless-immutable'
import modalStyle from '../../../../../utils/modalStyle'
import {Model, Field} from '../../../../../types/types'
import * as Relay from 'react-relay'
import mapProps from 'map-props'
import {isScalar} from '../../../../../utils/graphql'

interface State {
  startIndex: number
  stopIndex: number
  items: any[]
  count: number
  query: string
  selectedRowIndex: number
  scrollToIndex?: number
}

interface Props {
  projectId: string
  model: Model
  fields: Field[]
  values: string[]
  multiSelect: boolean
  save: (values: string[]) => void
  cancel: () => void
  endpointUrl: string
  adminAuthToken: string
}

class SelectNodesCell extends React.Component<Props, State> {

  private style: any
  private lastQuery: string

  constructor(props) {
    super(props)

    this.state = {
      startIndex: 0,
      stopIndex: 50,
      items: Immutable([]),
      query: '',
      count: 0,
      selectedRowIndex: -1,
      scrollToIndex: undefined,
    }

    this.getItems({startIndex: 0, stopIndex: 50}, props.fields)

    this.style = Object.assign({}, modalStyle, {
      overlay: modalStyle.overlay,
      content: Object.assign({}, modalStyle.content, {
        width: 'auto',
        minWidth: '600px',
        maxWidth: window.innerWidth - 100 + 'px',
      }),
    })

    global['s'] = this
  }

  componentWillReceiveProps(nextProps) {
    const {startIndex, stopIndex} = this.state

    if (nextProps.userFields.length !== this.props.fields.length) {
      this.getItems({startIndex, stopIndex}, nextProps.fields)
    }
  }

  render() {

    const {model, fields} = this.props
    // put id to beginning
    return (
      <Modal
        isOpen={true}
        onRequestClose={this.props.cancel}
        contentLabel={`Select a ${model.name}`}
        style={this.style}
      >
        <style jsx>{`
          .select-user-popup {
            @p: .bgWhite, .relative, .mh25;
          }
          .title-wrapper {
            @p: .flex, .w100, .itemsCenter, .justifyCenter, .bb, .bBlack10;
            padding: 45px;
          }
          .title {
            @p: .fw3, .f38;
            letter-spacing: 0.54px;
          }
          .search {
            @p: .absolute, .w100, .bbox, .ph38, .z2, .flex, .justifyCenter;
            margin-top: -24px;
          }
          .search-box {
            flex: 0 1 400px;
          }
          .selected-user {
            @p: .ml25, .flex, .flexColumn, .justifyCenter, .itemsCenter;
          }
          .selected-user-id {
            @p: .bgBlack04, .pa6, .br2, .black60, .f14, .fw3, .mt10;
            font-family:
              'Source Code Pro',
              'Consolas',
              'Inconsolata',
              'Droid Sans Mono',
              'Monaco',
              monospace;
          }
      `}</style>
        <style jsx global>{`
          .popup-x {
            @p: .absolute, .right0, .top0, .pointer, .pt25, .pr25;
          }
        `}</style>
        <div className='select-user-popup'>
          <div className='title-wrapper'>
            <div className='title'>
              Select a {model.name}
            </div>
            {this.state.selectedRowIndex > -1 && (
              <div className='selected-user'>
                <div>Selected {model.name} ID</div>
                <div className='selected-user-id'>{this.state.items[this.state.selectedRowIndex].id}</div>
              </div>
            )}
          </div>
          <Icon
            src={require('graphcool-styles/icons/stroke/cross.svg')}
            stroke={true}
            width={25}
            height={25}
            strokeWidth={2}
            className='popup-x'
            color={$v.gray50}
            onClick={this.props.cancel}
          />
          <div className='search'>
            <div className='search-box'>
              <SearchBox
                placeholder={`Search for a ${model.name} ...`}
                onSearch={this.handleSearch}
                isShown
                clean
              />
            </div>
          </div>
          <Table
            fields={fields}
            model={this.props.model}
            rows={this.state.items}
            rowCount={this.state.count}
            loadMoreRows={this.getItems}
            onRowSelection={this.handleRowSelection}
            scrollToIndex={this.state.scrollToIndex}
          />
        </div>
      </Modal>
    )
  }

  private handleRowSelection = ({index, rowData}) => {
    if (index === this.state.selectedRowIndex) {
      return
    }

    this.setState(state => {
      let {items} = state

      if (state.selectedRowIndex > -1) {
        items = Immutable.setIn(items, [state.selectedRowIndex, 'selected'], false)
      }

      items = Immutable.setIn(items, [index, 'selected'], true)

      return {
        ...state,
        items,
        selectedRowIndex: index,
      }
    })
  }

  private handleSearch = (value) => {
    this.setState({query: value} as State, () => {
      const {startIndex, stopIndex} = this.state
      this.getItems({startIndex, stopIndex})
    })
  }

  /**
   * Gets items according to the settings
   * @param startIndex
   * @param stopIndex
   * @param customFields As we run this function in the constructor (where the props are not yet avilable on this),
   *        we make this available as a parameter
   */
  private getItems = ({startIndex, stopIndex}: {startIndex: number, stopIndex: number}, customFields?: Field[]) => {
    const {query} = this.state
    const fields = customFields || this.props.fields

    if (fields.length === 0) {
      return
    }

    let filter = ''
    if (query && query.length > 0) {
      filter = ' filter: { OR: ['

      const whiteList = ['GraphQLID', 'String', 'Enum']

      const filtered = fields.filter((field: Field) => {
        return whiteList.indexOf(field.typeIdentifier.toString()) > -1
      })

      filter += filtered.map(field => `{${field.name}_contains: "${query}"}`).join(',\n')

      filter += ']}'
    }

    const count = stopIndex - startIndex
    const userQuery = `
      {
        ${this.getAllNameMeta()} {
          count
        }
        ${this.getAllName()}(skip: ${startIndex} first: ${count}${filter}){
          ${fields.map(f => f.name + (isScalar(f.typeIdentifier) ? '' : ' {id} ')).join('\n')}
        }
      }
    `

    fetch(
      this.props.endpointUrl,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.adminAuthToken}`,
          'X-GraphCool-Source': 'playground',
        },
        body: JSON.stringify({query: userQuery}),
      },
    )
      .then(res => res.json())
      .then(res => {

        const meta = res.data[this.getAllNameMeta()]
        const newItems = res.data[this.getAllName()]

        let {items} = this.state

        // reset data if search changed
        if (query !== this.lastQuery) {
          items = Immutable([])
        }

        newItems.forEach((item, i) => {
          items = Immutable.set(items, (i + startIndex), item)
        })

        let newState = {
          items,
          count: meta.count,
        }

        if (this.lastQuery !== this.state.query) {

          newState['scrollToIndex'] = 0

          setTimeout(
            () => {
              this.setState({
                scrollToIndex: undefined,
              } as State)
            },
            150,
          )
        }

        this.setState(newState as State)

        this.lastQuery = query
      })
      .catch(e => console.error(e))
  }

  private getAllName() {
    return `all${this.props.model.namePlural}`
  }

  private getAllNameMeta() {
    return `_${this.getAllName()}Meta`
  }
}

const MappedSelectNodesCell = mapProps({
  model: props => props.model,
  fields: props => props.model.fields.edges.map(edge => edge.node),
})(SelectNodesCell)

export default Relay.createContainer(MappedSelectNodesCell, {
  fragments: {
    model: () => Relay.QL`
      fragment on Model {
        id
        name
        namePlural
        ${Table.getFragment('model')}
        fields(first: 1000) {
          edges {
            node {
              id
              typeIdentifier
              name
            }
          }
        }
      }
    `,
  },
})
