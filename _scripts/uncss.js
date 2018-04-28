/*
    Strips unused CSS.

    I just want to use it for bootstrap so afterwards modify the output manually and remove everything after that block.

*/

var uncss = require('uncss'),
    fs = require('fs');

var files   = ['_site/*.html', '_site/gigs/**/index.html', '_site/artists/**/index.html', '_site/venues/**/index.html', '_site/about/index.html', '_site/blog/**/index.html'],
    options = {
        ignore: [ '.open>.dropdown-menu', '.open>a'],
        ignoreSheets: [/fonts.googleapis/, 'main.css'],
        htmlroot: '_site',
    };

uncss(files, options, function (error, output) {

    fs.writeFileSync("./_sass/vendor/bootstrap.uncss.scss", output, function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("Saved to ./_sass/vendor/bootstrap.uncss.scss");
    }); 

});
