import * as React from 'react'
import TetherComponent from 'react-tether'
import {connect} from 'react-redux'
import {GettingStartedState} from '../../types/gettingStarted'
import {classnames} from '../../utils/classnames'
import {TetherStep} from '../../types/types'
const classes: any = require('./Tether.scss')

interface Props {
  steps: TetherStep[]
  children: Element
  gettingStartedState: GettingStartedState
  offsetX?: number
  offsetY?: number
  width?: number
  side?: string
  horizontal?: string
  zIndex?: number
  onMouseEnter: () => any
  onMouseLeave: () => any
  onClick?: (e: any, step: TetherStep) => void
}

class Tether extends React.Component<Props, {}> {

  static defaultProps = {
    offsetX: 0,
    offsetY: 0,
    width: 220,
    side: 'bottom',
    horizontal: 'left',
  }

  refs: {
    container: any
  }

  componentDidMount() {
    // assure that tether is in screen
    if (this.refs.container && typeof this.refs.container.scrollIntoViewIfNeeded === 'function') {
      this.refs.container.scrollIntoViewIfNeeded()
    }
  }

  render() {
    const step = this.props.steps.find((s) => this.props.gettingStartedState.isCurrentStep(s.step))
    const isBottom = this.props.side === 'bottom'
    const isLeft = this.props.horizontal === 'left'

    return (
      <TetherComponent
        style={{
          zIndex: this.props.zIndex ? this.props.zIndex : 500,
        }}
        targetOffset={`${this.props.offsetY}px ${this.props.offsetX}px`}
        attachment={`${isBottom ? 'top' : 'bottom'} ${this.props.horizontal}`}
        targetAttachment={`${isBottom ? 'bottom' : 'top'} ${this.props.horizontal}`}
      >
        {this.props.children}
        {step &&
        <div
          className={classnames(classes.tether,
                                'br-2',
                                isBottom ? classes.bottom : classes.top,
                                isLeft ? classes.left : classes.right)}
          style={{width: this.props.width, zIndex: 9}}
          onMouseEnter={this.props.onMouseEnter}
          onMouseLeave={this.props.onMouseLeave}
          ref='container'
        >
          <div className={classes.title}>
            {step.title}
          </div>
          {step.description &&
          <div className={`${classes.description} lh-1-4`}>
            {step.description}
          </div>
          }
          {step.buttonText &&
            <div
                className='flex justify-center mb3 mt2'
                onClick={(e: any) => {
                  if (typeof this.props.onClick === 'function') {
                    this.props.onClick(e, step)
                  }
                }}
            >
              <div
                className='pa2 br2 bg-transparent tc ba b--white white pointer dim'
              >
                {step.buttonText}
              </div>
            </div>
          }
        </div>
        }
      </TetherComponent>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    gettingStartedState: state.gettingStarted.gettingStartedState,
  }
}

export default connect(mapStateToProps)(Tether)
