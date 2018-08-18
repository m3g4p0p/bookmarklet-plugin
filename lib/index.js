const { ConcatSource } = require('webpack-sources')

module.exports = class BookmarkletPlugin {
  constructor ({
    test = /\.js$/,
    replacement = '.bookmarklet',
    keep = false
  } = {}) {
    this.test = test
    this.replacement = replacement
    this.keep = keep
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

      if (!this.keep) {
        delete assets[filename]
      }
    }
  }

  apply (compiler) {
    compiler.hooks.emit.tap('BookmarkletPlugin', compilation => {
      compilation.chunks.forEach(chunk => {
        chunk.files
          .filter(filename => this.test.test(filename))
          .forEach(this.toBookmarklet(compilation), this)
      })
    })
  }
}
