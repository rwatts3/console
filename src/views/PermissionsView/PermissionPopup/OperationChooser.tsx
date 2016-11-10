import * as React from 'react'
import {Operation} from '../../../types/types'
import * as cx from 'classnames'
import {$p, Icon, variables} from 'graphcool-styles'
import styled from 'styled-components'

interface Props {
  setOperation: (operation: Operation) => void
  selectedOperation: Operation
}

const operations = [
  {
    icon: require('graphcool-styles/icons/stroke/editAddSpaced.svg'),
    text: 'Create Node',
    operation: 'CREATE',
  },
  {
    icon: require('graphcool-styles/icons/stroke/deleteSpaced.svg'),
    text: 'Delete Node',
    operation: 'DELETE',
  },
  {
    icon: require('graphcool-styles/icons/stroke/viewSpaced.svg'),
    text: 'View Data',
    operation: 'READ',
  },
  {
    icon: require('graphcool-styles/icons/stroke/editSpaced.svg'),
    text: 'Edit Data',
    operation: 'UPDATE',
  },
]

const Placeholder = styled.div`
  left: -10px;
`

const OperationButton = styled.div`
  &:not(.${$p.bgBlue}):hover {
    background-color: ${variables.gray04};
    position: absolute;
    padding: 6px;
  }
`

export default class OperationChooser extends React.Component<Props, {}> {
  render() {
    const {selectedOperation, setOperation} = this.props

    return (
      <div className={$p.pb38}>
        <div
          className={cx($p.pa38)}
        >
          <h2 className={cx($p.fw3, $p.mb10)}>Operation</h2>
          <div className={$p.black50}>The Operation that needs to be restricted by the permission</div>
        </div>
        <div
          className={cx(
            $p.bgBlack04,
            $p.flex,
            $p.flexRow,
            $p.justifyAround,
            $p.ph16,
            $p.pv6,
            $p.relative,
            $p.itemsCenter,
           )}
        >
          {selectedOperation === null && (
            <Placeholder className={cx($p.absolute, $p.br2, $p.pv8, $p.ph10, $p.bgBlue)}>
              &nbsp;
            </Placeholder>
          )}
          {operations.map(operation => (
            <div
              key={operation.operation}
              className={cx($p.relative, $p.flex1, $p.flex, $p.itemsCenter, $p.justifyCenter, $p.pointer)}
              onClick={() => setOperation(operation.operation as Operation)}
            >
              <OperationButton
                className={cx($p.nowrap, $p.flex, $p.flexRow, $p.itemsCenter, {
                  [cx($p.bgBlue, $p.br2, $p.absolute, $p.ph10, $p.pv8)]: operation.operation === selectedOperation,
                })}
              >
                <Icon
                  stroke={true}
                  strokeWidth={2}
                  src={operation.icon}
                  color={operation.operation === selectedOperation ? variables.white : variables.gray30}
                  width={23}
                  height={23}
                />
                <div
                  className={cx($p.ml6, $p.black30, $p.ttu, $p.fw6, $p.f14, {
                      [$p.black30]: operation.operation !== selectedOperation,
                      [$p.white]: operation.operation === selectedOperation,
                    }
                  )}
                >
                  {operation.text}
                </div>
              </OperationButton>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
