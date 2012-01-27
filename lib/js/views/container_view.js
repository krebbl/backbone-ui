(function() {

	UI.ContainerView = UI.ListView.extend({
		tagName : 'div',
		// create a DOM Element for the list item
		createListElement : function(item) {
			return this.$el;
		}
	});

})();
