(function() {
	UI.ModelErrorsView = UI.View.extend({
		defaultOptions : {
			template : 'message_box',
			messageSelector : 'p',
			errorFormatter : function(model, error) {
				if(_.isArray(error) || _.isObject(error)) {
					return _.size(error) + " errors";
				} else if(_.isString(error)) {
					return error;
				}
				return "";
			}
		},
		bindModelEvents : function() {
			if(this.model) {
				this.model.bind('error', this.onModelError, this);
			}
		},
		afterRender: function(){
			this.setVisible(false);
			this.setError(this.model.error);
		},
		onModelError : function(model, error) {
			if(error && (_.isString(error) || _.size(error) > 0)) {
				this.setError(error);
				this.setVisible(true);
			} else {
				this.setVisible(false);
			}
		},
		setError : function(error) {
			this.options.error = error;
			if(!this.isRendered()) return;
			this.$el.find('p').html(this.options.errorFormatter(this.model, error));
		}
	});
})();
