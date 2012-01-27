(function() {
	// TODO: add UI.OptionView width value attribute
	UI.CheckboxFieldView = UI.FieldView.extend({
		optionSelector : 'input:checkbox',
		selectionAttribute : 'checked',
		defaultOptions : {
			multiSelect : true,
			optionTemplate : 'fields/checkbox_input',
			valueKey : "value",
			labelKey : 'label'
		},
		getValueForModel : function() {
			var v = {};
			var val;
			var $input = this.getOptionElements();
			var size = $input.size();
			var self = this;
			val = [];
			$input.each(function(index) {
				if($(this).attr(self.selectionAttribute)) {
					var v = self.options.items[index][self.options.valueKey];
					if(self.options.multiSelect) {
						val.push(v);
					} else {
						val = v;
					}
				} else if(size == 1) {
					val = (v == self.options.items[index][self.options.valueKey]);
				}
			});
			return val;
		},
		renderInputElement : function() {
			this.renderItems(this.options.items);
		},
		bindInputEvents : function() {
			var self = this;
			this.getInputElement().bind('change', function() {
				self.onInputValueChange();
			});
		},
		renderInputValue : function(value) {
			var self = this;
			// find the checkbox elements and set the checked attribute
			this.getOptionElements().each(function(index) {
				var $cb = $(this);
				var select = false;
				var val = self.options.items[index][self.options.valueKey];
				if(self.options.multiSelect === true && _.isArray(value)) {
					select = _.contains(value, val)
				} else {
					select = (val == value);
				}
				if(select === true) {
					$cb.attr(self.selectionAttribute, self.selectionAttribute);
				} else if($cb.attr(self.selectionAttribute)) {
					$cb.removeAttr(self.selectionAttribute);
				}
			});
		},
		renderItems : function(items) {
			if(this.isRendered()) {
				this.getOptionElements().remove();
				var self = this;
				_.each(this.options.items, function(item) {
					self.renderItem(item);
				});
				var $inputElement = this.getInputElement();
				$inputElement.attr('name', this.options.name);
				this.$input = $inputElement;
			}
			this.options.items = items;
		},
		renderItem : function(item) {
			this.$inputWrapper.append(JST[this.options.optionTemplate]({
				label : item[this.options.labelKey],
				value : item[this.options.valueKey],
				item : item
			}));
		},
		getInputElement : function() {
			return this.$inputWrapper.find(this.optionSelector);
		},
		getOptionElements : function() {
			return this.$inputWrapper.find(this.optionSelector);
		}
	});

})();
