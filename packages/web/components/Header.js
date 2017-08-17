/* @flow */
import * as React from 'react';
import Link from 'next/link'

export default function Header() {
  return (
    <header>
      <h1>
        <Link href="/">
          <a style={{ color: 'black', textDecoration: 'none' }}>Sonarish</a>
        </Link>
      </h1>
      <hr />
    </header>
  )
}
