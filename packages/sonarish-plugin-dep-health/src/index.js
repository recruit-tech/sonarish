/* @flow */
import npmCheck from 'npm-check'
import semver from 'semver'
import type { Context, Definition } from 'sonarish-types'

/* This is plugin implementation example*/

type RawResult = {
  score: number,
  packages: Array<{
    installed: string,
    latest: string
  }>
}

// Score
const LATEST = 3 / 3
const PRELEASE_OUTDATED = 2.5 / 3
const PATCH_OUTDATED = 2 / 3
const MINOR_OUTDATED = 1 / 3
const MAJOR_OUTDATED = 0

const calcScoreByPackage = pkg => {
  if (pkg.latest === pkg.installed) {
    return LATEST
  }
  const latest = semver.parse(pkg.latest)
  const installed = semver.parse(pkg.installed)
  if (latest.major > installed.major) {
    return MAJOR_OUTDATED
  } else if (latest.minor > installed.minor) {
    return MINOR_OUTDATED
  } else if (latest.patch > installed.patch) {
    return PATCH_OUTDATED
  } else {
    return PRELEASE_OUTDATED
  }
}

export default {
  type: 'dep-health',
  async calcScore(
    _ctx: Context,
    _definition: Definition,
    opts: { cwd?: string }
  ) {
    const state = await npmCheck({ cwd: opts.cwd || process.cwd() })
    const packages = state.get('packages')
    const total = packages
      .filter(pkg => pkg.installed && pkg.latest)
      .reduce((acc, pkg) => {
        return acc + calcScoreByPackage(pkg)
      }, 0)
    const score = total / packages.length
    return {
      type: 'dep-health',
      score,
      rawResult: {
        score,
        packages
      }
    }
  },
  format(_ctx: Context, result: RawResult) {
    const outdated = result.packages.filter(m => {
      return m.installed === m.latest
    })
    const text = outdated.map(m => `${m.latest} > ${m.installed}`).join('\n')
    return `dep-health: ${result.score}\n${text}\n`
  }
}
