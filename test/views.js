var should = require('chai').should(),
    jade   = require('jade'),
    fs     = require('fs'),
    path   = require('path');

fs.readdir('views', function(err, files){
  if (err) throw err;
  
  files
    .map(function(file) { return path.join('views', file); }) 
    .filter(function(file){ return fs.statSync(file).isFile(); })
    .sort()
    .forEach(function(file){
      describe("Template '" + file + "'", function(){
        it('should render without errors', function(done){
          jade.renderFile(file, {},function(err, html){
            if (err) throw err;
            done();
          });
        });
      });
    });
});

