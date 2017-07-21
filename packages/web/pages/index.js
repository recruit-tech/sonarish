/* @flow */
import React from 'react'
import Link from 'next/link'
import Header from '../components/Header'

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div>
          <Link
            href={{
              pathname: 'repo',
              query: { name: 'express' }
            }}
          >
            <a>repo:express</a>
          </Link>
          <Link
            href={{
              pathname: 'repo',
              query: { name: 'shift' }
            }}
          >
            <a>repo:shift</a>
          </Link>
        </div>
      </div>
    )
  }
}
