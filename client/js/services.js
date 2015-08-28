(function(sg) {
  sg.app.service('GroupService', ['Group', 'Member', 'Type', 'GroupLeadership', 'GroupMembership', 'GroupType',
    function(Group, Member, Type, GroupLeadership, GroupMembership, GroupType) {
      this.getGroupMembers = function(groupId, cb) {
        Group.groupMemberships({id: groupId}, function(list) {
          var groupMemberships = list;
          groupMemberships.forEach(function(groupMembership) {
            Member.findById({id: groupMembership.memberId}, function(member) {
              groupMembership.member = member;
            });
          });
          cb(groupMemberships);
        });
      };

      this.getGroupLeaders = function(groupId, cb) {
        Group.groupLeaderships({id: groupId}, function(list) {
          var groupLeaderships = list;
          groupLeaderships.forEach(function(groupLeadership) {
            Member.findById({id: groupLeadership.memberId}, function(member) {
              groupLeadership.member = member;
            });
          });
          cb(groupLeaderships);
        })
      };

      this.getGroupTypes = function(groupId, cb) {
        Group.groupTypes({id: groupId}, function(list) {
          var groupTypes = list;
          groupTypes.forEach(function(groupType) {
            Type.findById({id: groupType.typeId}, function(type) {
              groupType.type = type;
            });
          });
          cb(groupTypes);
        });
      };

      this.createGroup = function(group, groupMembers = [], groupLeaders = [], groupTypes = [], cb) {
        Group.create(group, function(group) {
          groupLeaders.forEach(function(groupLeader) {
            GroupLeadership.create({ groupId: group.id, memberId: groupLeader.id }, function(){},
              function(httpResponse) {
                cb(httpResponse.data.error.message);
              });
          });
          groupMembers.forEach(function(groupMember) {
            GroupMembership.create({ groupId: group.id, memberId: groupMember.id }, function() {},
              function(httpResponse) {
                cb(httpResponse.data.error.message);
              });
          });
          groupTypes.forEach(function(groupType) {
            if (groupType.id == null || groupType.id == '' || groupType.id == undefined) {
              Type.create({ name: groupType.name }, function(type) {
                GroupType.create({ groupId: group.id, typeId: type.id }, function() {},
                  function(httpResponse) {
                    cb(httpResponse.data.error.message);
                  });
              }, function(httpResponse) {
                cb(httpResponse.data.error.message);
              });
            }
          });
          cb();
        }, function(httpResponse) {
          cb(httpResponse.data.error.message);
        });
      };
    }
  ]);

  sg.app.service('MemberService', ['Member',
    function(Member) {
      this.findMembers = function(query) {
        return Member.find({
          filter: {
            where: {
              or: [
                { email: { like: '%' + query + '%' } },
                { firstName: { like: '%' + query + '%' } },
                { lastName: { like: '%' + query + '%' } }
              ]
            }
          }
        }).$promise;
      };
    }
  ]);

  sg.app.service('TypeService', ['Type',
    function(Type) {
      this.findTypes = function(query) {
        return Type.find({
          filter: {
            where: {
              name: {
                like: '%' + query + '%'
              }
            }
          }
        }).$promise;
      }
    }
  ]);
})(window.sg = window.sg || {});