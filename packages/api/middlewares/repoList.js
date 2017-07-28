/* @flow */
import path from 'path'

const SONARISH_PATH = path.join(process.env.HOME || '', '.sonarish')

// /repo/:name
export default (req: any, res: any) => {
  const repoPath = path.join(SONARISH_PATH, 'db.json')
  delete require.cache[repoPath]
  const db = require(repoPath)
  res.send({
    error: false,
    data: db.repos
  })
}
