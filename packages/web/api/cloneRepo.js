const Git = require('nodegit')
const mkdirp = require('mkdirp')

const SONARISH_REPOS_PATH = '/tmp/sonarish-repos'
// /repo/clone?url=...&name=repo_name
module.exports = async (req, res) => {
  const { url, name } = req.params
  mkdirp.sync(SONARISH_REPOS_PATH)
  const clonePath = path.resolve(SONARISH_REPOS_PATH, name)
  try {
    await GitClone(url, clonePath)
    res.send({
      error: 0,
      repo
    })
  } catch (error) {
    res.send({
      error
    })
  }
}
