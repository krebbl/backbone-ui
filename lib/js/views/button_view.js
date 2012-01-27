(function() {

	UI.ButtonView = UI.View.extend({
		tagName: 'button',
		defaultOptions : {
			fitLayout : false,
			label: null,
			selectable: true,
			enabled: true
		},
		renderContent: function(){
			this.renderEnabled(this.options.enabled);
		},
		renderIconClass: function(iconClass){
			if(this.renderedIconView){
				this.renderedIconView.remove();
			}
			this.renderedIconView = new UI.View({
				className: 'icon ' + iconClass,
				tagName: 'span'
			});
			
			this.renderChildView(this.renderedIconView);
		},
		renderEnabled: function(enable){
			if(enable === true){
				this.$el.removeAttr('disabled');
			}else if(enable === false){
				this.$el.attr('disabled','disabled');
			}
		}
	});

})();
