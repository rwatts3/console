import * as React from 'react'
import SchemaOverviewHeader from './SchemaOverviewHeader'

interface Props {

}

export default class SchemaOverview extends React.Component<Props,null> {
  render() {
    return (
      <div className='schema-overview'>
        <style jsx={true}>{`
          .schema-overview {
            @p: .flex1, .bgDarkBlue;
            height: calc(100vh - 57px);
          }
        `}</style>
        <SchemaOverviewHeader />
      </div>
    )
  }
}
