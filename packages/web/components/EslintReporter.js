/* @flow */
import React from 'react'
import type {
  eslint$CLIEngineResult,
  eslint$ResultMessage
} from 'sonarish-types'

function EslintMessage({ message }: { message: eslint$ResultMessage }) {
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
      Error: {data.errorCount} in file
      <div>
        {data.results.map(result => {
          return (
            <div key={result.filePath}>
              <h4>
                {result.filePath}
              </h4>
              <ul>
                {result.messages.map((message, i) =>
                  <li key={i}>
                    <EslintMessage message={message} />
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
