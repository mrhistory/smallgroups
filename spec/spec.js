var helpers = require('./spec-helpers');
var webdriver = require('selenium-webdriver');

describe('Small Groups App', function() {

  beforeEach(function() {
    helpers.login('admin@starfleet.gov', 'admin');
  });

  afterEach(function() {
    helpers.logout();
  });

  it('should log in a member', function() {
    expect(browser.getCurrentUrl()).toEqual(helpers.host + '/');
  });

  it('should display a list of groups', function() {
    helpers.navToGroups().then(function() {
      expect(element(by.repeater('group in groups').row(0).column('group.name')).isPresent()).toBe(true);
    });
  });

  it('should display group details', function() {
    helpers.navToGroups().then(function() {
      element(by.repeater('group in groups').row(0).column('group.name')).click().then(function() {
        expect(element(by.repeater('groupMember in group.groupMembers').row(0)).isPresent()).toBe(true);
      });
    });
  });

  it('should create a new group', function() {
    var name = 'New Group';
    var description = 'Super cool, new group.';
    var maxSize = 5;

    helpers.navToGroups().then(function() {
      element(by.partialButtonText('New Group')).click().then(function() {
        element(by.model('group.name')).sendKeys(name);
        element(by.model('group.description')).sendKeys(description);
        element(by.model('group.maxSize')).sendKeys(maxSize);
        element(by.partialButtonText('Create')).click().then(function() {
          element(by.repeater('group in groups').row(4).column('group.name')).click().then(function() {
            expect(element(by.model("group.name")).getText()).toEqual(name);
          });
        });
      });
    });
  });

});