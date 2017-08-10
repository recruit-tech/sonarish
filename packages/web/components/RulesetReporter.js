/* @flow */
import React from 'react'
import type { eslint$CLIEngineResult, Stats } from 'sonarish-types'
import EslintReporter from './EslintReporter'
import Opener from './Opener'

function truncate(n: number, size: number = 1): number {
  return ~~(n * size) / size
}

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
          Score: <span>{100 - 100 * stats.totalScore}</span>
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
                      {rule}: count: {score.count} / priority: {score.priority}
                      / weight: {score.weight}
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
