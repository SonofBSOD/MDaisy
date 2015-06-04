(function(){
Template.__checkName("appointmentDetail");
Template["appointmentDetail"] = new Template("Template.appointmentDetail", (function() {
  var view = this;
  return [ Blaze._TemplateWith(function() {
    return "headerButtonLeft";
  }, function() {
    return Spacebars.include(view.lookupTemplate("contentFor"), function() {
      return [ "\n		", Blaze._TemplateWith(function() {
        return {
          path: Spacebars.call("list")
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("ionItem"), function() {
          return [ "\n		", Blaze._TemplateWith(function() {
            return {
              icon: Spacebars.call("ios-arrow-left")
            };
          }, function() {
            return Spacebars.include(view.lookupTemplate("ionIcon"));
          }), "\n		" ];
        });
      }), "\n	" ];
    });
  }), "\n\n	", Blaze._TemplateWith(function() {
    return "headerButtonRight";
  }, function() {
    return Spacebars.include(view.lookupTemplate("contentFor"), function() {
      return [ "\n		", Spacebars.include(view.lookupTemplate("atNavButton")), "\n	" ];
    });
  }), "\n\n	", Blaze._TemplateWith(function() {
    return "headerTitle";
  }, function() {
    return Spacebars.include(view.lookupTemplate("contentFor"), function() {
      return [ "\n		", HTML.H5({
        "class": "title",
        style: "font-size:1em"
      }, Blaze.View("lookup:title", function() {
        return Spacebars.mustache(view.lookup("title"));
      })), "\n	" ];
    });
  }), "\n\n	", Spacebars.include(view.lookupTemplate("ionContent"), function() {
    return [ "\n		", Blaze.If(function() {
      return Spacebars.call(view.lookup("has_obligations"));
    }, function() {
      return [ "\n		", Blaze.Each(function() {
        return Spacebars.call(view.lookup("obligations_exp"));
      }, function() {
        return [ "\n			", HTML.DIV({
          "class": "card"
        }, "\n				", HTML.DIV({
          "class": "item item-divider"
        }, "\n					", HTML.H1({
          "class": "obligation_title"
        }, Blaze.View("lookup:date_header", function() {
          return Spacebars.mustache(view.lookup("date_header"));
        })), "\n				"), "\n				", HTML.DIV({
          "class": "item item-text-wrap"
        }, "\n					", HTML.UL("\n						", Blaze.Each(function() {
          return Spacebars.call(view.lookup("date_obligations"));
        }, function() {
          return [ "\n							", HTML.LI({
            "class": "item item-checkbox"
          }, "\n								", HTML.LABEL({
            "class": "checkbox"
          }, "\n									", HTML.INPUT(HTML.Attrs({
            type: "checkbox",
            "class": "test_class",
            obligation_id: function() {
              return Spacebars.mustache(view.lookup("obligation_id"));
            }
          }, function() {
            return Spacebars.attrMustache(view.lookup("obligation_checked"));
          })), "\n								"), "\n								", Blaze.View("lookup:text", function() {
            return Spacebars.mustache(view.lookup("text"));
          }), "\n							"), "\n						" ];
        }), "\n					"), "\n				"), "\n			"), "\n		" ];
      }), "\n		" ];
    }, function() {
      return [ "\n			", HTML.DIV({
        "class": "card"
      }, "\n				", HTML.DIV({
        "class": "item item-text-wrap"
      }, "\n					This appointment has no preparation requirements.\n				"), "\n			"), "\n		" ];
    }), "\n			\n\n		", HTML.DIV({
      "class": "button-bar"
    }, "\n			", HTML.A({
      "class": "button update_preparation"
    }, "Update"), "\n			", HTML.A({
      "class": "button medical_information",
      "data-ion-modal": "information_modal"
    }, "Information"), "\n			", HTML.A({
      "class": "button"
    }, "Staff"), "\n		"), "\n\n	" ];
  }) ];
}));

})();
