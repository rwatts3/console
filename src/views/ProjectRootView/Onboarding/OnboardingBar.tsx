import * as React from 'react'
import * as cn from 'classnames'
import {Icon, $v} from 'graphcool-styles'
import {connect} from 'react-redux'
import {showCurrentStep} from '../../../actions/gettingStarted'

interface Props {

}

interface State {

}

class OnboardingBar extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    return (
      <div className='onboarding-bar'>
        <style jsx>{`
          .onboarding-bar {
            @p: .bgDarkBlue, .flex, .flexColumn, .absolute, .bottom0, .w100, .z3;
            border-left: 6px solid $darkestBlue;
          }
          .progress-bar {
            @p: .flexFixed, .w100;
            background: $blue50;
            height: 3px;
          }
          .progress {
            @p: .bgBlue, .h100;
          }
          .steps {
            @p: .flexFixed, .w100, .pl25, .pr16, .flex, .justifyBetween;
            padding-top: 18px;
            padding-bottom: 18px;
          }
          h2 {
            @p: .fw6, .white, .f20;
          }
        `}</style>
        <div className='progress-bar'>
          <div className='progress' style={{width: '20%'}} />
        </div>
        <div className='steps'>
          <div className='flex itemsCenter'>
            <h2>Get Started</h2>
            <Step active n={1}>
              Define Schema
            </Step>
            <Step n={2}>
              Get Started with the API
            </Step>
            <Step n={3}>
              Run example
            </Step>
          </div>
        </div>
      </div>
    )
  }
}

interface StepProps {
  children?: any
  n: number
  done?: boolean
  active?: boolean
}

function Step({children, n, done, active}: StepProps) {
  return (
    <div className={cn('step', {done, active})}>
      <style jsx={true}>{`
        .step {
          @p: .flex, .itemsCenter, .ml38;
        }
        .circle {
          @p: .br100, .tc, .f14, .fw6, .white60, .inlineFlex, .justifyCenter, .itemsCenter;
          border: 2px solid $white30;
          width: 25px;
          height: 25px;
          line-height: 25px;
        }
        span {
          @p: .ml10, .f16, .white50
        }
        .step.done .circle {
          @p: .bgWhite30;
          border: none;
        }
        .step.active {
          @p: .blue;
        }
        .step.active .circle {
          @p: .blue;
          border: 2px solid $blue50;
        }
        .step.active span {
          @p: .blue;
        }
      `}</style>
      <div className='circle'>
        {done ? (
          <Icon
            src={require('graphcool-styles/icons/fill/check.svg')}
            color={$v.white60}
            width={18}
            height={18}
          />
        ) : (
          n
        )}
      </div>
      <span>{children}</span>
    </div>
  )
}

export default connect(
  state => ({
    gettingStartedState: state.gettingStarted.gettingStartedState,
  }),
  {
    showCurrentStep,
  },
)(OnboardingBar)
