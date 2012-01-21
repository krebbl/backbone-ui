(function() {

	UI.TextFieldView = UI.FieldView.extend({
		defaultOptions: {
			inputTemplate : 'fields/text_input',
			type: 'text',
			placeholder: ''
		},
		getValueForModel: function(){
			if(this.$input.attr('disabled')) return null; 
			return this.$input.val();
		},
		renderInputElement: function(){
			this.$input = this.$el.find('input').first();
			this.$input.attr({
				'id' : this.options.fieldId,
				'name' : this.options.name,
				'placeholder' : this.options.placeholder
			});
		},
		bindInputEvents: function(){
			var self = this;
			this.$input.bind('change',function(){
				self.onInputValueChange();
			});
		},
		renderInputValue: function(value){
			this.$el.find('input').first().val(value);
		},
		getType: function(){
			return this.options.type;
		},
		getInputElement: function(){
			return this.$input;
		}
	});

})();
