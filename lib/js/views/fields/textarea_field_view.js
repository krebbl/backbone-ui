(function() {

	UI.TextareaFieldView = UI.FieldView.extend({
		defaultOptions: {
			inputTemplate : 'fields/textarea_input',
			rows: 3
		},
		getValueForModel: function(){
			if(this.$textarea.attr('disabled')) return null; 
			return this.$textarea.html();
		},
		renderInputElement: function(){
			this.$textarea = this.$el.find('textarea').first();
			this.$textarea.attr({
				'id' : this.options.fieldId,
				'name' : this.options.name
			});
		},
		bindInputEvents: function(){
			var self = this;
			this.$textarea.bind('change',function(){
				self.onInputValueChange();
			});
		},
		renderInputValue: function(value){
			this.$textarea.html(value);
		},
		getType: function(){
			return this.options.type;
		},
		getInputElement: function(){
			return this.$textarea;
		},
		getRows: function(){
			return this.options.rows;
		}
	});

})();
