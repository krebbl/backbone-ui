(function() {
	UI.FieldsetView = UI.View.extend({
		tagName : 'fieldset',
		renderContent : function() {
			if(this.options.legend) {
				this.$el.append($(document.createElement('legend')).html(this.options.legend));
			}
			this.renderChildView(this.options.contentView);
		}
	});
})();
