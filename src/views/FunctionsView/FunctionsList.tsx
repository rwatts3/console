import * as React from 'react'
import * as Relay from 'react-relay'
import mapProps from '../../components/MapProps/MapProps'
import {Project, ServerlessFunction} from '../../types/types'
import {Link} from 'react-router'

interface Props {
  project: Project
  functions: ServerlessFunction[]
}

interface State {
}

class FunctionsList extends React.Component<Props, State> {

  render() {
    const {functions, project} = this.props
    return (
      <div className='functions'>
        <style jsx={true}>{`
          .functions {
            @p: .w100;
          }
          .function {
            @p: .pa16, .bb, .bBlack10, .flex, .justifyBetween;
          }
          .function :global(a) {
            @p: .ml16;
          }
        `}</style>
        {functions.map(fn => (
          <div key={fn.id} className='function'>
            <span>{fn.name}</span>
            <div className='flex'>
              <Link to={`/${project.name}/functions/${fn.id}/edit`}>edit</Link>
              <Link to={`/${project.name}/functions/${fn.id}/logs`}>logs</Link>
            </div>
          </div>
        ))}
      </div>
    )
  }
}

const FunctionsListMapped = mapProps({
  functions: props => props.project.functions.edges.map(edge => edge.node),
})(FunctionsList)

export default Relay.createContainer(FunctionsListMapped, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        name
        functions(first: 100) {
          edges {
            node {
              id
              name
              
            }
          }
        }
      },
    `,
  },
})
