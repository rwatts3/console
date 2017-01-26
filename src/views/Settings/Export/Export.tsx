import * as React from 'react'

interface State {

}

interface Props {

}

export default class Export extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div className='container'>
        <style jsx={true}>{`

          .container {
            @inherit: .br, .pv38;
            max-width: 700px;
            border-color: rgba( 229, 229, 229, 1);
          }

          .exportDataContainer {
            @inherit: .flex, .itemsCenter, .justifyBetween, .mt16, .pl60, .pb38, .bb;
            border-color: rgba( 229, 229, 229, 1);
          }

          .exportDataTitle {
            @inherit: .pb6, .mb4, .black30, .f14, .fw6, .ttu;
          }

          .exportDataDescription {
            @inherit: .pt6, .mt4, .black50, .f16;
          }

          .button {
            @inherit: .green, .f16, .pv10, .ph16, .mh60, .pointer, .nowrap;
            background-color: rgba(28,191,50,.2);
          }

          .exportSchemaContainer {
            @inherit: .flex, .itemsCenter, .justifyBetween, .mt38, .pl60;
          }

          .exportSchemaTitle {
            @inherit: .pb6, .mb4, .black30, .f14, .fw6, .ttu;
          }

          .exportSchemaDescription {
            @inherit: .pt6, .mt4, .black50, .f16;
          }

        `}</style>
        <div className='exportDataContainer'>
          <div>
            <div className='exportDataTitle'>Export data</div>
            <div className='exportDataDescription'>
              This is the schema representing the models and fields of your project.
              For example, you can use it to generate a blueprint of it.
            </div>
          </div>
          <div className='button'>
            Export Data
          </div>
        </div>
        <div className='exportSchemaContainer'>
          <div>
            <div className='exportSchemaTitle'>Export data</div>
            <div className='exportSchemaDescription'>
              This is the schema representing the models and fields of your project.
              For example, you can use it to generate a blueprint of it.
            </div>
          </div>
          <div className='button'>
            Export Schema
          </div>
        </div>


      </div>
    )
  }
}
