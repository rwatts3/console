import * as React from 'react'
import * as Relay from 'react-relay'
import {$p, variables, Icon} from 'graphcool-styles'
import * as cx from 'classnames'
import {Operation, Field} from '../../../types/types'
import mapProps from '../../../components/MapProps/MapProps'
import PermissionField from '../PermissionsList/ModelPermissions/PermissionField'
import {validPermissionField} from '../../../utils/valueparser'
import styled from 'styled-components'

interface Props {
  fields: Field[]
  fieldIds: string[]
  toggleField: (id: string) => void
  selectedOperation: Operation
  applyToWholeModel: boolean
  toggleApplyToWholeModel: () => void
}

const ApplyButton = styled.div`
  &:not(.${$p.bgBlue}):hover {
    background-color: ${variables.gray10};
  }
`

class AffectedFields extends React.Component<Props, {}> {

  render() {
    const {fields, fieldIds, toggleField, selectedOperation, applyToWholeModel, toggleApplyToWholeModel} = this.props
    const fieldsFiltered = fields
      .filter(field => validPermissionField(selectedOperation, field))

    return (
      <div className={cx($p.bt, $p.bBlack10)}>
        <div className={cx($p.pa38)}>
          <div className={cx($p.flex, $p.flexRow, $p.itemsCenter, $p.justifyBetween)}>
            <h2 className={cx($p.mb10, $p.fw3)}>Affected Fields</h2>
            <ApplyButton
              className={cx(
                $p.pv6, $p.ph10, $p.ttu, $p.f14, $p.fw6, $p.pointer, $p.flex, $p.flexRow, $p.itemsCenter,
                {
                  [cx($p.bgBlack04, $p.black30)]: !applyToWholeModel,
                  [cx($p.bgBlue, $p.white)]: applyToWholeModel,
                }
              )}
              onClick={toggleApplyToWholeModel}
            >
              {applyToWholeModel && (
                <Icon
                  src={require('graphcool-styles/icons/fill/check.svg')}
                  color={variables.white}
                  className={$p.mr4}
                />
              )}
              Apply to whole Model
            </ApplyButton>
          </div>
          <div className={$p.black50}>The Fields that are affected by this permission</div>
          <div className={$p.mt16}>
            {fieldsFiltered.length === 0 && (
              <div className={$p.brown}>
                No fields can be effected by this permission,
                as mutation permissions can't be applied to readonly fields
              </div>
            )}
            {fieldsFiltered
              .map(field => (
                <PermissionField
                  key={field.id}
                  name={field.name}
                  disabled={applyToWholeModel}
                  selected={fieldIds.includes(field.id) || applyToWholeModel}
                  onClick={() => toggleField && toggleField(field.id)}
                  className={cx($p.pointer, $p.mr10, $p.mb10)}
                />
              )
            )}
          </div>
        </div>
      </div>
    )
  }
}

const MappedAffectedFields = mapProps({
  fields: props => {
    return props.model.fields.edges.map(edge => edge.node)
  },
})(AffectedFields)

export default Relay.createContainer(MappedAffectedFields, {
  fragments: {
    model: () => Relay.QL`
      fragment on Model {
        fields(first: 100) {
          edges {
            node {
              id
              isReadonly
              name
              typeIdentifier
            }
          }
        }
      }
    `,
  },
})
