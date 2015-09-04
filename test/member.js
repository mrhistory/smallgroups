var should = require('should');
var assert = require('assert');
var request = require('supertest');

describe('Member', function() {
  var host = 'http://localhost:3000';

  it('should return field "fullNameAndEmail"', function(done) {
    request(host)
      .get('/api/Member/1')
      .end(function(err, res) {
        if (err) throw err;

        res.should.have.status(200);
      });
  });
});