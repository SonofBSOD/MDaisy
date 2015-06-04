(function(){
Template.__checkName("appointmentList");
Template["appointmentList"] = new Template("Template.appointmentList", (function() {
  var view = this;
  return [ Blaze._TemplateWith(function() {
    return "headerButtonRight";
  }, function() {
    return Spacebars.include(view.lookupTemplate("contentFor"), function() {
      return [ "\n		", Spacebars.include(view.lookupTemplate("atNavButton")), "\n	" ];
    });
  }), "\n\n	", Blaze._TemplateWith(function() {
    return "headerTitle";
  }, function() {
    return Spacebars.include(view.lookupTemplate("contentFor"), function() {
      return [ "\n		", HTML.H2({
        "class": "title"
      }, "My Appointments"), "\n	" ];
    });
  }), "\n\n	", Spacebars.include(view.lookupTemplate("ionContent"), function() {
    return [ "\n		", Blaze._TemplateWith(function() {
      return {
        "class": Spacebars.call("app-list")
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("ionList"), function() {
        return [ "\n			", Blaze.Each(function() {
          return Spacebars.call(view.lookup("app_list"));
        }, function() {
          return [ "\n				", Blaze._TemplateWith(function() {
            return {
              path: Spacebars.call("detail"),
              data: Spacebars.call(view.lookup("get_appointment_id")),
              iconRight: Spacebars.call(true)
            };
          }, function() {
            return Spacebars.include(view.lookupTemplate("ionItem"), function() {
              return [ "\n					", HTML.H2(Blaze.View("lookup:proc_type", function() {
                return Spacebars.mustache(view.lookup("proc_type"));
              })), "\n					", HTML.P(Blaze.View("lookup:date", function() {
                return Spacebars.mustache(view.lookup("date"));
              })), "\n					", Blaze._TemplateWith(function() {
                return {
                  icon: Spacebars.call("ios-arrow-right")
                };
              }, function() {
                return Spacebars.include(view.lookupTemplate("ionIcon"));
              }), "\n				" ];
            });
          }), "\n			" ];
        }), "\n		" ];
      });
    }), "\n	" ];
  }) ];
}));

})();
