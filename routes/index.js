
/*
 * GET home page.
 */

exports.index = function(req, res){
   var points 
      db.collection('paris').find({ loc: { $near: [2.298800,48.854355] }}).toArray(function(err, points){
         if (err){
            console.log("Oops! Error: %s", err);
         }
         else {
            console.log("Result:\n%s", result);

            res.render('index', { title: 'Getting to the Eiffel tower', points: points })
         }
      }); 
   //res.render('index', { title: 'Getting to the Eiffel tower' })
};
