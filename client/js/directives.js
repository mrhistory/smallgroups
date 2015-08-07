(function(sg) {
  sg.app.directive('navbar', function() {
    var directive = {};
    directive.restrict = 'AE';
    directive.templateUrl = 'views/partials/navbar.html';
    return directive;
  });
})(window.sg = window.sg || {});