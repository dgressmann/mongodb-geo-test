var should = require('chai').should();

describe('MongoDB geo test', function(){
  it('should have routes', function(done){
    var app = require('../app.js');
    should.exist(app.routes);
    done();
  });
  it('should have GET routes', function(done){
    var app = require('../app.js');
    should.exist(app.routes.get);
    done();
  });
  it('should have a route for /', function(done){
    var app = require('../app.js');
    var request = require('supertest');

    request(app).get('/').expect(200, done);
  });
});

