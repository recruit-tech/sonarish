/* @flow */
import React from 'react'
import Link from 'next/link'

export default function Header() {
  return (
    <header>
      <Link href="/">
        <a>Top</a>
      </Link>
      <hr />
    </header>
  )
}
