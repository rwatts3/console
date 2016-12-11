import * as React from 'react' // tslint:disable-line
import { $p, variables, Icon } from 'graphcool-styles'
import styled from 'styled-components'
import * as cx from 'classnames'
import { QueryEditor } from 'graphiql/dist/components/QueryEditor'
import { buildClientSchema } from 'graphql'
require('../../../styles/codemirror.css')

const ConditionButton = styled.div`
  &:not(.${$p.bgBlue}):hover {
    background-color: ${variables.gray10};
  }
`

export default (props) => (
  <div className={cx($p.bgBlack04, $p.bt, $p.bb, $p.bBlack10)}>
    <div
      className={cx($p.pa38)}
    >
      <h2 className={cx($p.fw3, $p.mb10)}>Conditions</h2>
      <div className={$p.black40}>The conditions that restrict the model</div>
      <div className={cx($p.dib, $p.mt25, $p.w100)}>
        <div
          className={cx(
            $p.flex,
            $p.flexRow,
            $p.justifyAround,
            $p.ph16,
            $p.pv6,
            $p.relative,
            $p.itemsCenter,
           )}
        >
          <div
            className={cx($p.relative, $p.flex, $p.itemsCenter, $p.justifyCenter, $p.pointer)}
            onClick={() => props.setUserType && props.setUserType('EVERYONE')}
            style={{width: 70}}
          >
            <ConditionButton
              className={cx($p.nowrap, $p.absolute, $p.ph10, $p.flex, $p.flexRow, $p.itemsCenter, {
                  [cx($p.pv6, $p.bgBlack04)]: props.userType !== 'EVERYONE',
                  [cx($p.bgBlue, $p.br2, $p.pv8, $p.z1)]: props.userType === 'EVERYONE',
                })}
            >
              <div
                className={cx($p.ml6, $p.ttu, $p.fw6, $p.f14, {
                    [$p.black30]: props.userType !== 'EVERYONE',
                    [$p.white]: props.userType === 'EVERYONE',
                  },
                )}
              >
                Everyone
              </div>
            </ConditionButton>
          </div>
          <div
            className={cx($p.relative, $p.flex, $p.itemsCenter, $p.justifyCenter, $p.pointer)}
            onClick={() => props.setUserType && props.setUserType('AUTHENTICATED')}
            style={{width: 190}}
          >
            <ConditionButton
              className={cx($p.nowrap, $p.absolute, $p.ph10, $p.flex, $p.flexRow, $p.itemsCenter, {
                  [cx($p.pv6, $p.bgBlack04)]: props.userType !== 'AUTHENTICATED',
                  [cx($p.bgBlue, $p.br2, $p.pv8, $p.z1)]: props.userType === 'AUTHENTICATED',
                })}
            >
              <div
                className={cx($p.ml6, $p.ttu, $p.fw6, $p.f14, {
                    [$p.black30]: props.userType !== 'AUTHENTICATED',
                    [$p.white]: props.userType === 'AUTHENTICATED',
                  },
                )}
              >
                Authenticated
              </div>
              <Icon
                color={props.userType === 'AUTHENTICATED' ? variables.white : variables.gray30}
                stroke={true}
                strokeWidth={4}
                src={require('graphcool-styles/icons/stroke/lock.svg')}
                className={$p.ml6}
              />
            </ConditionButton>
          </div>
          <div className={cx($p.flexAuto)}>
          </div>
          {props.isBetaCustomer && <div
            className={cx($p.relative, $p.flex, $p.itemsCenter, $p.justifyEnd, $p.pointer)}
            onClick={() => {
              console.log('clicked', props.rule)
              const newRuleType = props.rule === 'NONE' ? 'GRAPH' : 'NONE'
              if (props.setRuleType) {
                props.setRuleType(newRuleType)
              }
            }}
            style={{width: 190}}
          >
            <ConditionButton
              className={cx($p.nowrap, $p.absolute, $p.ph10, $p.flex, $p.flexRow, $p.itemsCenter, {
                  [cx($p.pv6, $p.bgBlack04)]: props.rule === 'NONE',
                  [cx($p.bgBlue, $p.br2, $p.pv8, $p.z1)]: props.rule !== 'NONE',
                })}
            >
              <div
                className={cx($p.ml6, $p.mr6, $p.ttu, $p.fw6, $p.f14, {
                    [$p.black30]: props.rule === 'NONE',
                    [$p.white]: props.rule !== 'NONE',
                  },
                )}
              >
                Rule
              </div>
            </ConditionButton>
          </div>}
        </div>
      </div>

      {props.rule === 'GRAPH' && <div
        className={cx($p.mt25)}>
        <QueryEditor
          className={cx($p.z9999)}
          schema={buildClientSchema(JSON.parse(props.permissionSchema))}
          value={props.ruleGraphQuery}
          onEdit={(query) => props.setRuleGraphQuery(query)}/>
      </div>}

    </div>
  </div>
)
