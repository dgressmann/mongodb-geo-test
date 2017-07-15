# Experimenting with MongoDB’s spatial indexing

_originally posted on the iPROFS BV blog on 11/07/2012 by Daniel Gressmann_

I was experimenting with NoSQL, and MongoDB in particular, out of curiosity when
I came across its ability to do spatial indexing. Spatial indexing will let you
index your documents based on latitude and longitude. The reason this peaked my
interest was a recent project I have worked on. Perhaps in a next release of the
project NoSQL might be an option to consider, so it was time to explore this
feature a little better. So I came up with a possible scenario to use it on.

Let’s say you are in Paris and there is a special promo page if you are within
50 metres of the Eiffel tower. If you are outside of this radius you will just
get information about the nearest metro station. The default options to search
on the spatial index are fine in most cases. You’re able to get the nearest
points in order of proximity. In my case there is a little extra needed.

## The basics of NoSQL
First let’s go through the basics. NoSQL, or in other words Not Only SQL, is a
concept to augment or replace traditional storage in relational databases with
technologies to enhance scalability and read speed. MongoDB is a document based
NoSQL database, which means it allows you to store and retrieve data as
documents. You could say documents are like records and then some or you could
say they are more like the real world documents than records in relational
databases will ever be. It wouldn’t be too difficult to imagine what a
collection is, a drawer of a file cabinet. So we could say MongoDB is a file
cabinet with drawers (collections) where we store the documents.

## Before we start
In order to experiment we need a MongoDB installation and some data.

There are several options to get an installation. You could opt for installing
through installers, extract archive files or register for any of the providers
of online MongoDB servers. The MongoDB main site even has a “try me” environment
sufficient enough to follow the steps that I made. I won’t use 
[multi-location documents](http://www.mongodb.org/display/DOCS/Geospatial+Indexing#GeospatialIndexing-MultilocationDocuments), so what I will be explaining works with any MongoDB 1.4+ installation
because spatial indexing came with version 1.4 I happen to do all the
experimenting with a local installation at version 2.0.4.

## Start and insert
Because my installation is local I have to start the MongoDB server with the
command mongod and then connect to it using the mongo shell (command `mongo`).
This will all work just fine for now, the default settings make sure that the
server will run and the shell connects to the right local server. For any other
setup than on your local system, please refer to the manual of the provider.

Once logged in, it is time to insert the data. Hold on! First we need to know
what to enter and how to do it. In order to properly index your documents you
need to add latitude and longitude. Because the scenario is for the area
surrounding the Eiffel tower I went to Google maps got the geographical
positions.

The points I chose are:

 * Passy metro station
 * Bir-Hakeim metro station
 * La Tour-Maubourg metro station
 * Ecole Militaire metro station
 * La Motte-Picquet – Grenelle
 * Eiffel tower

I wanted to easily recognize which points were found and in which order. This
meant I needed to pick my own ids for the documents, then a simple description,
the geographical position and for the Eiffel tower I added the radius of
validity. Normally picking your own ids isn’t common practice since MongoDB will
generate a unique on insertion.

On the Mongo shell an insert is a simple save on the collection. So it’s in the
form `db.[collection_name].save([object]);` See the listing below for the data I
entered.

```javascript
db.paris.save({ "_id": "passy", "loc": {"lon":2.285930, "lat":48.857320}, "desc": "Passy metro station"});
db.paris.save({ "_id": "birhakeim", "loc": {"lon":2.289355, "lat":48.853645}, "desc": "Bir-Hakeim metro station"});
db.paris.save({ "_id": "ltm", "loc": {"lon":2.310560, "lat":48.857770}, "desc": "La Tour-Maubourg metro station"});
db.paris.save({ "_id": "ecole", "loc": {"lon":2.306315, "lat":48.854690}, "desc": "Ecole Militaire metro station"});
db.paris.save({ "_id": "eiffel", "loc": {"lon":2.29510, "lat":48.857910}, "desc": "Eiffel tower", radius: 50});
db.paris.save({ "_id": "lmpg", "loc": {"lon":2.297945, "lat":48.848900}, "desc": "La Motte-Picquet - Grenelle"});
```

You can see that the `loc` element is a document as well. The spatial indexing
feature requires this. For single point indexing the document needs exactly two
fields, with longitude as first value and latitude as the second one. In my case
I labeled the fields, but even if I switched the labels it wouldn’t switch the
order of the fields. On querying you need to use the same order or values, again
not paying attention to the labels.

Next we need to create the spatial index. If we forget this, then the shell
reminds us on querying. You create indexes with the `ensureIndex` command on a
collection, so you “ensure” the spatial index like this:

```javascript
db.paris.ensureIndex({"loc": "2d"});
```

This tells MongoDB to put a spatial index on the `loc` element. We could add more
fields to this index, but it’s not necessary in this case.

## First query
Now that we entered the data and put an index on it, we can start querying the
collection. For this we use the `$near` element in our find query on a collection.
It looks like this:

```javascript
db.paris.find({ loc: { $near: [2.298800,48.854355] }});
```

Which gives us as results:

```javascript
{ "_id": "eiffel", "loc": {"lon":2.29510, "lat":48.857910}, "desc": "Eiffel tower"}
{ "_id": "lmpg", "loc": {"lon":2.297945, "lat":48.848900}, "desc": "La Motte-Picquet - Grenelle"}
{ "_id": "ecole", "loc": {"lon":2.306315, "lat":48.854690}, "desc": "Ecole Militaire metro station"}
{ "_id": "birhakeim", "loc": {"lon":2.289355, "lat":48.853645}, "desc": "Bir-Hakeim metro station"}
{ "_id": "ltm", "loc": {"lon":2.310560, "lat":48.857770}, "desc": "La Tour-Maubourg metro station"}
{ "_id": "passy", "loc": {"lon":2.285930, "lat":48.857320}, "desc": "Passy metro station"}
```

When you look at the queried coordinates on Google maps, then you will see that
the results we got from the query are wrong. It is because the calculations for
this result are based on the assumption the earth is flat and angles between
latitude and longitude are the same everywhere. This isn’t true and gives a
distorted image of what is actually closer, two items at the same distance, one
north and one east, might [differ in calculated distance](http://www.mongodb.org/display/DOCS/Geospatial+Indexing#GeospatialIndexing-TheEarthisRoundbutMapsareFlat).

So we use a different element, `$nearSphere`, for higher accuracy. The new query
looks like:

```javascript
db.paris.find({ loc: { $nearSphere: [2.298800,48.854355] }});
```

The result is:

```javascript
{ "_id": "eiffel", "loc": {"lon":2.29510, "lat":48.857910}, "desc": "Eiffel tower"}
{ "_id": "ecole", "loc": {"lon":2.306315, "lat":48.854690}, "desc": "Ecole Militaire metro station"}
{ "_id": "lmpg", "loc": {"lon":2.297945, "lat":48.848900}, "desc": "La Motte-Picquet - Grenelle"}
{ "_id": "birhakeim", "loc": {"lon":2.289355, "lat":48.853645}, "desc": "Bir-Hakeim metro station"}
{ "_id": "ltm", "loc": {"lon":2.310560, "lat":48.857770}, "desc": "La Tour-Maubourg metro station"}
{ "_id": "passy", "loc": {"lon":2.285930, "lat":48.857320}, "desc": "Passy metro station"}
```

These results actually match the picture. All the points in the result return in
order of distance, but the distance isn’t given. In most applications this is
just fine, but we need to know if we are within 50 meters of the Eiffel tower.
This means that for documents with a radius we would like an extra filter, but
there is no way (yet) to let MongoDB calculate with the distance as variable
before it returns the documents. In other words, we will have to do the
calculations ourselves and for that we need the distance.

## Second query
MongoDB has another command to get all the documents sorted by nearest with some
extra information, among them is the distance to each document. This is the
`geoNear` command on the database. So to get distance we need to use a database
command instead of a collection command. The same query using geoNear looks
like:

```javascript
db.runCommand( { geoNear: "paris", near: [2.298800, 48.854355], spherical: true });
```

If we would run this command then the distance would be in radians. MongoDB
offers the option to add a multiplier using the `distanceMultiplier` parameter.
In case we want to know the distance in meters we will have to multiply by
6,378,000, this is roughly the radius of the Earth in meters. Running the
command:

```javascript
db.runCommand( { geoNear: "paris", near: [2.298800, 48.854355], spherical: true, distanceMultiplier: 6378000 });
```

Gives us a different structure as return value with in the results part:

```javascript
{
  "dis" : 479.6260611617079,
  "obj" : {
    "_id" : "eiffel",
    "loc" : {
      "lon" : 2.2951,
      "lat" : 48.85791
    },
    "desc" : "Eiffel tower",
    "radius" : 50
  }
},
{
  "dis" : 551.6879273121484,
  "obj" : {
    "_id" : "ecole",
    "loc" : {
       "lon" : 2.306315,
       "lat" : 48.85469
    },
    "desc" : "École Militaire"
  }
}
⋮
```

And we see the distances in meters! All that is left is to filter out documents
where the location in the query is outside of the radius. For now all you can do
is loop through the results until there is a document without radius or the
distance is smaller than the radius.

Because manually entering the data was not only time-consuming as well as
boring, I made a small Node.js app and ~~[hosted it here](http://pure-dawn-8702.herokuapp.com/)~~ (removed the app, because it's not functioning for now)
on Heroku. It allows you to drag the smiley across the map and updates the
information content when the smiley drops. You can find the source code at [github](https://github.com/dmgress/mongodb-geo-test).

