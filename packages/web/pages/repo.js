import fetch from 'isomorphic-fetch'
import React from 'react'
import Link from 'next/link'
import Header from '../components/Header'

const API_HOST = 'http://localhost:3001'

export default class Repo extends React.Component {
  static async getInitialProps(props) {
    console.log(props)
    const { name } = props.query
    const res = await fetch(API_HOST + `/repo/${name}`)
    return res.json()
  }
  render() {
    const { data } = this.props
    return (
      <div>
        <Header />
        <h2>Repo: {this.props.name}</h2>
        <div>
          errorCount: {data.errorCount}
          <br />
          warningCount: {data.warningCount}
        </div>
        <ul>
          {data.results.filter(ret => ret.errorCount > 0).map((ret, index) => {
            return (
              <li key={index}>
                <h3>fpath: {ret.filePath}</h3>
                errorCount: {ret.errorCount}
                <br />

                <ul>
                  {ret.messages.map((m, index) => {
                    return (
                      <p key={index}>
                        {m.column}:{m.row} - {m.message}
                      </p>
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
