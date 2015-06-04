(function(){
Template.__checkName("login");
Template["login"] = new Template("Template.login", (function() {
  var view = this;
  return [ Blaze._TemplateWith(function() {
    return "headerButtonRight";
  }, function() {
    return Spacebars.include(view.lookupTemplate("contentFor"), function() {
      return "\n	";
    });
  }), "\n\n	", Blaze._TemplateWith(function() {
    return "headerButtonLeft";
  }, function() {
    return Spacebars.include(view.lookupTemplate("contentFor"), function() {
      return "\n	";
    });
  }), "\n\n	", Blaze._TemplateWith(function() {
    return "headerTitle";
  }, function() {
    return Spacebars.include(view.lookupTemplate("contentFor"), function() {
      return [ "\n		", HTML.H2({
        "class": "title"
      }, "Meteoric Daisy"), "\n	" ];
    });
  }), "\n\n	", Spacebars.include(view.lookupTemplate("ionView"), function() {
    return [ "\n		", Spacebars.include(view.lookupTemplate("ionContent"), function() {
      return [ "\n			", Spacebars.include(view.lookupTemplate("atForm")), "\n		" ];
    }), "\n	" ];
  }) ];
}));

})();
