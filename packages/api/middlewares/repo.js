/* @flow */
import path from 'path'
import fs from 'fs'
import { report } from 'sonarish-core'

const SONARISH_REPOS_PATH = '/tmp/sonarish-repos'

// /repo/:name
export default (req: any, res: any) => {
  const { name } = req.params
  const rootPath = path.resolve(SONARISH_REPOS_PATH, name)
  if (!fs.existsSync(rootPath)) {
    return res.send({
      error: true,
      message: `There is no ${name}`
    })
  }
  res.send({
    error: false,
    name,
    data: report(rootPath)
  })
}
