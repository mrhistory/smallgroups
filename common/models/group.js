module.exports = function(Group) {
  Group.getGroupTypes = function(cb) {
    cb(null, ['any', 'couples', 'mens', 'womens']);
  };

  Group.remoteMethod(
    'getGroupTypes',
    {
      description: 'Returns a list of existing group types.',
      http: { path: '/types', verb: 'get' },
      returns: { arg: 'types', type: 'array' }
    }
  );
};
