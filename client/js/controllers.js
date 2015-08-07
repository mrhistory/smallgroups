(function(sg) {
  sg.app.controller('GroupController', [ '$scope', '$location', '$resource', '$routeParams', 'flash', 'Group', 'Member',
    function($scope, $location, $resource, $routeParams, flash, Group, Member) {
      Group.findById({id: $routeParams.groupId},
        function(group) { 
          $scope.group = group;
          Group.groupMemberships({id: $scope.group.id}, function(list) {
            $scope.group.groupMemberships = list;
            $scope.group.groupMemberships.forEach(function(groupMembership) {
              Member.findById({id: groupMembership.memberId}, function(member) {
                groupMembership.member = member;
              });
            });
          });
          Group.groupLeaderships({id: $scope.group.id}, function(list) {
            $scope.group.groupLeaderships = list;
            $scope.group.groupLeaderships.forEach(function(groupLeadership) {
              Member.findById({id: groupLeadership.memberId}, function(member) {
                groupLeadership.member = member;
              });
            });
          });
        },
        function(httpResponse) {
          $scope.group = null;
          flash.error = 'There is no group with ID ' + $routeParams.groupId;
        }
      );

      $scope.back = function() { $location.path('/groups'); };
    }
  ]);


  sg.app.controller('GroupsController', [ '$scope', '$resource', '$location', 'Group',
    function($scope, $resource, $location, Group) {
      Group.find({},
        function(list) {
          $scope.groups = list;
          $scope.groups.forEach(function(group) {
            Group.groupMemberships.count({id: group.id}, function(httpResponse) {
              group.currentSize = httpResponse.count;
            });
          });
        },
        function(httpResponse) { $scope.groups = null; }
      );

      $scope.showGroup = function(groupId) { $location.path("/groups/" + groupId); };
    }
  ]);


  sg.app.controller('LoginController', [ '$scope', '$location', 'flash', '$route', 'Member',
    function($scope, $location, flash, $route, Member) {
      $scope.login = function(loginCreds) {
        Member.login({ rememberMe: $scope.rememberMe }, $scope.loginCreds, function() {
          flash.error = '';
          var next = $location.nextAfterLogin || '/';
          $location.nextAfterLogin = null;
          $location.path(next);
        }, function(httpResponse) {
          flash.error = httpResponse.data.error.message;
        });
      };
    }
  ]);


  sg.app.controller('MainController', [ '$scope', '$routeParams', '$resource',
    function($scope, $routeParams, $resource) {
      
    }
  ]);


  sg.app.controller('NavbarController', [ '$scope', '$location', '$route', 'Member',
    function($scope, $location, $route, Member) {
      $scope.isCollapsed = true;
      $scope.loggedIn = Member.isAuthenticated();

      $scope.$on('$routeChangeSuccess', function() {
        $scope.isCollapsed = true;
        $scope.loggedIn = Member.isAuthenticated();
        if (($location.path() === '/login' || $location.path() === '/signup') && $scope.loggedIn) {
          $location.path('/');
        }
        if (($location.path() !== '/login' || $location.path() !== '/signup') && !$scope.loggedIn) {
          $location.path('/login');
        }
      });

      $scope.logout = function() {
        Member.logout(function() {
          $location.path('/login');
          $scope.loggedIn = false;
        });
      }

      $scope.getClass = function(path) {
        if (path === '/') {
          if ($location.path() === '/') {
            return 'active';
          } else {
            return '';
          }
        }

        if ($location.path().substr(0, path.length) === path) {
          return 'active';
        } else {
          return '';
        }
      };

      $scope.goToMain = function() { $location.path('/'); }
      $scope.goToGroups = function() { $location.path('/groups'); }
      $scope.goToLogin = function() { $location.path('/login'); }
    }
  ]);
})(window.sg = window.sg || {});