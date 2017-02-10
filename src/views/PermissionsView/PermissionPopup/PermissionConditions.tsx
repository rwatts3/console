import * as React from 'react' // tslint:disable-line
import {$p, Icon, $v} from 'graphcool-styles'
import styled from 'styled-components'
import * as cx from 'classnames'
import {buildClientSchema} from 'graphql'
import {CustomGraphiQL} from 'graphcool-graphiql'
import {UserType, PermissionRuleType, Operation, Field, FieldType, PermissionVariable} from '../../../types/types'
import {texts} from '../../../utils/permission'
import PermissionField from '../PermissionsList/ModelPermissions/PermissionField'
import VariableTag from './VariableTag'
import {flatMap} from 'lodash'
import {putVariablesToQuery, getVariableNamesFromQuery} from './ast'
import {debounce} from '../../../utils/utils'
import * as Modal from 'react-modal'
import {fieldModalStyle} from '../../../utils/modalStyle'

const ConditionButton = styled.div`
  &:not(.${$p.bgBlue}):hover {
    background-color: ${$v.gray10};
  }
`

const modalStyling = {
  ...fieldModalStyle,
  content: {
    ...fieldModalStyle.content,
    width: window.innerWidth,
  },
  overlay: {
    ...fieldModalStyle.overlay,
    backgroundColor: 'rgba(15,32,46,.9)',
  },
}

interface Props {
  setUserType: (userType: UserType) => void
  userType: UserType
  isBetaCustomer: boolean
  setRuleType: (ruleType: PermissionRuleType) => void
  rule: PermissionRuleType
  permissionSchema: string
  ruleGraphQuery: string
  setRuleGraphQuery: (query: string) => void
  operation: Operation
  fields: Field[]
}

interface State {
  selectedVariableNames: string[]
  fullscreen: boolean
}

export default class PermissionConditions extends React.Component<Props, State> {

  private reflectQueryVariablesToUI = debounce(
    (query: string) => {
      const selectedVariableNames = getVariableNamesFromQuery(query)
      this.setState({
        selectedVariableNames,
      } as State)
    },
    150,
  )

  constructor(props) {
    super(props)

    this.state = {
      selectedVariableNames: ['nodeId'],
      fullscreen: false,
    }
  }

  render() {
    const {
      rule,
      isBetaCustomer,
      permissionSchema,
      ruleGraphQuery,
      setRuleGraphQuery,
      operation,
      setRuleType,
      setUserType,
      userType,
    } = this.props
    const {selectedVariableNames, fullscreen} = this.state

    return (
      <div className='permission-conditions'>
        <style jsx={true}>{`
          .whocan {
            @p: .fw6, .mh6;
          }
          .custom-rule {
            @p: .ml4;
          }
        `}</style>
        <div
          className={cx($p.ph38, {
            [$p.pb38]: rule !== 'GRAPH',
          })}
        >
          <div className={$p.black50}>
            Who can
            <span className='whocan'>{(operation ? operation.toLowerCase() : 'access') + ' data'}</span>
            in the selected fields?
          </div>
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
                onClick={() => setUserType && setUserType('EVERYONE')}
                style={{width: 70}}
              >
                <ConditionButton
                  className={cx($p.nowrap, $p.absolute, $p.ph10, $p.flex, $p.flexRow, $p.itemsCenter, {
                    [cx($p.pv6, $p.bgBlack04)]: userType !== 'EVERYONE',
                    [cx($p.bgBlue, $p.br2, $p.pv8, $p.z1)]: userType === 'EVERYONE',
                  })}
                >
                  <div
                    className={cx($p.ml6, $p.ttu, $p.fw6, $p.f14, {
                        [$p.black30]: userType !== 'EVERYONE',
                        [$p.white]: userType === 'EVERYONE',
                      },
                    )}
                  >
                    Everyone
                  </div>
                </ConditionButton>
              </div>
              <div
                className={cx($p.relative, $p.flex, $p.itemsCenter, $p.justifyCenter, $p.pointer)}
                onClick={() => setUserType && setUserType('AUTHENTICATED')}
                style={{width: 190}}
              >
                <ConditionButton
                  className={cx($p.nowrap, $p.absolute, $p.ph10, $p.flex, $p.flexRow, $p.itemsCenter, {
                    [cx($p.pv6, $p.bgBlack04)]: userType !== 'AUTHENTICATED',
                    [cx($p.bgBlue, $p.br2, $p.pv8, $p.z1)]: userType === 'AUTHENTICATED',
                  })}
                >
                  <div
                    className={cx($p.ml6, $p.ttu, $p.fw6, $p.f14, {
                        [$p.black30]: userType !== 'AUTHENTICATED',
                        [$p.white]: userType === 'AUTHENTICATED',
                      },
                    )}
                  >
                    Authenticated
                  </div>
                  <Icon
                    color={userType === 'AUTHENTICATED' ? $v.white : $v.gray30}
                    stroke={true}
                    strokeWidth={4}
                    src={require('graphcool-styles/icons/stroke/lock.svg')}
                    className={$p.ml6}
                    width={15}
                    height={15}
                  />
                </ConditionButton>
              </div>
              <div className={cx($p.flexAuto)}>
              </div>
              {isBetaCustomer &&
                <div
                  className={cx($p.relative, $p.flex, $p.itemsCenter, $p.justifyEnd, $p.pointer)}
                  onClick={() => {
                    const newRuleType = rule === 'NONE' ? 'GRAPH' : 'NONE'
                    if (setRuleType) {
                    setRuleType(newRuleType)
                  }
                }}
                  style={{width: 190}}
                >
                <ConditionButton
                  className={cx($p.nowrap, $p.absolute, $p.ph10, $p.pv8, $p.flex, $p.flexRow, $p.itemsCenter, $p.br2, {
                    [cx($p.bgBlack04)]: rule === 'NONE',
                    [cx($p.bgBlue, $p.br2, $p.z1)]: rule !== 'NONE',
                  })}
                >
                  <div
                    className={cx($p.ml6, $p.mr6, $p.ttu, $p.fw6, $p.f14, $p.flex, $p.itemsCenter, {
                        [$p.black30]: rule === 'NONE',
                        [$p.white]: rule !== 'NONE',
                      },
                    )}
                  >
                    <Icon
                      className='star'
                      src={require('assets/icons/star.svg')}
                      width={14}
                      height={14}
                      color={rule === 'NONE' ? $v.gray30 : $v.white}
                      onClick={this.toggleFullscreen}
                    />
                    <span className='custom-rule'>Custom Rule</span>
                  </div>
                </ConditionButton>
              </div>}
            </div>
          </div>

          {rule === 'GRAPH' && (
            fullscreen ? (
              <Modal
                isOpen={true}
                style={modalStyling}
                contentLabel='Permission Query Editor'
                onRequestClose={this.toggleFullscreen}
              >
                {this.renderQuery()}
              </Modal>
            ) : (
              this.renderQuery()
            )
          )}

        </div>
      </div>
    )
  }

  private toggleFullscreen = () => {
    this.setState(state => {
      return {
        ...state,
        fullscreen: !state.fullscreen,
      }
    })
  }

  private renderQuery() {
    const {fullscreen, selectedVariableNames} = this.state
    const {ruleGraphQuery, permissionSchema} = this.props
    return (
      <div className={'permission-query-wrapper' + (fullscreen ? ' fullscreen' : '')}>
        <style jsx={true}>{`
          .permission-query-wrapper :global(.star) {
            @p: .mr6;
          }
          .permission-query-wrapper :global(.variable-editor) {
            @p: .dn;
          }
          .permission-query-wrapper :global(.query-editor) :global(.CodeMirror) {
            @p: .f12;
            border-bottom-left-radius: 2px;
            border-top-left-radius: 2px;
            line-height: 22px;
          }
          .permission-query-wrapper :global(.queryWrap) {
            border-top: none;
          }
          .permission-query-wrapper {
            @p: .mt38, .flex, .relative;
            height: 400px;
            margin-left: -45px;
            margin-right: -45px;
          }
          .permission-query-wrapper.fullscreen {
            @p: .bbox, .ma60;
            height: calc(100vh - 120px);
            margin-left: 0;
            margin-right: 0;
          }
          .query {
            @p: .flex1;
          }
          .variable-category {
            @p: .pb38;
          }
          .variables {
            @p: .bgDarkBlue, .br2, .brRight, .overflowYScroll;
            flex: 0 0 220px;
            padding: 20px;
            :global(.tag) {
              @p: .mb6, .mr6;
            }
          }
          .variables.fullscreen {
            flex: 0 0 320px;
          }
          .variable-title {
            @p: .fw6, .f12, .white30, .ttu, .mb16;
          }
          .extend {
            @p: .absolute, .top0, .right0, .pa4, .bgDarkBlue, .pointer;
            margin-top: 17px;
            margin-right: 17px;
            box-shadow: 0 0 8px $darkBlue;
          }
        `}</style>
        <div
          className='extend'
          onClick={this.toggleFullscreen}
        >
          <Icon
            src={
              fullscreen ? require('assets/icons/compress.svg') : require('assets/icons/extend.svg')
            }
            stroke
            strokeWidth={1.5}
            color={$v.white50}
          />
        </div>
        <div className='query'>
          <CustomGraphiQL
            rerenderQuery={true}
            schema={buildClientSchema(JSON.parse(permissionSchema))}
            variables={''}
            query={ruleGraphQuery}
            fetcher={() => { return null }}
            disableQueryHeader
            queryOnly
            onEditQuery={this.handleEditQuery}
          />
        </div>
        <div className={'variables' + (fullscreen ? ' fullscreen' : '')}>
          {Object.keys(variables).map(group => (
            <div className='variable-category'>
              <div className='variable-title'>{group}</div>
              {variables[group].map(variable => (
                <VariableTag
                  key={variable.name}
                  active={selectedVariableNames.includes(variable.name)}
                  onClick={() => this.toggleVariableSelection(variable)}
                  className='tag'
                  variable={variable}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  private handleEditQuery = (query: string) => {
    this.props.setRuleGraphQuery(query)
    this.reflectQueryVariablesToUI(query)
  }

  private toggleVariableSelection = (variable: PermissionVariable) => {
    this.setState(
      state => {
        const {selectedVariableNames} = state

        if (selectedVariableNames.includes(variable.name)) {
          const index = selectedVariableNames.indexOf(variable.name)

          return {
            ...state,
            selectedVariableNames: [
              ...selectedVariableNames.slice(0, index),
              ...selectedVariableNames.slice(index + 1, selectedVariableNames.length),
            ],
          }
        }

        return {
          ...state,
          selectedVariableNames: selectedVariableNames.concat(variable.name),
        }
      },
      () => {
        const variables = this.getSelectedVariables()
        const newQuery = putVariablesToQuery(this.props.ruleGraphQuery, variables)
        this.props.setRuleGraphQuery(newQuery)
      },
    )
  }

  private getSelectedVariables() {
    const {selectedVariableNames} = this.state

    return flatMap(Object.keys(variables), group => variables[group])
      .filter(variable => selectedVariableNames.includes(variable.name))
  }
}

const variables = {
  'Mutation Variables': [
    {
      name: 'nodeId',
      typeIdentifier: 'ID',
    },
  ],
  'Node Fields': [
    {
      name: 'id',
      typeIdentifier: 'ID',
    },
    {
      name: 'description',
      typeIdentifier: 'String',
    },
    {
      name: 'published',
      typeIdentifier: 'Boolean',
    },
  ],
  'Old Node Fields': [
    {
      name: 'oldId',
      typeIdentifier: 'ID',
    },
    {
      name: 'oldDescription',
      typeIdentifier: 'String',
    },
    {
      name: 'oldPublished',
      typeIdentifier: 'Boolean',
    },
  ],
}
