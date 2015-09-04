(function(sg) {
  sg.app.service('GroupService', ['Group', 'Member', 'Type', 'GroupLeader', 'GroupMember', 'GroupType',
    function(Group, Member, Type, GroupLeadership, GroupMembership, GroupType) {
      this.getGroupMembers = function(groupId, cb) {
        Group.groupMembers({id: groupId}, function(list) {
          var groupMembers = list;
          groupMembers.forEach(function(groupMember) {
            Member.findById({id: groupMember.memberId}, function(member) {
              groupMember.member = member;
            });
          });
          cb(groupMembers);
        });
      };

      this.getGroupLeaders = function(groupId, cb) {
        Group.groupLeaders({id: groupId}, function(list) {
          var groupLeaders = list;
          groupLeaders.forEach(function(groupLeader) {
            Member.findById({id: groupLeader.memberId}, function(member) {
              groupLeader.member = member;
            });
          });
          cb(groupLeaders);
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
            GroupLeader.create({ groupId: group.id, memberId: groupLeader.id }, function(){},
              function(httpResponse) {
                cb(httpResponse.data.error.message);
              });
          });
          groupMembers.forEach(function(groupMember) {
            GroupMember.create({ groupId: group.id, memberId: groupMember.id }, function() {},
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