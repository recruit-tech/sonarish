/* @flow */
import path from 'path'
import fs from 'fs'
import { report } from 'sonarish-core'

const SONARISH_PATH = '/tmp/sonarish'

// /repo/:name
export default (req: any, res: any) => {
  const { name } = req.params
  const repoPath = path.resolve(path.join(SONARISH_PATH, 'results', name))
  if (!fs.existsSync(repoPath)) {
    return res.send({
      error: true,
      message: `There is no ${name}`
    })
  }
  res.send({
    error: false,
    name,
    data: report(repoPath)
  })
}
