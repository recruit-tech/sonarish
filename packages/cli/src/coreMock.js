/* @flow */

export function report() {
  return {
    score: 100
  }
}

export function buildEslintOptions() {
  return {
    useEslintrc: true,
    ignore: true
  }
}

export function calcStats() {
  return {
    totalScore: 1000
  }
}
