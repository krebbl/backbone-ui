(function() {

	UI.FieldView = UI.View.extend({
		tagName : 'div',
		renderContent: function(){
			
		},
		bindModelEvents: function(){
			if(this.model && this.options.field){
				var self = this;
				this.model.bind('change:'+this.options.field,this.onModelValueChange,self);
				this.model.bind('error', this.onModelError, self);
			}
		},
		renderContent : function() {
			// set default options
			this.options = _.extend({},{enable: true,silentChange: false, unsetOnDisable: false, errorRenderer: UI.FieldErrorRenderer, fieldTemplate: 'field'},this.options);
			
			// render template
			this.$el.html(JST[this.options.fieldTemplate]({view: this}));
			
			if(_.isUndefined(this.options.fieldId)){
				this.options.fieldId = "field-"+UI.createID();
			}
			if(_.isUndefined(this.options.name)){
				this.options.name = this.options.fieldId;
			}
			this.fieldID = this
			this.$el.find('label').first().attr('for',this.options.fieldId);
			this.renderLabel(this.options.label);
			
			this.$inputWrapper = this.$el.find('div.input').first();
			if(this.options.inputTemplate){
				this.$inputWrapper.html(JST[this.options.inputTemplate]({view: this}));
			}
			this.renderInputElement();
			
			this.bindInputEvents();
			
			var value = this.options.value;			
			if(this.model && this.options.field){
				value = this.model.get(this.options.field);
			}			
			this.renderValue(value);
			
			if(this.options.errors){
				this.renderError(this.options.error);
			}
			
			this.renderEnable(this.options.enable);
		},
		onInputValueChange: function(){
			var valueBinding = this.bindings['value'];
			var val = this.getValueForModel();
			if(valueBinding){
				valueBinding.setValue(val,this.options.silentChange);
			}else if(this.model && this.options.field){
				if(val != null){
					var v = {}; v[this.options.field] = val;
					this.model.set(v,{silent: this.options.silentChange});
				}else{
					// unset the value
					if(this.options.unsetOnDisable === true){
						this.model.unset(this.options.field);
					}
					
				}
			}
			this.options.value = val;
			this.trigger('valueChanged',this,val);
		},
		onModelValueChange: function(){
			this.set({value: this.model.get(this.options.field)});
		},
		renderValue: function(value){
			this.renderInputValue(value);
		},
		renderError: function(error){
			if(_.isUndefined(error) || error == null){
				this.$el.removeClass("has-error");
				this.$el.find('.error').first().html("");
			}else{
				this.$el.addClass("has-error");
				if(_.isArray(error)) error = error[0];
				this.options.errorRenderer(this, error);
			}
			
		},
		onModelError: function(model, error){
			if(!_.isUndefined(error)){
				var fieldError = error[this.options.field];
				this.set({error: fieldError});
			}
		},
		renderLabel: function(label){
			if(_.isUndefined(label)){
				label = "";
			}
			this.$el.find('label').first().html(label);
		},
		renderEnable: function(enabled){
			if(!_.isFunction(this.getInputElement)) return;
			// console.log("render enable");
			if(enabled === false){
				this.$el.addClass('disabled');
				this.getInputElement().attr('disabled','disabled');
				this.onInputValueChange();
				this.trigger('disable',this);
			}else if(enabled === true){
				this.$el.removeClass('disabled');
				this.getInputElement().removeAttr('disabled');
				this.onInputValueChange();
				this.trigger('enable',this);
			}
		},
		getValueForModel: function(){
		
		},
		renderInputElement: function(){
			
		},
		bindInputEvents: function(){
			
		},
		renderInputValue: function(value){
		
		}
	});
	
	// The default FieldErrorRenderer, can be overridden for specific default error displaying
	UI.FieldErrorRenderer = function(view,error){
		view.$el.find('.error').html(error);
	};

})();
