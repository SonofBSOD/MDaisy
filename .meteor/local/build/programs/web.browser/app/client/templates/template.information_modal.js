(function(){
Template.__checkName("information_modal");
Template["information_modal"] = new Template("Template.information_modal", (function() {
  var view = this;
  return Blaze._TemplateWith(function() {
    return {
      title: Spacebars.call("Medical Information")
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("ionModal"), function() {
      return [ "\n		", HTML.H1(Blaze.View("lookup:info", function() {
        return Spacebars.mustache(view.lookup("info"));
      })), "\n	" ];
    });
  });
}));

})();
