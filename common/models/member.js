module.exports = function(Member) {
  Member.observe('loaded', function(ctx, next) {
    if (ctx.instance) {
      ctx.instance.fullNameAndEmail = ctx.instance.firstName + ' ' + ctx.instance.lastName + ' : ' + ctx.instance.email;
    } else {
      ctx.data.fullNameAndEmail = ctx.data.firstName + ' ' + ctx.data.lastName + ' : ' + ctx.data.email;
    }
    next();
  });
};
