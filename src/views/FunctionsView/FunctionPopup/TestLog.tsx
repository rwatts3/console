import * as React from 'react'
const ResultViewer: any = require('../FunctionLogs/ResultViewer').ResultViewer

interface Props {
  response: string
}

export default function TestLog({response}: Props) {
  return (
    <div className='test-log'>
      <style jsx={true}>{`
        .test-log {
        }
          .graphiql-container :global(div.CodeMirror) {
            background: transparent;
          }
          .graphiql-container :global(div.CodeMirror-lines) {
            @p: .pa0;
          }
      `}</style>
      <div className='graphiql-container'>
        <ResultViewer
          value={response}
        />
      </div>
    </div>
  )
}
