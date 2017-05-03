import * as React from 'react'
import * as Relay from 'react-relay'
import {Link} from 'react-router'
import {ServerlessFunction} from '../../types/types'
import NewToggleButton from '../../components/NewToggleButton/NewToggleButton'
import {withRouter} from 'react-router'
import {Icon, $v} from 'graphcool-styles'

interface Props {
  fn: ServerlessFunction
  params: any
  router: ReactRouter.InjectedRouter
}

interface State {

}

class FunctionRow extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    const {fn, params: {projectName}} = this.props
    const link = `/${this.props.params}/functions/${this.props.fn.id}/edit`
    return (
      <tr key={fn.id} onClick={this.edit}>
        <style jsx={true}>{`
          .function {
            @p: .pa16, .bb, .bBlack10, .flex, .justifyBetween;
          }
          .function :global(a) {
            @p: .ml16;
          }
          tr {
            @p: .mh16;
          }
          tr:hover td {
            @p: .bgDarkBlue04;
          }
          td {
            @p: .pa20, .pointer;
            border-bottom: 2px solid rgba(23,42,58,.06);
          }
          .toggle {
            @p: .flex, .itemsCenter;
          }
          .name {
            @p: .f16, .darkBlue;
          }
          .badge {
            @p: .br2, .bgBlack04, .f12, .fw6, .ttu, .black50, .ml10;
            padding: 2px 6px;
          }
          .event-type {
            @p: .f12, .fw6, .darkBlue40, .ttu, .flex, .itemsCenter;
            letter-spacing: 0.4px;
          }
          .event-type span {
            @p: .ml10;
          }
          .bad, .good {
            @p: .f12, .fw6, .tr;
          }
          .good {
            @p: .green;
          }
          .time {
            @p: .f14, .darkBlue50, .ml38;
          }
          .requests {
            @p: .flex, .itemsCenter;
          }
        `}</style>
        <td>
          <div className='toggle'>
            <NewToggleButton
              defaultChecked
              onChange={this.toggle}
            />
          </div>
        </td>
        <td>
          <Link to={link}>
            <span className='name'>{fn.name}</span>
            <span className='badge'>Webhook</span>
          </Link>
        </td>
        <td>
          <Link to={link}>
            <div className='event-type'>
              <Icon
                src={require('graphcool-styles/icons/fill/requestpipeline.svg')}
                color={$v.darkBlue50}
                width={55}
              />
              <span>Request Pipeline</span>
            </div>
          </Link>
        </td>
        <td>
          <Link to={link}>
            <div className='requests'>
              <div className='good'>103</div>
              <div className='time'>15 min ago</div>
            </div>
          </Link>
        </td>
        <td>
          <Link to={`/${this.props.params.projectName}/functions/${this.props.fn.id}/logs`}>
            <Icon
              src={require('graphcool-styles/icons/fill/logs.svg')}
              color={$v.green}
              width={28}
              height={28}
            />
          </Link>
        </td>
      </tr>
    )
  }

  private edit = () => {
    // this.props.router.push()
  }

  private toggle = () => {
    // lets toggle
  }
}

export default Relay.createContainer(withRouter(FunctionRow), {
  fragments: {
    fn: () => Relay.QL`
      fragment on Function {
        id
        name
        ... on RequestPipelineMutationFunction {
          binding
        }
      },
    `,
  },
})
