/* @flow */
import React from 'react'

export default class Opener extends React.Component {
  props: {
    title: string,
    content: () => any
  }

  state: {
    opened: boolean
  } = {
    opened: false
  }

  render() {
    return (
      <div>
        <span>
          {this.props.title}
        </span>
        <button onClick={() => this.setState({ opened: !this.state.opened })}>
          {this.state.opened ? '-' : '+'}
        </button>
        <div>
          {this.state.opened && this.props.content()}
        </div>
      </div>
    )
  }
}
