/* @flow */
import 'isomorphic-fetch'
import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
// import flush from 'styled-jsx/server'

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage()
    // const styles = flush()
    return { html, head, errorHtml, chunks }
  }

  render() {
    return (
      <html>
        <Head>
          <style>{`
            body { margin: 30px }
          `}</style>
          <link rel="stylesheet" href="/static/index.css" />
        </Head>
        <body className="custom_class">
          {this.props.customValue}
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
