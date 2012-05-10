
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes');

var app = module.exports = express.createServer();
var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/test?auto_reconnect=true');

// Configuration

app.configure(function(){
   app.set('views', __dirname + '/views');
   app.set('view engine', 'jade');
   app.use(express.bodyParser());
   app.use(express.methodOverride());
   app.use(app.router);
   app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
   app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
   app.use(express.errorHandler());
});

// Routes

//app.get('/', routes.index);
app.get('/', function(req, res){
   var points 
   db.collection('paris').find({ loc: { $near: [2.298800,48.854355] }}).toArray(function(err, points){
      if (err){
         console.log("Oops! Error: %s", err);
      }
      else {
         console.log("Result:\n%s", points);

         res.render('index', { title: 'Getting to the Eiffel tower', points: points })
      }
   }); 
//res.render('index', { title: 'Getting to the Eiffel tower' })
});
app.get('/pois', function(req, res){
   if (req.xhr){
      var points = db.command({ geoNear:'paris', near: [2.298800,48.854355], 
         num: 10, spherical: true}, function(err, result){
            if (err){
               console.log("Oops! Error: %s", err);
            }
            else {
               console.log("Result:\n%s", result);
            }
         }); 
      res.send({});
   }
});
app.get('/nearest', function(req, res) {
   if (req.lon && req.lat) {
      var nearest;
      db.command({geoNear: 'paris', near: [req.lon,req.lat], num: 10, distanceMultiplier: 6378, spherical: true}, function(err, points){
         var found = false;
         while (!found) {
            // iterate over the points, until one without radius or distance < radius is found
         }
      });
      if (nearest){
         res.render(template, { title: , lat: , lon: , distance: });
      }
      else {
         res.render('instructions');
      }
   }
   else {
      res.render('instructions');
   }
});

app.listen(3000, function(){
   console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
