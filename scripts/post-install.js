#!/usr/bin/env node
var fs = require('fs-extra');

/* static dep images */
var images = [
    './node_modules/jquery-ui/themes/base/images/ui-icons_444444_256x240.png',
    './node_modules/jquery-ui/themes/base/images/ui-icons_555555_256x240.png'
];

var publicPath = './public/';
var imagePath = publicPath + 'images/';
if ( ! fs.existsSync(publicPath) ) { fs.mkdirSync(publicPath); }
if ( ! fs.existsSync(imagePath) ) { fs.mkdirSync(imagePath); }
images.forEach( function ( path ) {
    var matches = path.match(/\/([^\/]+)$/);
    console.log( 'Copy image: ' + matches[1] );
    fs.copySync( path, imagePath+matches[1] );
});
