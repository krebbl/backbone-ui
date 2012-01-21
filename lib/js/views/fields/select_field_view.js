(function() {

	UI.SelectFieldView = UI.CheckboxFieldView.extend({
		optionSelector : 'option',
		selectionAttribute : 'selected',
		defaultOptions : {
			inputTemplate : 'fields/select_input',
			multiSelect : false,
			valueKey: 'value',
			labelKey: 'label'
		},
		renderInputElement : function() {
			this.$select = this.$el.find('select').first();
			this.$select.attr({
				'id' : this.options.fieldId,
				'name' : this.options.name
			});
			if(this.options.multiSelect === true) {
				this.$select.attr('multiple', 'multiple');
			}
			this.renderItems(this.options.items);
		},
		renderItem: function(item){
			this.$select.append("<option value='" + item[this.options.valueKey] + "'>" + UI.loc(item[this.options.labelKey]) + "</option>");
		},
		bindInputEvents : function() {
			var self = this;
			this.$select.bind('change', function() {
				self.onInputValueChange();
			});
		},
		getInputElement : function() {
			return this.$select;
		},
		getOptionElements : function(){
			return this.$select.find('option');
		}
	});

})();
