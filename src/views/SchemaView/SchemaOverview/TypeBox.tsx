import * as React from 'react'
import {Model} from '../../../types/types'
import * as Relay from 'react-relay'
import FieldItem from './FieldItem'
import {Link} from 'react-router'

interface Props {
  projectName: string
  model: Model
  extended: boolean
}

class TypeBox extends React.Component<Props,null> {
  render() {
    const {model, extended, projectName} = this.props
    const fields = model.fields.edges.map(edge => edge.node)
    return (
      <div className='type-box'>
        <style jsx>{`
          .type-box {
            @p: .br2, .bgWhite, .mb16, .relative, .w100;
          }
          .type-box-head {
            @p: .pb12, .flex, .itemsCenter, .bb, .bBlack10;
            padding-top: 15px;
          }
          .type-box-body {
          }
          .title {
            @p: .f20, .fw6, .black80, .ml12;
            letter-spacing: 0.53px;
          }
          .extend-button {
            @p: .bgGreen, .br2, .relative, .flex, .itemsCenter, .justifyCenter;
            left: -4px;
            width: 16px;
            height: 16px;
          }
          .flat-field-list {
            @p: .black60, .fw6, .f14, .pa16;
          }
          .big-field-list {
            @p: .w100;
          }
        `}</style>
        <div className='type-box-head'>
          <div className='extend-button'></div>
          <div className='title'>{model.name}</div>
        </div>
        <div className='type-box-body'>
          {!extended && (
            <div className='flat-field-list'>
              {fields.map((field, index) => {
                const text = field.name + (index < (fields.length - 1) ? ', ' : '')
                return (
                  field.isSystem ? (
                    <span key={field.id}>{text}</span>
                  ) : (
                    <Link key={field.id} to={`/${projectName}/schema/${model.name}/edit/${field.name}`}>
                      {text}
                    </Link>
                  )
                )
              })}
            </div>
          )}
          {extended && (
            <div className='big-field-list'>
              {fields.map(field => (
                <FieldItem
                  key={field.id}
                  field={field}
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
}

export default Relay.createContainer(TypeBox, {
  fragments: {
    model: () => Relay.QL`
      fragment on Model {
        id
        name
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
            }
          }
        }
      }
    `,
  },
})
