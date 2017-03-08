import * as React from 'react'

export default class SchemaHeader extends React.Component<null,null> {
  render() {
    return (
      <div className='schema-header'>
        <style jsx={true}>{`
          .schema-header {
            height: 57px;
            background-color: #08131B;
          }
        `}</style>
      </div>
    )
  }
}
