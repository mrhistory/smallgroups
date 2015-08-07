(function(sg) {
  sg.app.controller('GroupController', [ '$scope', '$location', '$resource', '$routeParams', 'flash',
    function($scope, $location, $resource, $routeParams, flash) {
      var Group = $resource('/api/groups/:groupId', { groupId: "@id", format: 'json' });

      Group.get({groupId: $routeParams.groupId},
        ( function(group) { $scope.group = group; } ),
        ( function(httpResponse) {
            $scope.group = null;
            flash.error = 'There is no group with ID ' + $routeParams.groupId;
          }
        )
      );

      $scope.back = function() { $location.path('/groups'); };
    }
  ]);


  sg.app.controller('GroupsController', [ '$scope', '$resource', '$location',
    function($scope, $resource, $location) {
      var Groups = $resource('/api/groups', { format: 'json' });
      Groups.query({},
        ( function(results) { $scope.groups = results; } ),
        ( function(httpResponse) { $scope.groups = null; } )
      );

      $scope.showGroup = function(groupId) { $location.path("/groups/" + groupId); };
    }
  ]);


  sg.app.controller('LoginController', [ '$scope', '$location', 'flash', '$rootScope',
    function($scope, $location, flash, $rootScope) {
      $scope.login = function(loginCreds) {
        
      };
    }
  ]);


  sg.app.controller('MainController', [ '$scope', '$routeParams', '$resource',
    function($scope, $routeParams, $resource) {
      
    }
  ]);


  sg.app.controller('NavbarController', [ '$scope', '$location',
    function($scope, $location, Session) {
      $scope.goToGroups = function() { $location.path('/groups'); }
      $scope.goToLogin = function() { $location.path('/login'); }
    }
  ]);
})(window.sg = window.sg || {});