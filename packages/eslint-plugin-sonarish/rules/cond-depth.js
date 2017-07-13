// TODO
module.exports = function condDepth({ types }) {
  return {
    pre(file) {
      this.types = types
    },

    visitor: {
      SwitchStatement(nodePath) {},
      IfStatement(nodePath) {}
    }
  }
}
