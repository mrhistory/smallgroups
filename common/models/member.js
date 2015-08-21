module.exports = function(Member) {
  Member.observe('loaded', function(ctx, next) {
    if (ctx.instance) {
      ctx.instance.fullName = ctx.instance.firstName + ' ' + ctx.instance.lastName;
    } else {
      ctx.data.fullName = ctx.data.firstName + ' ' + ctx.data.lastName;
    }
    next();
  });
};
