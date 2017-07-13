const Git = require('nodegit')

// /repo/clone?url=...&name=repo_name
module.exports = async (req, res) => {
  const { url, name } = req.params
  const rootPath = path.resolve(__dirname, '../repos', name)
  try {
    await GitClone(url, rootPath)
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
