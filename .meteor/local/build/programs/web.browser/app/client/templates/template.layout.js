(function(){
Template.__checkName("layout");
Template["layout"] = new Template("Template.layout", (function() {
  var view = this;
  return Spacebars.include(view.lookupTemplate("ionBody"), function() {
    return [ "\n\n	", Spacebars.include(view.lookupTemplate("ionNavBar")), "\n\n	", Spacebars.include(view.lookupTemplate("ionNavView"), function() {
      return [ "\n		", Spacebars.include(view.lookupTemplate("yield")), "\n	" ];
    }), "\n\n" ];
  });
}));

})();
