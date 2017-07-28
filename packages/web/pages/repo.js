/* @flow */
import fetch from 'isomorphic-fetch'
import React from 'react'
import Collapse from 'rc-collapse'
import Header from '../components/Header'

const API_HOST = 'http://localhost:3001'

export default class Repo extends React.Component {
  props: {
    data: any, // TODO
    name: string
  }
  static async getInitialProps(props) {
    // console.log(props)
    const { name } = props.query
    const res = await fetch(API_HOST + `/repo/${name}`)
    return res.json()
  }
  render() {
    const { data } = this.props
    const rootDir = '/Users/mizchi/.sonarish/repos/' + this.props.name
    console.log(this.props)
    return (
      <div>
        <Header />
        <h2>
          Repo: {this.props.name}
        </h2>
        <ul>
          {data.map(d => {
            return (
              <li key={d.rulesetName}>
                <h3>
                  {d.rulesetName}
                </h3>
                {d.rulesetResult.map((retByPri, index) =>
                  <div key={index}>
                    <h4>
                      Priority: {4 - index}
                    </h4>
                    <div>
                      Error: {retByPri.errorCount}
                    </div>
                    <Collapse accordion={true} transitionTime={0}>
                      <Collapse.Panel header="Detail">
                        <ul>
                          {retByPri.results
                            .filter(ret => ret.errorCount > 0)
                            .map((ret, index) => {
                              return (
                                <li key={index}>
                                  <h3>{ret.filePath.replace(rootDir, '~')}</h3>
                                  Error: {ret.errorCount} in file
                                  <ul>
                                    {ret.messages.map((m, index) => {
                                      return (
                                        <p key={index}>
                                          <div>
                                            {m.line}:{m.column}
                                            <code>{m.source}</code>
                                            <br />
                                            {m.message} / {m.ruleId}
                                          </div>
                                        </p>
                                      )
                                    })}
                                  </ul>
                                </li>
                              )
                            })}
                        </ul>
                      </Collapse.Panel>
                    </Collapse>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
