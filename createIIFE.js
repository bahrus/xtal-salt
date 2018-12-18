const jiife = require('jiife');
const xl = 'node_modules/xtal-latx/';
jiife.processFiles([xl + 'define.js', xl + 'xtal-latx.js', 'xtal-salt.js'], 'dist/xtal-salt.iife.js');