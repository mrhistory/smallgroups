var host = 'http://localhost:3000/#';

describe('Small Groups App', function() {
  it('should log in a member', function() {
    browser.get(host + '/login');
    element(by.model('loginCreds.email')).sendKeys('admin@starfleet.gov');
    element(by.model('loginCreds.password')).sendKeys('admin');
    element(by.css('.btn-primary')).click().then(function() {
      expect(browser.getCurrentUrl()).toEqual(host + '/');
    });
  });
});