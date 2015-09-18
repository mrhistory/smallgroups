var SpecHelpers = {
  host: 'http://localhost:3000/#',

  login: function(email, password) {
    browser.get(this.host + '/login');
    element(by.model('loginCreds.email')).sendKeys(email);
    element(by.model('loginCreds.password')).sendKeys(password);
    return element(by.partialButtonText('Log In')).click();
  },

  logout: function() {
    return element(by.linkText('Logout')).click();
  },

  navToGroups: function() {
    return element(by.linkText('Groups')).click();
  }
};

module.exports = SpecHelpers;