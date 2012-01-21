(function() {

	UI.ButtonView = UI.View.extend({
		tagName: 'button',
		defaultOptions : {
			fitLayout : false,
			template: 'button',
			label: "",
			selectable: true,
			labelSelector: 'span.label'
		},
		renderContent: function(){
			if(this.hasIcon()){
				this.$el.addClass('has-icon');
			}else{
				this.$el.removeClass('has-icon');			
			}
		},
		renderLabel: function(label){
			this.$el.find(this.options.labelSelector).first().html(label);
		},
		getLabel: function(){
			return this.options.label;
		},
		hasLabel: function(){
			return this.hasOption('label');
		},
		hasIcon: function(){
			return this.hasOption('iconClass');
		},
		getIconClass: function(){
			return this.options.iconClass;
		},
		renderIconClass: function(iconClass){
			this.render();
		},
		renderEnable: function(enable){
			if(enable === true){
				this.$el.removeAttr('disabled');
			}else if(enable === false){
				this.$el.attr('disabled','disabled');
			}
		}
	});

})();
