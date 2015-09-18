(function(sg) {
  sg.app.controller('GroupController', [ '$scope', '$location', '$routeParams', 'flash', 'Group', 'GroupService',
    function($scope, $location, $routeParams, flash, Group, GroupService) {
      Group.findById({id: $routeParams.groupId},
        function(group) { 
          $scope.group = group;
          GroupService.getGroupMembers($scope.group.id, function(groupMembers) {
            $scope.group.groupMembers = groupMembers;
          });
          GroupService.getGroupLeaders($scope.group.id, function(groupLeaders) {
            $scope.group.groupLeaders = groupLeaders;
          });
          GroupService.getGroupTypes($scope.group.id, function(groupTypes) {
            $scope.group.groupTypes = groupTypes;
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


  sg.app.controller('NewGroupController', [ '$scope', '$location', 'flash', 'GroupService', 'MemberService', 'TypeService',
    function($scope, $location, flash, GroupService, MemberService, TypeService) {

      $scope.findTypes = function(query) {
        return TypeService.findTypes(query);
      };

      $scope.findMembers = function(query) {
        return MemberService.findMembers(query);
      };

      $scope.create = function() {
        GroupService.createGroup($scope.group, $scope.groupMembers, $scope.groupLeaders, $scope.groupTypes,
          function(err) {
            if (err) {
              flash.error = err;
            } else {
              $location.path('/groups');
              flash.success = $scope.group.name + ' saved';
            }
          }
        );
      };

      $scope.back = function() { $location.path('/groups'); };
    }
  ]);


  sg.app.controller('GroupsController', [ '$scope', '$resource', '$location', 'Group',
    function($scope, $resource, $location, Group) {
      Group.find({},
        function(list) {
          $scope.groups = list;
          $scope.groups.forEach(function(group) {
            Group.groupMembers.count({id: group.id}, function(httpResponse) {
              group.currentSize = httpResponse.count;
            });
          });
        },
        function(httpResponse) { $scope.groups = null; }
      );

      $scope.showGroup = function(groupId) { $location.path('/groups/' + groupId); };
      $scope.newGroup = function() { $location.path('/groups/new') };
    }
  ]);


  sg.app.controller('LoginController', [ '$scope', '$location', 'flash', 'Member',
    function($scope, $location, flash, Member) {
      $scope.login = function(loginCreds) {
        Member.login({ rememberMe: $scope.rememberMe }, $scope.loginCreds, function() {
          flash.clean();
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


  sg.app.controller('NavbarController', [ '$scope', '$location', '$route', 'Member', 'flash',
    function($scope, $location, $route, Member, flash) {
      $scope.isCollapsed = true;
      $scope.loggedIn = Member.isAuthenticated();

      $scope.$on('$routeChangeSuccess', function() {
        $scope.isCollapsed = true;
        $scope.loggedIn = Member.isAuthenticated();
        if (($location.path() === '/login' || $location.path() === '/signup') && $scope.loggedIn) {
          $location.path('/');
        }
        if (($location.path() !== '/login' && $location.path() !== '/signup') && !$scope.loggedIn) {
          $location.path('/login');
        }
      });

      $scope.logout = function() {
        Member.logout(function() {
          $location.path('/login');
          $scope.loggedIn = false;
          flash.clean();
          flash.success = 'Logged out successfully.';
        });
      };

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

      $scope.goToMain = function() { $location.path('/'); };
      $scope.goToGroups = function() { $location.path('/groups'); };
      $scope.goToLogin = function() { $location.path('/login'); };
      $scope.goToSignUp = function() { $location.path('/signup'); };
      $scope.goToMyAccount = function() { $location.path('/myaccount'); };
    }
  ]);

  sg.app.controller('SignUpController', ['$scope', '$location', 'flash', 'Member',
    function($scope, $location, flash, Member) {
      $scope.signup = function(newMember) {
        if ($scope.newMember.password === $scope.newMember.passwordConfirmation) {
          Member.create(getMember($scope.newMember),
            function() {
              Member.login({ email: $scope.newMember.email, password: $scope.newMember.password },
                function() {
                  flash.clean();
                  $location.path('/');
                }, function(httpResponse) {
                  flash.error = httpResponse.data.error.message;
                });
            }, function(httpResponse) {
              flash.error = httpResponse.data.error.message;
            });
        } else {
          flash.error = 'Password and Password Confirmation do not match.';
        }
      }

      var getMember = function(member) {
        return {
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          password: member.password
        };
      }
    }
  ]);

  sg.app.controller('MyAccountController', ['$scope', '$location', 'flash', 'Member', 'State',
    function($scope, $location, flash, Member, State) {
      Member.getCurrent(
        function(value, responseHeaders) {
          $scope.member = value;
        },
        function(httpResponse) {
          flash.error = httpResponse.data.error.message;
        });

      $scope.saveMember = function() {
        if ($scope.member.password === '' || $scope.member.password === $scope.passwordConfirmation) {
          $scope.member.$save().then(function() {
            flash.clean();
            flash.success = 'Member saved.';
            $scope.passwordConfirmation = '';
          }, function(err) {
            flash.clean();
            flash.error = err;
          });
        } else {
          flash.error = 'Password and Password Confirmation must match.';
        }
      };

      $scope.states = State.find();
    }
  ]);
})(window.sg = window.sg || {});