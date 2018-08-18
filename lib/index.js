const { ConcatSource } = require('webpack-sources')

module.exports = class BookmarkletPlugin {
  constructor ({
    test = /\.js$/,
    replace = '.bookmarklet'
  } = {}) {
    this.test = RegExp.prototype.test.bind(test)
    this.replacement = replace
  }

  toBookmarklet ({ assets }) {
    return filename => {
      const source = assets[filename].source()
      const bookmarklet = filename.replace(this.test, this.replacement)

      assets[bookmarklet] = new ConcatSource(
        'javascript:(function(){',
        encodeURIComponent(source),
        '})();'
      )
    }
  }

  apply (compiler) {
    compiler.plugin('emit', (compilation, done) => {
      compilation.chunks.forEach(chunk => {
        chunk.files
          .filter(this.test)
          .forEach(this.toBookmarklet(compilation), this)
      })

      done()
    })
  }
}
