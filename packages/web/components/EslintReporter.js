/* @flow */
import * as React from 'react';
import type {
  eslint$CLIEngineResult,
  eslint$ResultMessage
} from 'sonarish-types'

function EslintLineMessage({ message }: { message: eslint$ResultMessage }) {
  return (
    <div>
      <div>
        <div>
          {message.line}:{message.column}
          <code>{message.source}</code>
          <br />
          {message.message} / {message.ruleId}
        </div>
      </div>
    </div>
  )
}

export default function EslintReporter(props: {
  data: eslint$CLIEngineResult
}) {
  const { data } = props
  return (
    <div>
      Error: {data.errorCount}
      <div>
        {data.results
          .filter(i => i.messages.length)
          .slice(0, 20) // TODO: Show open all button
          .map(result => {
            return (
              <div key={result.filePath}>
                <h4>
                  {result.filePath}
                </h4>
                <ul>
                  {result.messages.map((message, i) =>
                    <li key={i}>
                      <EslintLineMessage message={message} />
                    </li>
                  )}
                </ul>
              </div>
            )
          })}
      </div>
    </div>
  )
}
