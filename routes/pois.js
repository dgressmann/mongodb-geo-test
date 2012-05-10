
/*
 * Get locations
 */

exports.pois = function(req, res){
   console.log("HI!");
//   if (req.xhr){
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
  // }
};
