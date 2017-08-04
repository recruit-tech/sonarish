/* @flow */
import fetch from 'isomorphic-fetch'
import React from 'react'
import type { eslint$CLIEngineResult, Stats } from 'sonarish-types'
import Header from '../components/Header'
import RulesetReporter from '../components/RulesetReporter'

const API_HOST = 'http://localhost:3001'

export default class Repo extends React.Component {
  props: {
    data: Array<{
      name: string,
      stats: Stats,
      eslintRawResult: eslint$CLIEngineResult
    }>, // TODO
    name: string
  }
  static async getInitialProps(props) {
    const { name } = props.query
    const res = await fetch(API_HOST + `/repo/${name}`)
    return res.json()
  }
  render() {
    const { data, name } = this.props
    return (
      <div>
        <Header />
        <h2>
          🐷 {name}
        </h2>
        <ul>
          {data.map((d, index) => {
            return (
              <li key={index}>
                <RulesetReporter
                  name={d.name}
                  stats={d.stats}
                  eslintRawResult={d.eslintRawResult}
                />
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
