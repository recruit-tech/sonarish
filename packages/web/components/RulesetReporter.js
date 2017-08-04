/* @flow */
import React from 'react'
import type { eslint$CLIEngineResult, Stats } from 'sonarish-types'
import EslintReporter from './EslintReporter'
import Opener from './Opener'

export default function RulesetReporter({
  eslintRawResult,
  name,
  stats
}: {
  name: string,
  stats: Stats,
  eslintRawResult: eslint$CLIEngineResult
}) {
  return (
    <div>
      <h3>
        Category: {name}
      </h3>
      <div>
        <div>
          Score: <span>{~~(100 - stats.totalScore)}</span>
        </div>

        <Opener
          title="score detail"
          content={() =>
            <div
              style={{
                maxHeight: '400px',
                overflowX: 'auto',
                padding: 10,
                backgroundColor: '#ddd'
              }}
            >
              <ul>
                {Object.entries(
                  stats.scoresByRule
                ).map(([rule, score], index) => {
                  return (
                    <li key={index}>
                      {rule}: {~~(1000 * parseInt(score, 10)) / 1000}
                    </li>
                  )
                })}
              </ul>
            </div>}
        />
      </div>
      <Opener
        title="eslint detail"
        content={() =>
          <div
            style={{
              maxHeight: '400px',
              overflowX: 'auto',
              padding: 10,
              backgroundColor: '#ddd'
            }}
          >
            <EslintReporter data={eslintRawResult} />
          </div>}
      />
    </div>
  )
}
