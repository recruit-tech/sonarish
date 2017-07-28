/* eslint-disable */
const fs = require('fs')
const { execSync } = require('child_process')
// Example:
//   git@github.com:mizchi/sonarish.git => sonarish
function gitUrlToName(gitUrl) {
  return gitUrl.split('/').reverse()[0].split('.git')[0]
}

function cloneOrRebase(gitUrl, endpoint, branch = 'master') {
  if (fs.existsSync(endpoint)) {
    console.log('fetch', gitUrl)
    const ret = execSync(`cd ${endpoint}; git fetch --depth 1 origin ${branch}; git reset origin/master --hard`)
    console.log(ret.toString())
  } else {
    console.log('clone', gitUrl)
    const ret = execSync(`git clone --depth 1 ${gitUrl} ${endpoint}`)
    console.log(ret.toString())
  }
}

module.exports = {
  gitUrlToName, cloneOrRebase
}
