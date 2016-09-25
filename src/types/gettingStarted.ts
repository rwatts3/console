export type Step = 'STEP0_OVERVIEW' |
  'STEP1_CREATE_POST_MODEL' |
  'STEP2_CLICK_CREATE_FIELD_IMAGEURL' |
  'STEP2_ENTER_FIELD_NAME_IMAGEURL' |
  'STEP2_SELECT_TYPE_IMAGEURL' |
  'STEP2_CLICK_CONFIRM_IMAGEURL' |
  'STEP2_CREATE_FIELD_DESCRIPTION' |
  'STEP3_CLICK_DATA_BROWSER' |
  'STEP3_CLICK_ADD_NODE1' |
  'STEP3_CLICK_ADD_NODE2' |
  'STEP4_CLICK_PLAYGROUND' |
  'STEP4_CLICK_BEGIN_PART1' |
  'STEP4_CLICK_TEASER_PART2' |
  'STEP4_CLICK_BEGIN_PART2' |
  'STEP4_CLICK_TEASER_STEP5' |
  'STEP5_WAITING' |
  'STEP5_DONE'

interface StepProgress {
  index: number
  total: number
  done: number
}

interface Props {
  step: Step
  skipped: boolean
  customerId: string
}

export class GettingStartedState {

  static steps: [Step] = [
    'STEP0_OVERVIEW',
    'STEP1_CREATE_POST_MODEL',
    'STEP2_CLICK_CREATE_FIELD_IMAGEURL',
    'STEP2_ENTER_FIELD_NAME_IMAGEURL',
    'STEP2_SELECT_TYPE_IMAGEURL',
    'STEP2_CLICK_CONFIRM_IMAGEURL',
    'STEP2_CREATE_FIELD_DESCRIPTION',
    'STEP3_CLICK_DATA_BROWSER',
    'STEP3_CLICK_ADD_NODE1',
    'STEP3_CLICK_ADD_NODE2',
    'STEP4_CLICK_PLAYGROUND',
    'STEP4_CLICK_BEGIN_PART1',
    'STEP4_CLICK_TEASER_PART2',
    'STEP4_CLICK_BEGIN_PART2',
    'STEP4_CLICK_TEASER_STEP5',
    'STEP5_WAITING',
    'STEP5_DONE',
  ]

  step: Step
  skipped: boolean
  customerId: string

  progress: StepProgress

  constructor(props: Props) {
    this.customerId = props.customerId
    this.skipped = props.skipped
    this.update(props.step)
  }

  isActive = (): boolean => {
    return this.step !== 'STEP5_DONE' && !this.skipped
  }

  isCurrentStep = (step: Step): boolean => {
    return step === this.step
  }

  update = (step: Step): void => {
    const currentStepIndex = GettingStartedState.steps.indexOf(this.step)
    const stepIndex = GettingStartedState.steps.indexOf(step)
    if (currentStepIndex > stepIndex) {
      return
    }

    this.step = step

    this.progress = {
      'STEP0_OVERVIEW': () => ({ index: 0, total: 0, done: 0 }),
      'STEP1_CREATE_POST_MODEL': () => ({ index: 1, total: 1, done: 0 }),
      'STEP2_CLICK_CREATE_FIELD_IMAGEURL': () => ({ index: 2, total: 2, done: 0 }),
      'STEP2_ENTER_FIELD_NAME_IMAGEURL': () => ({ index: 2, total: 2, done: 0 }),
      'STEP2_SELECT_TYPE_IMAGEURL': () => ({ index: 2, total: 2, done: 0 }),
      'STEP2_CLICK_CONFIRM_IMAGEURL': () => ({ index: 2, total: 2, done: 0 }),
      'STEP2_CREATE_FIELD_DESCRIPTION': () => ({ index: 2, total: 2, done: 1 }),
      'STEP3_CLICK_DATA_BROWSER': () => ({ index: 3, total: 2, done: 0 }),
      'STEP3_CLICK_ADD_NODE1': () => ({ index: 3, total: 2, done: 0 }),
      'STEP3_CLICK_ADD_NODE2': () => ({ index: 3, total: 2, done: 1 }),
      'STEP4_CLICK_PLAYGROUND': () => ({ index: 4, total: 2, done: 0 }),
      'STEP4_CLICK_BEGIN_PART1': () => ({ index: 4, total: 2, done: 0 }),
      'STEP4_CLICK_TEASER_PART2': () => ({ index: 4, total: 2, done: 1 }),
      'STEP4_CLICK_BEGIN_PART2': () => ({ index: 4, total: 2, done: 1 }),
      'STEP4_CLICK_TEASER_STEP5': () => ({ index: 4, total: 2, done: 2 }),
      'STEP5_WAITING': () => ({ index: 5, total: 0, done: 0 }),
      'STEP5_DONE': () => ({ index: 5, total: 0, done: 0 }),
    }[step]()
  }
}