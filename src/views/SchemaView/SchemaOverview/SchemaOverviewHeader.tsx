import * as React from 'react'

export default class SchemaOverviewHeader extends React.Component<null,null> {
  render() {
    return (
      <div className='schema-overview-header'>
        <style jsx={true}>{`
          .schema-overview-header {
            @p: .white, .o60;
          }
        `}</style>
         Add Type
      </div>
    )
  }
}
