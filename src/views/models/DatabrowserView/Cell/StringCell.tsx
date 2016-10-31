import * as React from 'react'
import {CellProps} from './cells'
import {stringToValue} from '../../../../utils/valueparser'
import { connect } from 'react-redux'
import {nextStep} from '../../../../actions/gettingStarted'

// extend the interface for the onboarding functionality
declare module './cells' {
  interface CellProps<T> {
    nextStep?: () => void
    step?: string
  }
}

export class StringCell extends React.Component<CellProps<string>, {}> {

  refs: {
    input: HTMLInputElement
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.refs.input.value = nextProps.value
    }
  }

  render() {
    const numLines = this.props.value ? this.props.value.split(/\r\n|\r|\n/).length : 1

    return (
      <textarea
        autoFocus
        type='text'
        ref='input'
        defaultValue={this.props.value}
        onKeyDown={this.onKeyDown}
        style={{
          height: Math.min(Math.max(56, numLines * 20), 300),
        }}
        onBlur={(e: any) => this.props.save(stringToValue(e.target.value, this.props.field))}
        onChange={this.onChange}
      />
    )
  }

  private onKeyDown = (e: any) => {
    // filter arrow keys
    if ([37,38,39,40].includes(e.keyCode)) {
      return
    }
    this.props.onKeyDown(e)
  }

  private onChange = (e: any) => {
    if (typeof this.props.nextStep !== 'function') {
      return
    }
    if (
      e.target.value.includes('#graphcool') &&
      this.props.field.name === 'description' &&
      this.props.field.model.name === 'Post' &&
      // very important, otherwise each additional keystroke step through all steps
      this.props.step === 'STEP3_CLICK_ENTER_DESCRIPTION'
    ) {
      this.props.save(e.target.value)
      this.props.nextStep()
    }
  }
}

export default connect(
  state => ({
    step: state.gettingStarted.gettingStartedState.step,
  }),
  { nextStep }
)(StringCell)
