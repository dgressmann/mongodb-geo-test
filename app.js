
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes');

var app = module.exports = express.createServer();
var mongo = require('mongoskin');

var debug = function() {
   if (app.settings.env == 'development') {
     console.log.apply(this, arguments);
   }
}

// Configuration

app.configure(function(){
   app.set('views', __dirname + '/views');
   app.set('view engine', 'jade');
   app.set('view options', {layout: false});
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

var db = mongo.db( process.env.MONGOLAB_URI || 'localhost:27017/test?auto_reconnect=true');

// Routes

app.get('/', function(req, res){
   res.render('index', { title: 'Getting to the Eiffel tower'});
}); 

app.get('/nearest', function(req, res) {
   debug("req %s '%s'", req.xhr, JSON.stringify({lat: req.param('lat'), lon: req.param('lon')}));
   if (req.param('lat') && req.param('lon')) {
      lat = parseFloat(req.param('lat'));
      lon = parseFloat(req.param('lon'));
      debug("latlng available");
      var nearest;
      db.command({geoNear: 'paris', near: [lon, lat], num: 10, distanceMultiplier: 6378000, spherical: true}, function(err, points){
         if (err) { 
            console.log(JSON.stringify(err));
            throw err;
         }
         debug("stats: %s",JSON.stringify(points.stats));
         if (points.stats.objectLoaded == 0){
            debug("no points");
            res.render('nopoints', {layout: false});
         }
         else {
            for (var i =0; i < points.results.length; i++ ) {
               nearest = point = points.results[i];
               distance = nearest.dis;
               debug(JSON.stringify(nearest));
               if (point.obj.radius) { // the point has a radius
                  debug("distance: %s. radius: %s", distance, point.obj.radius);
                  if ( distance < point.obj.radius) break; // distance is smaller than radius
               }
               else {
                  break;
               }
            }
            var obj = nearest.obj;
            debug("Nearest: %s", JSON.stringify(nearest));
            distance = Math.round(distance*100)/100;
            res.render(obj._id, { layout: false, title: obj.desc, lat: obj.loc.lat, lon: obj.loc.lon, distance: distance});
         }
      });
   }
   else {
      debug("no latlng");
      res.render('instructions', {layout: false});
   }
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
   console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
