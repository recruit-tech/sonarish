import 'isomorphic-fetch'
import React from 'react'

const HOST = 'http://localhost:3000'

export default class Index extends React.Component {
  static async getInitialProps({req}) {
    const res = await fetch(HOST + '/repo/aaa')
    return res.json()
  }
  render() {
    return <div>
      Hello, {this.props.name}
    </div>
  }
}
