Experimenting with MongoDB's Spatial Indexing sample code
=========================================================

This repository contains the code accompanying the blog at ~~[http://blog.iprofs.nl/2012/07/11/experimenting-with-mongodbs-spatial-indexing/](https://iprofs.wordpress.com/2012/07/11/experimenting-with-mongodbs-spatial-indexing/)~~.

Currently the status of this code is: [![Build Status](https://travis-ci.org/dgressmann/mongodb-geo-test.png?branch=master)](https://travis-ci.org/dmgress/mongodb-geo-test)

Sample data
-----------
In order to have a similar setup you will need to import some data into a MongoDB collection called `paris` if you don't plan on modifying the source code.

```javascript
db.paris.save({ "_id": "passy", "loc": {"lon":2.285930, "lat":48.857320}, "desc": "Passy metro station"});
db.paris.save({ "_id": "birhakeim", "loc": {"lon":2.289355, "lat":48.853645}, "desc": "Bir-Hakeim metro station"});
db.paris.save({ "_id": "ltm", "loc": {"lon":2.310560, "lat":48.857770}, "desc": "La Tour-Maubourg metro station"});
db.paris.save({ "_id": "ecole", "loc": {"lon":2.306315, "lat":48.854690}, "desc": "Ecole Militaire metro station"});
db.paris.save({ "_id": "eiffel", "loc": {"lon":2.29510, "lat":48.857910}, "desc": "Eiffel tower", radius: 50});
db.paris.save({ "_id": "lmpg", "loc": {"lon":2.297945, "lat":48.848900}, "desc": "La Motte-Picquet - Grenelle"});
```
