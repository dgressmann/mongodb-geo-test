
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
   console.log("req %s '%s'", req.xhr, JSON.stringify({lat: req.param('lat'), lon: req.param('lon')}));
   if (req.param('lat') && req.param('lon')) {
      lat = parseFloat(req.param('lat'));
      lon = parseFloat(req.param('lon'));
      console.log("latlng available");
      var nearest;
      db.command({geoNear: 'paris', near: [lon, lat], num: 10, distanceMultiplier: 6378000, spherical: true}, function(err, points){
         if (err) { 
            console.log(JSON.stringify(err));
            throw err;
         }
         console.log("stats: %s",JSON.stringify(points.stats));
         if (points.stats.objectLoaded == 0){
            console.log("no points");
            res.render('nopoints', {layout: false});
         }
         else {
            for (var i =0; i < points.results.length; i++ ) {
               nearest = point = points.results[i];
               distance = nearest.dis;
               console.log(JSON.stringify(nearest));
               if (point.obj.radius) { // the point has a radius
                  console.log("distance: %s. radius: %s", distance, point.obj.radius);
                  if ( distance < point.obj.radius) break; // distance is smaller than radius
               }
               else {
                  break;
               }
            }
            var obj = nearest.obj;
            console.log("Nearest: %s", JSON.stringify(nearest));
            res.render(obj._id, { layout: false, title: obj.desc, lat: obj.loc.lat, lon: obj.loc.lon, distance: distance});
         }
      });
   }
   else {
      console.log("no latlng");
      res.render('instructions', {layout: false});
   }
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
   console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
