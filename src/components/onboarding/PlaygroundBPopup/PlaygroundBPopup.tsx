import * as React from 'react'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {nextStep} from '../../../actions/gettingStarted'
import {GettingStartedState} from '../../../types/gettingStarted'
import {Icon} from 'graphcool-styles'
import Steps from '../Steps'
import {$p, variables} from 'graphcool-styles'
import * as cx from 'classnames'
import styled from 'styled-components'

interface Props {
  id: string
  nextStep: () => Promise<void>
  params: any
  router: ReactRouter.InjectedRouter
  gettingStartedState: GettingStartedState
}

interface State {
  mouseOver: boolean
}

const PrevButton = styled.button`
  bottom: 25px;
  left: 25px;
`

const NextButton = styled.button`
  bottom: 25px;
  right: 25px;
`

const TopWrapper = styled.div`
  i {
    flex-direction: row;
    justify-content: center;
  }
`

class PlaygroundBPopup extends React.Component<Props, State> {

  state = {
    mouseOver: false,
  }

  refs: {
    steps: any
  }

  nextSlide = () => {
    this.refs.steps.next()
  }

  prevSlide = () => {
    this.refs.steps.prev()
  }

  render() {
    const {mouseOver} = this.state
    const hovering = this.props.gettingStartedState.isCurrentStep('STEP4_CLICK_BEGIN_PART2')
    return (
      <div
        className='flex justify-center items-start h-100'
        style={{
          transition: 'background-color 0.3s ease',
          backgroundColor: hovering ? 'rgba(255,255,255,0.5)' : 'transparent',
          pointerEvents: 'none',
          overflow: hovering ? 'auto' : 'hidden',
          width: 'calc(100% - 266px)',
        }}
      >
        <div
          className='flex justify-center items-center w-100'
          style={{
            transition: 'height 0.5s ease',
            height: hovering ? '100%' : mouseOver ? '180%' : '200%',
            pointerEvents: hovering ? 'all' : 'none',
            cursor: hovering ? 'auto' : 'pointer',
          }}
        >
          <div
            className='bg-white br-2 shadow-2 mv-96'
            style={{
              minWidth: 600,
              maxWidth: 900,
              pointerEvents: 'all',
            }}
            onMouseLeave={() => this.setState({ mouseOver: false } as State)}
            onMouseEnter={() => this.setState({ mouseOver: true } as State)}
            onClick={(e: any) => {
              if (this.props.gettingStartedState.isCurrentStep('STEP4_CLICK_TEASER_PART2')) {
                this.next()
              }
            }}
          >
            <TopWrapper className={cx($p.flexRow, $p.justifyCenter, $p.w100, $p.pt25, $p.pb16)}>
              <Icon
                src={require('graphcool-styles/icons/stroke/arrowTop.svg')}
                stroke={true}
                color={variables.black}
                strokeWidth={2}
                width={24}
                height={24}
              />
            </TopWrapper>
            <Steps ref='steps'>

              <div className='pa-25 pt-38 mb-60 tc pb-38'>
                <div>
                </div>
                <div className='fw3 ma-38 f-38'>
                  Nice one! Now let's try something harder:
                </div>
                <div className='fw2 f-16 mh-96 mv-25 lh-1-4'>
                  Our GraphQL API includes a powerful filtering system.
                  Queries can be modified with filters to only return particular nodes.
                  Fitlers are automatically generated based on a model's fields.
                </div>
                <div>
                  <img src={require('../../../assets/gifs/playground2.gif')} />
                </div>
                <NextButton
                  className={cx(
                    $p.pa16,
                    $p.f16,
                    $p.green,
                    $p.br2,
                    $p.bgGreen20,
                    $p.pointer,
                    $p.db,
                    $p.absolute,
                    $p.flex,
                    $p.flexRow,
                    $p.itemsCenter,
                  )}
                  onClick={this.nextSlide}
                >
                  <div>Now your task</div>
                  <Icon
                    src={require('graphcool-styles/icons/stroke/arrowRight.svg')}
                    stroke={true}
                    strokeWidth={2}
                    color={variables.green}
                    className={$p.ml6}
                    width={20}
                    height={20}
                  />
                </NextButton>
              </div>

              <div className='pa-25 pt-38 tc bg-gray-06 h-100 flex flex-column justify-center'>
                <div className='fw4 ls-2 pt-25 pb-38 accent'>
                  HERE'S YOUR SECOND TASK
                </div>
                <div className='flex justify-center items-center'>
                  <div className='mw6 bg-accent br-2 tl shadow-2'>
                    <div className='w-100 pa-16 white fw8' style={{ backgroundColor: '#00A854' }}>
                      Query all posts that contain the #graphcool hashtag in their description.
                    </div>
                    <div className='w-100 pa-16 black-50 lh-1-4'>
                      Use the built-in filter "description_contains".{' '}
                      If you need more information, look in the docs section or open up the chat!
                    </div>
                  </div>
                </div>

                <div className='flex justify-center items-center'>
                  <div
                    className='pa-16 fw5 bg-black-05 mt-25 mb-38 ls-1 blue br-2 flex items-center pointer'
                    onClick={this.next}
                    >
                    TRY IT OUT&nbsp;
                  <Icon src={require('../../../assets/new_icons/arrow-right.svg')} width={29} height={15} />
                  </div>
                </div>
                <PrevButton
                  className={cx(
                  $p.pa16,
                  $p.f16,
                  $p.br2,
                  $p.pointer,
                  $p.black50,
                  $p.db,
                  $p.absolute,
                  $p.flex,
                  $p.flexRow,
                  $p.itemsCenter,
                  $p.bgTransparent,
                )}
                  onClick={this.prevSlide}
                >
                  <Icon
                    src={require('graphcool-styles/icons/stroke/arrowLeft.svg')}
                    stroke={true}
                    color={variables.gray50}
                    className={$p.mr6}
                    width={20}
                    height={20}
                  />
                  <div>Intro</div>
                </PrevButton>
              </div>

            </Steps>

          </div>
        </div>
      </div>
    )
  }

  private next = (): void => {
    this.props.nextStep()
  }
}

const mapStateToProps = (state) => {
  return {
    gettingStartedState: state.gettingStarted.gettingStartedState,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({nextStep}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PlaygroundBPopup))
