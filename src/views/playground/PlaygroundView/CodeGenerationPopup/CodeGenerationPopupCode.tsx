import * as React from 'react'
import * as cx from 'classnames'
import {$p} from 'graphcool-styles'
import * as Codemirror from 'react-codemirror'
require('../../../../styles/dracula.css')
require('../../../../styles/codemirror.css')
require('codemirror/mode/javascript/javascript')
require('codemirror/mode/shell/shell')

interface Props {
  query: string
  mutation: string
  endpointUrl: string
}

const projectSetup =
  `$ npm install -g yarn
$ yarn add lokka lokka-transport-http`

export default class CodeGenerationPopupCode extends React.Component<Props, {}> {
  render() {

    const code =
      `const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const client = new Lokka({
  transport: new Transport('${this.props.endpointUrl}')
});

function getItems() {
  return client.query(\`
    ${this.props.query.split('\n').map((line, i) => (i !== 0 ? '    ' : '') + line).join('\n')}
  \`)
}`
    return (
      <div className={cx($p.pa38, $p.pt16, 'code-generation-popup')}>
        <h3 className={$p.mt16}>Project Setup</h3>
        <Codemirror
          value={projectSetup}
          options={{
            height: 100,
            mode: 'shell',
            theme: 'dracula',
          }}
        />
        <h3 className={$p.mt16}>Code</h3>
        <Codemirror
          value={code}
          options={{
            mode: 'javascript',
            theme: 'dracula',
          }}
        />
      </div>
    )
  }
}
