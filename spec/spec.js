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

  it('should sign up a new member', function() {
    helpers.logout().then(function() {
      element(by.linkText('Sign Up')).click().then(function() {
        element(by.model('newMember.firstName')).sendKeys('Mr.');
        element(by.model('newMember.lastName')).sendKeys('Spock');
        element(by.model('newMember.email')).sendKeys('mspock@starfleet.gov');
        element(by.model('newMember.password')).sendKeys('prosper');
        element(by.model('newMember.passwordConfirmation')).sendKeys('prosper');
        element(by.partialButtonText('Sign Up')).click().then(function() {
          expect(browser.getCurrentUrl()).toEqual(helpers.host + '/');
        });
      });
    });
  });

  it('should update logged in member', function() {
    helpers.logout().then(function() {
      helpers.login('mspock@starfleet.gov', 'prosper').then(function() {
        element(by.linkText('My Account')).click().then(function() {
          element(by.model('member.firstName')).clear().sendKeys('Spock');
          element(by.model('member.lastName')).clear().sendKeys('Son of Sarek');
          element(by.partialButtonText('Save')).click().then(function() {
            expect(element(by.className('alert-message')).getText()).toEqual('Member saved.');
          });
        });
      });
    });
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

  it('should create a new group', function() { // Presently failing due to a Protractor bug. Fix when a workaround is found
    var name = 'New Group';
    var description = 'Super cool, new group.';
    var maxSize = 5;

    helpers.navToGroups().then(function() {
      element(by.partialButtonText('New Group')).click().then(function() {
        element(by.model('group.name')).sendKeys(name);
        element(by.model('group.description')).sendKeys(description);
        element(by.model('group.maxSize')).sendKeys(maxSize);
        element(by.partialButtonText('Create')).click().then(function() {
          element(by.repeater('group in groups').row(3).column('group.name')).click().then(function() {
            expect(element(by.tagName('legend')).getText()).toEqual(name);
          });
        });
      });
    });
  });

});