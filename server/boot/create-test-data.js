var async = require('async');
module.exports = function(app) {
	var mainDs = app.dataSources.mainDs

	//create all models
	async.parallel({
		groups: async.apply(createGroups),
		members: async.apply(createMembers)
	}, function(err, results){
		if (err) throw err;
		addMembersToGroups(results.groups, results.members, function(err) {
			if (err) throw err;
			createPrayerRequests(results.members, function(err) {
				if (err) throw err;
				console.log('> models created successfully');
			});
		});
	});

	//create groups
	function createGroups(cb) {
		mainDs.automigrate('Group', function(err) {
			if (err) return cb(err);
			var Group = app.models.Group;
			Group.create([
				{name: "Chambers' Group", type: 'couples', maxSize: 16},
				{name: "Single's Group", type: 'singles', maxSize: 8},
				{name: "Other Group", type: 'any', maxSize: 12}
			], cb);
		});
	}

	//create members
	function createMembers(cb) {
		mainDs.automigrate('Member', function(err) {
			if (err) return cb(err);
			var Member = app.models.Member;
			Member.create([
				{firstName: 'Jim', lastName: 'Chambers', email: 'mrhistory@gmail.com', password: 'pw123'},
				{firstName: 'Arden', lastName: 'Chambers', email: 'not@myemail.com', password: 'pw456'},
				{firstName: 'Test', lastName: 'User', email: 'test@email.com', password: 'bogus12'},
				{firstName: 'Fake', lastName: 'User', email: 'fake@email.com', password: 'bogus34'}
			], cb);
		});
	}

	//add members to groups
	function addMembersToGroups(groups, members, cb) {
		mainDs.automigrate('GroupMember', function(err) {
			if (err) cb(err);
			groups[0].members.add(members[0], function(err) {
				if (err) cb(err);
				groups[0].members.add(members[1], function(err) {
					if (err) cb(err);
					groups[1].members.add(members[2], function(err) {
						if (err) cb(err);
						groups[2].members.add(members[3], function(err) {
							if (err) cb(err);
							groups[2].members.add(members[0], function(err) {
								if (err) cb(err);
								cb();
							});
						});
					});
				});
			});
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