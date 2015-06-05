(function(){
Template.__checkName("contact_modal");
Template["contact_modal"] = new Template("Template.contact_modal", (function() {
  var view = this;
  return Blaze._TemplateWith(function() {
    return {
      title: Spacebars.call("Contact Staff")
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("ionModal"), function() {
      return [ "\n		", HTML.DIV({
        "class": "card"
      }, "\n			", HTML.DIV({
        "class": "item item-text-wrap"
      }, "\n				Name: ", Blaze.View("lookup:name", function() {
        return Spacebars.mustache(view.lookup("name"));
      }), " ", HTML.BR(), "\n				Email: TODO; needs subscription edit. ", HTML.BR(), "\n			"), "\n		"), "\n		", HTML.DIV({
        "class": "list"
      }, "\n			", HTML.LABEL({
        "class": "item item-input item-stacked-label"
      }, "\n				", HTML.SPAN({
        "class": "input-label"
      }, "Message:"), "\n				", HTML.TEXTAREA({
        placeholder: "Type your message here."
      }), "\n			"), "\n		"), "\n\n		", HTML.BUTTON({
        "class": "button button-full button-positive send_email"
      }, "\n			Send Email\n		"), "\n	" ];
    });
  });
}));

})();
