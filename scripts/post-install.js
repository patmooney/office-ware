#!/usr/bin/env node
var brunch = new require('brunch');
var fs = require('fs-extra');

brunch.build({});

/* static dep images */
var images = [
    './node_modules/jquery-ui/themes/base/images/ui-icons_444444_256x240.png',
    './node_modules/jquery-ui/themes/base/images/ui-icons_555555_256x240.png'
];

var imagePath = 'public/images/';
if ( ! fs.existsSync(imagePath) ) { fs.mkdirSync(imagePath) }
images.forEach( function ( path ) {
    var matches = path.match(/\/([^\/]+)$/);
    fs.copySync( path, imagePath+matches[1] );
});
