process.env.NODE_ENV = 'test';

var should = require('should');
var assert = require('assert');
var request = require('supertest');
var helpers = require('./api-helpers');

describe('/api/Members', function() {
  var host = 'http://localhost:3000';

  it('should return field "fullNameAndEmail"', function(done) {
    helpers.login(host, function(accessToken) {
      request(host)
        .get('/api/Members/1?access_token=' + accessToken)
        .end(function(err, res) {
          if (err) throw err;
          res.ok.should.equal(true);
          res.body.fullNameAndEmail.should.equal(res.body.firstName + ' ' + res.body.lastName + ' : ' + res.body.email);
          helpers.logout(host, accessToken);
          done();
        });
    });
  });

});