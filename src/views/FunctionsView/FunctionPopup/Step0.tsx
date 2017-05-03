import * as React from 'react'
import FieldHorizontalSelect from '../../models/FieldPopup/FieldHorizontalSelect'
import {Icon, $v} from 'graphcool-styles'
import {EventType, eventTypes} from './FunctionPopup'
import InfoBox from './InfoBox'

interface Props {
  eventType: EventType | null
  onChangeEventType: (eventType: EventType) => void
}

interface State {
}

export default class Step0 extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {
      eventType: null,
    }
  }

  render() {
    const {eventType, onChangeEventType} = this.props
    const choices = [
      <div className="flex itemsCenter">
        <Icon
          src={require('graphcool-styles/icons/fill/serversidesubscriptions.svg')}
          width={40}
          height={20}
          color={$v.darkBlue50}
        />
        <div className="ml16">
          Server-Side Subscription
        </div>
      </div>,
      <div className="flex itemsCenter">
        <Icon
          src={require('graphcool-styles/icons/fill/requestpipeline.svg')}
          width={40}
          height={20}
          color={$v.darkBlue50}
        />
        <div className="ml16">
          Request Pipeline
        </div>
      </div>,
      <div className="flex itemsCenter">
        <Icon
          src={require('graphcool-styles/icons/fill/cron.svg')}
          width={20}
          height={20}
          color={$v.darkBlue50}
        />
        <div className="ml16">
          Cron Job
        </div>
      </div>,
    ]
    return (
      <div className='step0'>
        <style jsx>{`
          .step0 {
          }
          .intro {
            @p: .pl38, .pr38, .black50;
            margin-top: 8px;
          }
        `}</style>
        <div className="intro">
          Choose the type of function, you want to define.
          For sure there’s a lot more we could tell as an introduction here.
        </div>
        <FieldHorizontalSelect
          activeBackgroundColor={$v.blue}
          inactiveBackgroundColor='#F5F5F5'
          choices={choices}
          selectedIndex={eventTypes.indexOf(eventType)}
          inactiveTextColor={$v.gray30}
          onChange={(index) => onChangeEventType(eventTypes[index])}
          spread
        />
        <div className="mh38 mb38">
          <InfoBox>
            {this.getInfoText()}
          </InfoBox>
        </div>
      </div>
    )
  }

  private getInfoText = () => {
    const {eventType} = this.props

    if (eventType === 'RP') {
      return `The Request Pipeline let’s you transform data at each step of  of the data processing process.
      Read more about what you can do at each step.`
    }

    return 'You can’t change the function type after you created the function.'
  }
}