(function(){
window.JST = window.JST || {};

window.JST['button'] = _.template('<div>\n	<% if (view.hasIcon()) { %>\n		<span class="icon <%= view.getIconClass() %>"></span>\n	<% } %>\n	<% if (view.hasLabel()) { %>\n		<span class="label"><%= view.getLabel() %></span>\n	<% } %>\n</div>');
window.JST['dialog'] = _.template('<div class="dialog-header">\n	<h3></h3>\n	<a href="javascript: void(0);" class="close"></a>\n</div>\n<div class="dialog-content"></div>\n<div class="dialog-footer"></div>\n');
window.JST['field'] = _.template('<label></label>\n<div class="input"></div>\n<div class="error"></div>');
window.JST['fields/checkbox_input'] = _.template('<label><input type="checkbox" value=<%= value %> ><span><%= UI.loc(label) %></span></label>');
window.JST['fields/date_input'] = _.template('<select class="day"></select>\n<select class="month"></select>\n<input class="year" type="number" maxlength="4">\n');
window.JST['fields/radiobox_input'] = _.template('<label><input type="radio" value=<%= value %> ><span><%= UI.loc(label) %></span></label>');
window.JST['fields/select_input'] = _.template('<select></select>');
window.JST['fields/text_input'] = _.template('<input type=<%= view.getType() %>>');
window.JST['fields/textarea_input'] = _.template('<textarea rows=<%= view.getRows() %>></textarea>');
window.JST['link'] = _.template('<% if (view.hasIcon()) { %> \n	<span class="icon <%= view.getIconClass() %>"></span>\n<% } %>\n<% if (view.hasLabel()) { %> \n	<span class="label"><%= view.getLabel() %></span>\n<% } %>');
window.JST['loading_mask'] = _.template('<div class="loading-indicator"></div>\n<div class="loading-label"><%= text %></div>');
window.JST['message_box'] = _.template('<p></p>');
})();