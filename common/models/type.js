module.exports = function(Type) {
  Type.validatesUniquenessOf('name', {message: 'name is not unique'});
};
