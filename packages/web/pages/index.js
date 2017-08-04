/* @flow */
import React from 'react'
import Link from 'next/link'
import Header from '../components/Header'

const API_HOST = 'http://localhost:3001'

export default class Index extends React.Component {
  props: {
    data: any
  }
  static async getInitialProps() {
    const res = await fetch(API_HOST + `/repoList`)
    return res.json()
  }
  render() {
    console.log(this.props)
    return (
      <div>
        <Header />
        <ul>
          {this.props.data.map(repo =>
            <li key={repo.name}>
              <Link
                href={{
                  pathname: 'repo',
                  query: { name: repo.name }
                }}
              >
                <a>
                  {repo.name} / {repo.gitUrl}
                </a>
              </Link>
            </li>
          )}
        </ul>
      </div>
    )
  }
}
