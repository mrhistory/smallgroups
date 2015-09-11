var request = require('supertest');

module.exports = {

  login: function(host, cb) {
    request(host)
      .post('/api/Members/login')
      .send({email: 'admin@starfleet.gov', password: 'admin'})
      .end(function(err, res) {
        if (err) throw err;
        cb(res.body.id);
      });
  },

  logout: function(host, accessToken) {
    request(host).post('/api/Members/logout?access_token=' + accessToken);
  }

};