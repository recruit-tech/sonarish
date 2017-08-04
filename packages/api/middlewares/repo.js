/* @flow */
import path from 'path'
import fs from 'fs'

const SONARISH_PATH = path.join(process.env.HOME || '', '.sonarish')

// /repo/:name
export default (req: any, res: any) => {
  const { name } = req.params
  const repoPath = path.join(SONARISH_PATH, 'results', name + '.json')
  console.log('exists', repoPath)
  if (!fs.existsSync(repoPath)) {
    return res.send({
      error: true,
      message: `There is no ${name}`
    })
  }
  const raw = fs.readFileSync(repoPath).toString()
  const data = JSON.parse(raw)
  res.send({
    error: false,
    name,
    data
  })
}
