import * as React from 'react'
import FieldHorizontalSelect from './FieldHorizontalSelect'
import {$v, Icon} from 'graphcool-styles'
import {fieldTypes} from './constants'
import FieldLabel from './FieldLabel'
import OptionInput from './OptionInput'
import {FieldType} from '../../../types/types'
import * as TagsInput from 'react-tagsinput'
import {FieldPopupErrors} from './FieldPopupState'
import ErrorInfo from './ErrorInfo'

require('./react-tagsinput.css')

interface Props {
  style?: any
  name: string
  description: string
  typeIdentifier: string
  isList: boolean
  onChangeName: Function
  onChangeDescription: Function
  onChangeTypeIdentifier: (type: FieldType) => void
  onToggleIsList: () => void
  onChangeEnumValues: (values: string[]) => void
  enumValues: string[]
  errors: FieldPopupErrors
  showErrors: boolean
}

interface State {
  editingEnumValues: boolean
  showTagInput: boolean
}

export default class BaseSettings extends React.Component<Props,State> {
  tagInput: any
  constructor(props) {
    super(props)

    this.state = {
      editingEnumValues: false,
      showTagInput: false,
    }
  }
  render() {
    const {
      name,
      description,
      typeIdentifier,
      isList,
      style,
      onChangeTypeIdentifier,
      onChangeDescription,
      onChangeName,
      onToggleIsList,
      onChangeEnumValues,
      enumValues,
      errors,
      showErrors,
    }  = this.props

    const {editingEnumValues} = this.state

    return (
      <div style={style} className='base-settings'>
        <style jsx={true}>{`
          .base-settings {
            @p: .w100;
          }
          .list-settings {
            @p: .pl38, .pb38;
          }
          .enum-values {
            @p: .ph38, .pb38;
            min-height: 52px;
          }
          .enum-values-placeholder {
            @p: .flex, .relative, .pointer;
            top: 10px;
            left: -2px;
          }
          .enum-values-placeholder-text {
            @p: .blue, .o50;
            margin-left: 14px;
          }
          .type-error {
            @p: .absolute;
            margin-top: -69px;
            right: -38px;
          }
          .enum-error {
            @p: .absolute;
            margin-top: -15px;
            right: 15px;
          }
        `}</style>
        <style jsx global>{`
          .field-popup-plus {
            @p: .flex, .itemsCenter, .justifyCenter, .br100, .bgBlue20, .pointer;
            height: 26px;
            width: 26px;
          }
        `}</style>
        <FieldLabel
          name={name}
          description={description}
          onChangeDescription={onChangeDescription}
          onChangeName={onChangeName}
          errors={errors}
          showErrors={showErrors}
        />
        <FieldHorizontalSelect
          activeBackgroundColor={$v.blue}
          inactiveBackgroundColor='#F5F5F5'
          choices={fieldTypes}
          selectedIndex={fieldTypes.indexOf(typeIdentifier || '')}
          inactiveTextColor={$v.gray30}
          onChange={(index) => onChangeTypeIdentifier(fieldTypes[index] as FieldType)}
        />
        {showErrors && errors.typeMissing && (
          <div className='type-error'>
            <ErrorInfo>
              You must specify a Field Type.
            </ErrorInfo>
          </div>
        )}
        {typeIdentifier === 'Enum' && (
          <div className='enum-values'>
            {editingEnumValues || enumValues.length > 0 ? (
              <TagsInput
                onlyUnique
                addOnBlur
                addKeys={[9, 13, 32]}
                value={enumValues}
                onChange={this.handleChange}
                renderInput={this.renderTagInputElement}
              />
            ) : (
              <div className='enum-values-placeholder' onClick={this.editEnumValues}>
                <div className='field-popup-plus'>
                  <Icon
                    src={require('graphcool-styles/icons/stroke/add.svg')}
                    stroke
                    strokeWidth={4}
                    color={$v.blue}
                    width={26}
                    height={26}
                  />
                </div>
                <div className='enum-values-placeholder-text'>add space-seperated enum values</div>
              </div>
            )}
            {showErrors && errors.enumValueMissing && (
              <div className='enum-error'>
                <ErrorInfo>
                  You must specify enum values
                </ErrorInfo>
              </div>
            )}
          </div>
        )}
        <div className='list-settings'>
          <OptionInput
            label='Store multiple values in this field'
            checked={isList}
            onToggle={onToggleIsList}
          />
        </div>
      </div>
    )
  }

  private handleChange = (enumValues: string[]) => {
    this.props.onChangeEnumValues(enumValues)
  }

  private renderTagInputElement = (props) => {
    let {onChange, value, addTag, onBlur, placeholder, ...other} = props
    const {showTagInput} = this.state

    return (
      <div className='tag-input'>
        <style jsx>{`
          .tag-input {
            @p: .inlineFlex, .itemsCenter;
            height: 42px;
          }
          .input {
            @p: .f16, .blue, .mr10;
          }
        `}</style>
        {showTagInput && (
          <input
            autoFocus
            type='text'
            onChange={onChange}
            value={value}
            onBlur={onBlur}
            placeholder='Add an enum value'
            {...other}
            className='input'
          />
        )}
        <div className='field-popup-plus' onClick={() => this.handlePlusClick(onBlur, value)}>
          <Icon
            src={require('graphcool-styles/icons/stroke/add.svg')}
            stroke
            strokeWidth={4}
            color={$v.blue}
            width={26}
            height={26}
          />
        </div>
      </div>
    )
  }

  private handlePlusClick = (onBlur, value) => {
    if (this.state.showTagInput) {
      onBlur({
        target: {value},
      })
    } else {
      this.showTagInput()
    }
  }

  private showTagInput = () => {
    this.setState({
      showTagInput: true,
    } as State)
  }

  private editEnumValues = () => {
    this.setState({editingEnumValues: true, showTagInput: true})
  }
}
