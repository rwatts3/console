import * as React from 'react'
import * as Relay from 'react-relay'
import {$p} from 'graphcool-styles'
import * as cx from 'classnames'
import {Operation, Field} from '../../../types/types'
import mapProps from '../../../components/MapProps/MapProps'
import PermissionField from '../PermissionsList/ModelPermissions/PermissionField'
import {validPermissionField} from '../../../utils/valueparser'

interface Props {
  fields: Field[]
  fieldIds: string[]
  toggleField: (id: string) => void
  selectedOperation: Operation
}

class AffectedFields extends React.Component<Props, {}> {

  render() {
    const {fields, fieldIds, toggleField, selectedOperation} = this.props
    return (
      <div className={cx($p.bt, $p.bBlack10)}>
        <div className={cx($p.pa38)}>
          <h2 className={cx($p.mb10, $p.fw3)}>Affected Fields</h2>
          <div className={$p.black50}>The Fields that are affected by this permission</div>
          <div className={$p.mt16}>
            {fields
              .filter(field => validPermissionField(selectedOperation, field))
              .map(field => (
              <PermissionField
                key={field.id}
                name={field.name}
                disabled={false}
                selected={fieldIds.includes(field.id)}
                onClick={() => toggleField && toggleField(field.id)}
                className={$p.pointer}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

const MappedAffectedFields = mapProps({
  fields: props => props.model.fields.edges.map(edge => edge.node),
})(AffectedFields)

export default Relay.createContainer(MappedAffectedFields, {
  fragments: {
    model: () => Relay.QL`
      fragment on Model {
        fields(first: 100) {
          edges {
            node {
              id
              name
              typeIdentifier
            }
          }
        }
      }
    `,
  },
})
