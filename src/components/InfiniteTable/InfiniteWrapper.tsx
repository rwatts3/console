import * as React from 'react'
import {isScalar, isNonScalarList} from '../../utils/graphql'
import * as Immutable from 'immutable'
import * as Relay from 'react-relay'
import InfiniteTable from './InfiniteTable'
import * as cookiestore from '../../utils/cookiestore'
import {Lokka} from 'lokka'
import {Transport} from 'lokka-transport-http'
import 'react-virtualized/styles.css'

interface Props {
  viewer: any
}

interface State {
  nodes: Immutable.Map<number, Immutable.Map<string, any>>
}

class InfiniteWrapper extends React.Component<Props, State> {

  private lokka: any

  constructor(props) {
    super(props)
    const clientEndpoint = `${__BACKEND_ADDR__}/simple/v1/${this.props.viewer.project.id}`
    const token = cookiestore.get('graphcool_auth_token')
    const headers = {Authorization: `Bearer ${token}`, 'X-GraphCool-Source': 'dashboard:data-tab'}
    const transport = new Transport(clientEndpoint, {headers})

    this.lokka = new Lokka({transport})
    this.state = {
      nodes: Immutable.Map<number, Immutable.Map<string, any>>()
    }
  }

  render() {
    return (
      <div style={{height: '100vh'}}>
        <InfiniteTable
          rowCount={this.props.viewer.model.itemCount}
          columnCount={this.props.viewer.model.fields.edges.length}
          columnWidth={() => 500}
          headerHeight={30}
          rowHeight={30}
          headerRenderer={this.headerRenderer}
          cellRenderer={this.cellRenderer}
          loadingCellRenderer={() => 'loading'}
          loadMoreRows={(input) => this.loadData(input.startIndex)}
        />
      </div>
     )
   }

   private getFieldName = (index: number): string => {
      return this.props.viewer.model.fields.edges.map((edge) => edge.node)[index].name
   }

   private headerRenderer = (input) => {
      return this.getFieldName(input.columnIndex)
   }

   private cellRenderer = (input) => {
     return (
       <div>
         {this.state.nodes.get(input.rowIndex).get(this.getFieldName(input.columnIndex))}
       </div>
     )
   }

   private loadData = (skip: number): Promise<Immutable.List<Immutable.Map<string, any>>> => {
     console.log('skip ' + skip)
     const fieldNames = this.props.viewer.model.fields.edges.map((edge) => edge.node)
     .map((field) => isScalar(field.typeIdentifier)
       ? field.name
       : `${field.name} { id }`)
       .join(' ')

       const query = `
       {
         all${this.props.viewer.model.namePlural}(first: 50 skip: ${skip}) {
           ${fieldNames}
         }
       }
       `
       return this.lokka.query(query)
       .then((results) => {
         const nodes = Immutable.List(results[`all${this.props.viewer.model.namePlural}`]).map(Immutable.Map)
         const nodeMap = nodes.reduce((result, item, index) => result.set(skip + index, nodes.get(index)), Immutable.Map<number, any>())
         // console.log(results)
         // console.log(this.state.nodes.merge(nodeMap))
         this.setState({nodes: this.state.nodes.merge(nodeMap)})
         return nodes
       })
       .catch((err) => {
         throw err
       })
   }
}

export default Relay.createContainer(InfiniteWrapper, {
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
              }
            }
          }
        }
        project: projectByName(projectName: $projectName) {
          id
        }
      }
    `,
  },
})
