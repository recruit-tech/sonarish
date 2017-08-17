/* @flow */
import fs from 'fs'
import { execSync } from 'child_process'

// Example:
//   git@github.com:mizchi/sonarish.git => sonarish
export function gitUrlToName(gitUrl: string): string {
  return gitUrl.split('/').reverse()[0].split('.git')[0]
}

export function cloneOrRebase(
  gitUrl: string,
  endpoint: string,
  branch: string = 'master'
) {
  if (fs.existsSync(endpoint)) {
    console.log('fetch', gitUrl)
    const ret = execSync(
      `cd ${endpoint}; git fetch --depth 1 origin ${branch}; git reset origin/master --hard`
    )
    console.log(ret.toString())
  } else {
    console.log('clone', gitUrl)
    const ret = execSync(`git clone --depth 1 ${gitUrl} ${endpoint}`)
    console.log(ret.toString())
  }
}
