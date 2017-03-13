import * as React from 'react'
import {Model} from '../../../types/types'
import * as Relay from 'react-relay'
import FieldItem from './FieldItem'
import {Link} from 'react-router'
import {Icon, $v} from 'graphcool-styles'
import {isScalar} from '../../../utils/graphql'
import TypeBoxSettings from './TypeBoxSettings'

interface Props {
  projectName: string
  model: Model
  extended: boolean
  onEditModel: (model: Model) => void
}

interface State {
  extended: boolean
}

class TypeBox extends React.Component<Props,State> {
  constructor(props) {
    super(props)

    this.state = {
      extended: false,
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.extended && !this.props.extended && nextProps.extended) {
      this.setState({extended: false})
    }
  }
  render() {
    const {model, projectName} = this.props
    const propsExtended = this.props.extended
    const stateExtended = this.state.extended
    const extended = propsExtended || stateExtended
    const fields = model.fields.edges.map(edge => edge.node)
    const permissions = model.permissions.edges.map(edge => edge.node)
    return (
      <div className='type-box'>
        <style jsx>{`
          .type-box {
            @p: .br2, .bgWhite, .mb16, .relative, .w100;
            box-shadow: 0 1px 10px $gray30;
          }
          .type-box-head {
            @p: .pb16, .flex, .itemsCenter, .bb, .bBlack10, .relative, .justifyBetween;
            padding-top: 15px;
          }
          .flexy {
            @p: .flex, .itemsCenter;
          }
          .type-box-head.extended {
            @p: .pb25;
          }
          .type-box-body.extended {
            @p: .mt16;
          }
          .title {
            @p: .f20, .fw6, .black80, .ml12;
            letter-spacing: 0.53px;
          }
          .extend-button {
            @p: .bgGreen, .br2, .relative, .flex, .itemsCenter, .justifyCenter, .pointer;
            left: -4px;
            width: 16px;
            height: 16px;
          }
          .extend-button :global(i) {
            @p: .o0;
          }
          .extend-button:hover :global(i) {
            @p: .o100;
          }
          .flat-field-list {
            @p: .black60, .fw6, .f14, .pa16;
          }
          .big-field-list {
            @p: .w100;
          }
          .add-button {
            @p: .bgWhite, .relative, .br2, .buttonShadow, .black60, .ttu, .fw6, .f12, .pa6, .flex, .ml10, .pointer;
            :global(i) {
            }
          }
          .add-button :global(i) {
              @p: .o30;
          }
          .add-button:hover {
            @p: .blue;
          }
          .add-button:hover :global(svg) {
            stroke: $blue !important;
          }
          .add-buttons {
            @p: .absolute, .flex;
            left: -14px;
            bottom: -15px;
          }
          .setting {
            @p: .pv10, .ph16, .flex, .itemsCenter;
            .text {
              @p: .ml10, .f14, .fw6, .black60, .ttu;
            }
          }
        `}</style>
        <div className={'type-box-head' + (extended ? ' extended' : '')}>
          <div className='flexy'>
            <div className='extend-button' onClick={this.toggleExtended}>
              <Icon
                src={require('graphcool-styles/icons/stroke/arrowDown.svg')}
                stroke
                color={$v.white}
                strokeWidth={4}
                rotate={extended ? 180 : 0}
                height={16}
                width={16}
              />
            </div>
            <div className='title'>{model.name}</div>
            {extended && (
              <div className='add-buttons'>
                <Link to={`/${projectName}/schema/${model.name}/create`}>
                  <div className='add-button'>
                    <Icon src={require('assets/icons/addField.svg')} strokeWidth={1.5} stroke color={$v.black} />
                    <span>Add Field</span>
                  </div>
                </Link>
                <Link to={`/${projectName}/relations/create?leftModelName=${model.name}`}>
                  <div className='add-button'>
                    <Icon src={require('assets/icons/addRelation.svg')} strokeWidth={1.5} stroke color={$v.black} />
                    <span>Add Relation</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
          {!model.isSystem && (
            <TypeBoxSettings>
              <div className='setting' onClick={() => this.props.onEditModel(model)}>
                <Icon
                  src={require('graphcool-styles/icons/fill/settings.svg')}
                  color={$v.gray20}
                />
                <div className='text'>Type Settings</div>
              </div>
            </TypeBoxSettings>
          )}
        </div>
        <div className={'type-box-body' + (extended ? ' extended' : '')}>
          {!extended && (
            <div className='flat-field-list'>
              {fields.map((field, index) => {
                const text = field.name + (index < (fields.length - 1) ? ', ' : '')
                let link = `/${projectName}/schema/${model.name}/edit/${field.name}`
                if (!isScalar(field.typeIdentifier)) {
                  link = `/${projectName}/schema/relations/edit/${field.relation.name}`
                }
                return (
                  field.isSystem ? (
                    <span key={field.id}>{text}</span>
                  ) : (
                    <Link key={field.id} to={link}>
                      {text}
                    </Link>
                  )
                )
              })}
            </div>
          )}
          {extended && (
            <div className='big-field-list'>
              {fields.map((field, index) => (
                <FieldItem
                  key={field.id}
                  field={field}
                  permissions={permissions}
                  hideBorder={index === 0}
                  projectName={this.props.projectName}
                  modelName={model.name}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  private toggleExtended = () => {
    this.setState(({extended}) => {
      return {
        extended: !extended,
      }
    })
  }
}

export default Relay.createContainer(TypeBox, {
  fragments: {
    model: () => Relay.QL`
      fragment on Model {
        id
        name
        isSystem
        permissions(first: 100) {
          edges {
            node {
              isActive
              operation
              applyToWholeModel
              fieldIds
            }
          }
        }
        fields(first: 100) {
          edges {
            node {
              id
              name
              typeIdentifier
              isList
              isRequired
              isSystem
              isUnique
              isReadonly
              relation {
                name
              }
              relatedModel {
                id
                name
              }
            }
          }
        }
      }
    `,
  },
})
