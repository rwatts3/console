import * as React from 'react'

export default function mapProps(mapping: {
  [key: string]: (props: any) => any
}) {
  return DecoratedComponent => {
    class MapProps extends React.Component<{}, {}> {
      static DecoratedComponent = DecoratedComponent

      render() {
        let mapped

        try {
          mapped = Object.keys(mapping).reduce(
            (acc, key) =>
              {...acc, 
                [key]: mapping[key](this.props)},
            {},
          )
        } catch (err) {
          console.error(err)
          return null
        }

        const newProps = {...this.props, ...mapped}

        return <DecoratedComponent {...newProps} />
      }
    }

    return MapProps
  }
}
