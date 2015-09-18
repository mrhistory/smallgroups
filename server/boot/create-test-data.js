var async = require('async');
module.exports = function(app) {
	var db = app.dataSources.mainDs

  db.autoupdate('Member', function(err) {
    if (err) throw err;
    app.models.Member.count(function(err, count) {
      if (err) throw err;
      if (count <= 0) {
        createModels( function() {
          console.log('> models created successfully');
        });
      }
    });
  });

	//create all models
  function createModels(cb) {
      async.parallel({
        groups: async.apply(createGroups),
        members: async.apply(createMembers)
      }, function(err, results){
        if (err) throw err;
        addMembersToGroups(results.groups, results.members, function(err) { if (err) throw err; });
        addLeadersToGroups(results.groups, results.members, function(err) { if (err) throw err; });
        createTypes(function(err, types) {
          if (err) throw err;
          addTypesToGroups(function(err) {
            if (err) throw err;
            cb();
          });
        });
      });
  }

	//create groups
	function createGroups(cb) {
		db.automigrate('Group', function(err) {
			if (err) return cb(err);
			var Group = app.models.Group;
			Group.create([
				{name: "Commander's Group", description: "Small group for commanders in Starfleet.", maxSize: 5},
				{name: "The Original Series Group", description: "Small group for Star Trek: The Original Series.", maxSize: 3},
				{name: "Next Generation Group", description: "Small group for Star Trek: Next Generation.", maxSize: 3}
			], cb);
		});
	}

	//create members
	function createMembers(cb) {
		db.automigrate('Member', function(err) {
			if (err) return cb(err);
			var Member = app.models.Member;
			Member.create([
				{firstName: "admin", lastName: "admin", email: "admin@starfleet.gov", password: "admin"},
        {firstName: "Jim", lastName: "Kirk", email: "jkirk@starfleet.gov", password: "kirk"},
        {firstName: "Jean-Luc", lastName: "Picard", email: "jpicard@starfleet.gov", password: "picard"},
        {firstName: "Will", lastName: "Riker", email: "wriker@starfleet.gov", password: "riker"},
        {firstName: "Wesley", lastName: "Crusher", email: "wcrusher@starfleet.gov", password: "crusher"},
        {firstName: "Leonard", lastName: "McCoy", email: "lmccoy@starfleet.gov", password: "mccoy"}
			], cb);
		});
	}

  function createTypes(cb) {
    db.automigrate('Type', function(err) {
      if (err) return cb(err);
      var Type = app.models.Type;
      Type.create([
        {name: 'any'},
        {name: 'men'},
        {name: 'women'},
        {name: 'community'},
        {name: 'discipleship'}
      ], cb);
    });
  }

	//add members to groups
	function addMembersToGroups(groups, members, cb) {
		db.automigrate('GroupMember', function(err) {
      if (err) return cb(err);
      var GroupMember = app.models.GroupMember;
      GroupMember.create([
        {group: groups[0], member: members[0]},
        {group: groups[0], member: members[1]},
        {group: groups[0], member: members[2]},
        {group: groups[0], member: members[3]},
        {group: groups[1], member: members[1]},
        {group: groups[1], member: members[5]},
        {group: groups[2], member: members[2]},
        {group: groups[2], member: members[3]},
        {group: groups[2], member: members[4]}
      ], cb);
		});
	}

  function addLeadersToGroups(groups, members, cb) {
    db.automigrate('GroupLeader', function(err) {
      if (err) return cb(err);
      var GroupLeader = app.models.GroupLeader;
      GroupLeader.create([
        {group: groups[0], member: members[1]},
        {group: groups[0], member: members[2]},
        {group: groups[2], member: members[1]},
        {group: groups[1], member: members[3]}
      ], cb);
    });
  }

  function addTypesToGroups(cb) {
    db.automigrate('GroupType', function(err) {
      if (err) return cb(err);
      var Group = app.models.Group;
      var GroupType = app.models.GroupType;
      var Type = app.models.Type;
      Group.find({}, function(err, groups) {
        groups.forEach(function(group) {
          Type.find({where: {name: 'men'}, limit: 1}, function(err, type) {
            if (err) return cb(err);
            GroupType.create([{group: group, type: type[0]}]);
          });
        });
        cb();
      });
    });
  }

	function createPrayerRequests(members, cb) {
		db.automigrate('PrayerRequest', function(err) {
			if (err) cb(err);
			var PrayerRequest = app.models.PrayerRequest;
			PrayerRequest.create([
				{request: 'Test prayer request number one.', member: members[0]},
				{request: 'Test prayer request number two.', member: members[2]},
				{request: 'Test prayer request number three.', member: members[1]}
			], cb);
		});
	}
};