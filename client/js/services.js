(function(sg) {
  sg.app.service('GroupService', ['Group', 'Member',
    function(Group, Member) {
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
    }
  ]);
})(window.sg = window.sg || {});