import * as React from 'react'

export default function mapProps(mapping: {
  [key: string]: (props: any) => any
}) {
  return DecoratedComponent => {
    class MapProps extends React.Component<{}, {}> {
      render() {
        let mapped

        try {
          mapped = Object.keys(mapping as any).reduce(
            (acc, key) => ({
              ...acc,
              [key]: mapping[key](this.props),
            }),
            {},
          )
        } catch (err) {
          return null
        }

        const newProps = { ...this.props, ...mapped }

        return <DecoratedComponent {...newProps} />
      }
    }

    return MapProps
  }
}
