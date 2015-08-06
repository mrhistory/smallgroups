var async = require('async');
module.exports = function(app) {
	var mainDs = app.dataSources.mainDs

	//create all models
	async.parallel({
		groups: async.apply(createGroups),
		members: async.apply(createMembers)
	}, function(err, results){
		if (err) throw err;
    addMembersToGroups(results.groups, results.members, function(err) { if (err) throw err; });
    addLeadersToGroups(results.groups, results.members, function(err) { if (err) throw err; });
    console.log('> models created successfully');
	});

	//create groups
	function createGroups(cb) {
		mainDs.automigrate('Group', function(err) {
			if (err) return cb(err);
			var Group = app.models.Group;
			Group.create([
				{name: "Commander's Group", type: 'any', description: "Small group for commanders in Starfleet.", maxSize: 5},
				{name: "The Original Series Group", type: 'any', description: "Small group for Star Trek: The Original Series.", maxSize: 3},
				{name: "Next Generation Group", type: 'any', description: "Small group for Star Trek: Next Generation.", maxSize: 3}
			], cb);
		});
	}

	//create members
	function createMembers(cb) {
		mainDs.automigrate('Member', function(err) {
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

	//add members to groups
	function addMembersToGroups(groups, members, cb) {
		mainDs.automigrate('GroupMembership', function(err) {
      if (err) return cb(err);
      var GroupMembership = app.models.GroupMembership;
      GroupMembership.create([
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
    mainDs.automigrate('GroupLeadership', function(err) {
      if (err) return cb(err);
      var GroupLeadership = app.models.GroupLeadership;
      GroupLeadership.create([
        {group: groups[0], member: members[1]},
        {group: groups[0], member: members[2]},
        {group: groups[2], member: members[1]},
        {group: groups[1], member: members[3]}
      ], cb);
    });
  }

	function createPrayerRequests(members, cb) {
		mainDs.automigrate('PrayerRequest', function(err) {
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