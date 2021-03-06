'use strict'

var fs = require('fs')
var peg = require('pegjs')
var uglify = require('uglify-js')

var index = fs.readFileSync(__dirname + '/index.js', 'utf8')
var parser = peg.buildParser(fs.readFileSync(__dirname + '/grammer.pegjs', 'utf8'), {trackLineAndColumn: true, output: 'source'})

var result = '// This file is automatically generated from the contents of `/src` using `/src/compile.js`\n\n' + index.replace("import './grammer.pegjs'", parser)

var minify = true
if (minify) {
  result = uglify.minify(result, {
    fromString: true,
    output: { ascii_only: true, indent_level: 2, beautify: true }
  }).code
}
Function('exports,module,require', result)(exports, module, require)

// If we're being called from the command line, output the file
//if (require.main && require.main.id === module.id) {
  fs.writeFileSync(__dirname + '/../index.js', result, 'utf8')
//}