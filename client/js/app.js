(function(sg) {
  sg.app = angular.module('smallGroups', [
    'ngRoute',
    'ngResource',
    'angular-flash.service',
    'angular-flash.flash-alert-directive'
  ]);

  sg.app.config([ '$routeProvider', 'flashProvider', '$httpProvider',
    function($routeProvider, flashProvider, $httpProvider) {

      flashProvider.errorClassnames.push('alert-danger');
      flashProvider.warnClassnames.push('alert-warning');
      flashProvider.infoClassnames.push('alert-info');
      flashProvider.successClassnames.push('alert-success');

      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainController'
        })
        .when('/login', {
          templateUrl: 'views/login/login.html',
          controller: 'LoginController'
        })
        .when('/groups', {
          templateUrl: 'views/groups/index.html',
          controller: 'GroupsController'
        })
        .when('/groups/:groupId', {
          templateUrl: 'views/groups/show.html',
          controller: 'GroupController'
        });
    }
  ]);

  sg.confirm = function(msg, yes_callback, no_callback) {
    function closeModal() {
      $modal.modal('hide');
      $footer.find('button').off();
    }

    var $modal = $('#confirm-message');
    var $footer = $modal.find('.modal-footer');

    $modal.find('.modal-body').html(msg);
    $modal.modal('show');
    $footer.find('button:first').click(function() {
      if (yes_callback) {
        yes_callback();
      }
      closeModal();
    });
    $footer.find('button:last').click(function() {
      if (no_callback) {
        no_callback();
      }
      closeModal();
    });

  };
})(window.sg = window.sg || {});