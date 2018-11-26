const fs = require('fs')
fs.readFile(
  'node_modules/xhr2-cookies/dist/xml-http-request.js',
  'utf8',
  function(err, data) {
    if (err) {
      return console.log(err)
    }

    var result = data.replace(
      new RegExp('.*_this._userAgent.+=.+Mozilla/5.0 .*;', 'i'),
      '        _this._userAgent = "Mozilla/5.0 (" + os.type() + " " + os.arch() + ") " + (\'versions\' in process ? "node.js/" + process.versions.node + " v8/" + process.versions.v8 : \'\');'
    )

    fs.writeFile(
      'node_modules/xhr2-cookies/dist/xml-http-request.js',
      result,
      'utf8',
      function(err) {
        if (err) return console.log(err)
      }
    )
  }
)
