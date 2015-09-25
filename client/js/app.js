(function(sg) {
  sg.app = angular.module('smallGroups', [
    'ngRoute',
    'ngResource',
    'angular-flash.service',
    'angular-flash.flash-alert-directive',
    'lbServices',
    'ngTagsInput'
  ]);

  sg.app.config([ '$routeProvider', 'flashProvider', '$httpProvider',
    function($routeProvider, flashProvider, $httpProvider) {
      $httpProvider.interceptors.push(function($q, $location, LoopBackAuth) {
        return {
          responseError: function(rejection) {
            if (rejection.status == 401) {
              LoopBackAuth.clearUser();
              LoopBackAuth.clearStorage();
              $location.nextAfterLogin = $location.path();
              $location.path('/login');
            }
            return $q.reject(rejection);
          }
        };
      });

      flashProvider.errorClassnames.push('alert-danger');
      flashProvider.warnClassnames.push('alert-warning');
      flashProvider.infoClassnames.push('alert-info');
      flashProvider.successClassnames.push('alert-success');

      $routeProvider
        .when('/', {
          templateUrl: 'views/home.html',
          controller: 'HomeController'
        })
        .when('/login', {
          templateUrl: 'views/login/login.html',
          controller: 'LoginController'
        })
        .when('/signup', {
          templateUrl: 'views/signup/signup.html',
          controller: 'SignUpController'
        })
        .when('/myaccount', {
          templateUrl: 'views/account/myaccount.html',
          controller: 'MyAccountController'
        })
        .when('/groups', {
          templateUrl: 'views/groups/index.html',
          controller: 'GroupsController'
        })
        .when('/groups/new', {
          templateUrl: 'views/groups/new.html',
          controller: 'NewGroupController'
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