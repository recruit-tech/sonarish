// TODO
const Git = require('nodegit')

// /repo/sync?name=repo_name
module.exports = async (req, res) => {
  const { name } = req.params
  try {
    // await Git.Reset.reset(url, rootPath)
    // res.send({
    //   error: 0,
    //   repo
    // })
  } catch (error) {
    res.send({
      error
    })
  }
}
