// This is the annotated source code for
// [backboneUI],
//

/** @license VisualSearch.js 0.2.0
 *  (c) 2011 Marcus Krejpowicz, krebbl@gmail.com
 *  BackboneUI may be freely distributed under the MIT license.
 */

(function() {

	var $ = jQuery;
	// Handle namespaced jQuery

	// Setting up BackboneUI globals. These will eventually be made instance-based.
	if(!window.UI)
		window.UI = {};

	// Sets the version for BackboneUI to be used programatically elsewhere.
	UI.VERSION = '0.1.0';

	UI.lastID = 1;

	// create a unique ID for elements
	UI.createID = function() {
		return UI.lastID++;
	}
	// localize helper
	UI.loc = function(str) {
		return UI.Locale.localize(str);
	}
})();

(function(){
	UI.Binding = function(opt){
		this.init(opt);
	};
	
	UI.Binding.prototype = {
		event: 'change',
		callbacks: [],
		transform: function(val,model){
			return val;
		},
		init: function(opt){
			_.extend(this,opt);
		},
		// adds a callback to the model event 
		add: function(fnc, target){
			var cb = {
				fnc: this.createCallbackFnc(fnc,target),
				target: target
			}
			this.model.bind(this.getEventName(),cb.fnc,cb.target);
			
			this.callbacks.push(cb);
		},
		createCallbackFnc: function(fnc,target){
			var self = this;
			return function(model,value){
				fnc.call(target,self.transform(value,model));
			}
		},
		getEventName: function(){
			if(this.key != null){
				return this.event + ":" + this.key;
			}else{
				return this.event;
			}
		},
		// removes the callback
		remove: function(fnc){
			var self = this;
			_.each(this.callbacks, function(cb,i){
				if(cb.fnc == fnc){
					self.callbacks.slice(i,1);
				}
			});
			this.model.unbind(this.getEventName(),fnc);
		},
		removeByTarget: function(target){
			var self = this;
			var callback;
			_.each(this.callbacks, function(cb,i){
				if(cb.target == target){
					callback = cb;
					self.callbacks.slice(i,1);
				}
			});
			this.model.unbind(this.getEventName(),callback.fnc);
		},
		getValue: function(){
			if(this.key != null) {
				if(this.event == "change"){
					var val = this.model.get(this.key);
					return this.transform(val,this.model);
				}
			}
			return this.transform(null,this.model);
		},
		setValue: function(v,silent){
			if(_.isUndefined(silent)){
				var silent = true;
			}
			var s = {};
			s[this.key] = v;
			this.model.set(s,{silent: silent});
		},
		setModel : function(model){
			var self = this;
			var oldModel = this.model;
			this.model = model;
			_.each(this.callbacks,function(cb){
				oldModel.unbind('change:'+self.key,cb.fnc);
				self.add(cb.fnc,cb.target);
				self.model.trigger('change:'+self.key);
			});
		},
		trigger: function(){
			this.model.trigger('change:'+this.key);
		}
	}
})();

(function(){

	UI.ErrorFieldRenderer = function(view,error){
		
		
	};

})();

(function() {
	UI.Locale = (function(data) {
		var data = {};

		return {
			init : function(d) {
				data = d;
			},
			localize : function(str) {
				if(!_.isUndefined(data[str])) {
					return data[str];
				}
				return str;
			}
		}

	}());
})();

// **BackboneUI** is a quick-and-dirty UI library based on the Backbone library
// It provides basic UI Elements like Lists, TabViews, Button, Input Elements etc
// it supports property binding ...

(function() {

	var $ = jQuery;
	// Handle namespaced jQuery

	UI.View = Backbone.View.extend({
		renderedChildViews: [],
		bindings : {},
		defaultOptions : {},
		// contains all direct childViews
		childViews : [],
		initialize : function() {
			// set default options
			this.options = _.extend({
				fitLayout : false,
				selectable : false,
				selected : false,
				templateRenderer : function(template, view) {
					return JST[template]({
						view : view
					})
				}
			}, this.defaultOptions, this.options);

			this.bindModelEvents();
			// set the callbacks
			this.initCallbacks();
			this.initBindings();
		},
		// binds to collection / model events
		bindModelEvents : function() {
			// EMPTY
		},
		// binds the view to the given callback events
		initCallbacks : function() {
			var self = this;
			if(this.options.callbacks) {
				_.each(this.options.callbacks, function(v, k) {
					if(_.isFunction(v)) {
						self.bind(k, v);
					}
				})
			}
		},
		// inits dynamic attribute binding
		// for example you can set a visibleBinding, which calls the setVisible method on property change
		// the property should than return a boolean value
		initBindings : function() {
			var self = this;
			
			var bind = function(b,attr){
				if(_.isFunction(b.add)) {
					b.add(function(value) {
						self.setOption(attr, value);
					}, self);
					// set the current values to the property object
					self.setOption(attr, b.getValue());
					self.bindings[attr] = b;
				}
			}
			this.bindings = {};
			_(this.options).each(function(b, k) {
				var i = k.lastIndexOf("Binding");
				if(i > 0) {
					var attr = k.substr(0, i);
					bind(b,attr);
				}
			});
		},
		// renders the view to the container
		render : function() {
			this.renderedChildViews = [];

			this.$el = $(this.el);

			this.$el.empty();

			if(_.isUndefined(this.options.container)) {
				throw "No container to render!";
			} else {
				this.$container = $(this.options.container);
			}

			this.$container.append(this.$el);

			// layout the element
			this.layoutElement();

			// render the content
			if(this.options.innerHTML) {
				this.renderInnerHTML(this.options.innerHTML);
			} else if(this.options.template) {
				this.renderInnerHTML(this.options.templateRenderer(this.options.template, this));
			} else if(this.options.childViews){
				this.renderChildViews(this.options.childViews);
			}

			this.renderContent();

			// set the classname of the element
			this.renderClassName(this.className);
			this.renderVisible(this.options.visible);

			this.renderSelected(this.options.selected);
			this.renderSelectable(this.options.selectable);

			var self = this;
			this.$el.bind('click', function(e) {
				self.trigger('click', e, self);
			})

			this.afterRender();
			this.trigger('afterRender', this);
		},
		renderClassName : function(className) {
			this.$el.attr('class',className);
		},
		afterRender : function() {

		},
		// renders the view to a given container
		renderTo : function(container) {
			this.options.container = container;
			this.render();
		},
		layoutElement : function() {
			var self = this;
			if(this.options.fitLayout === true) {
				// TODO: remove! ... we don't want style here'
				this.$el.css({
					"float" : "left",
					"width" : "100%",
					"height" : "100%",
					// "position" : "relative",
					"overflow" : "hidden"
				});

				if(this.$container.context.nodeName == "BODY") {
					$(window).resize(function(e) {
						// self.resize();
					});
				} else {
					this.$container.resize(function() {
						// self.resize();
					});
				}
				// this.resize();
				this.$el.resize(function(e) {
					e.stopPropagation();
					// self.resizeContent();
				});
			} else {
				if(this.options.height) {
					this.$el.height(this.options.height);
				}
				if(this.options.width) {
					this.$el.width(this.options.width);
				}
			}

		},
		resize : function() {
			if(this.isVisible()) {
				this.$el.resize();
				// this.resizeContent();
			}
		},
		resizeContent : function() {
			// can be overridden by subclasses
		},
		isVisible : function() {
			return this.$el.is(":visible");
		},
		// sets the visibility of the element
		renderVisible : function(visible) {
			if(visible === true) {
				this.$el.show();
				this.trigger('afterShow');
				var self = this;
				self.resize();
			} else if(visible === false) {
				this.trigger('beforeHide');
				this.$el.hide();
			}
		},
		// sets the model
		renderModel : function(model) {
			this.render();
		},
		// renders the content of the element, should be overridden by the sub views
		renderContent : function() {
			// empty
		},
		renderChildViews : function(childViews){
			this.removeRenderedChildViews();
			
			var cv;
			for(var i = 0; i < childViews.length; i++){
				cv = childViews[i];
				this.renderChildView(cv);
			};
		
		},
		// renders a childView to a given target and pushes it to the array of childviews
		renderChildView : function(v) {
			// if(_.isUndefined(target)) {
			if(!v.hasContainer()){
				v.options.container = this.$el;
			}
			
			v.render();
			v.parent = this;
			this.renderedChildViews.push(v);
			var self = this;
			var events = ['beforeHide', 'afterShow'];
			_.each(events, function(e) {
				self.bind(e, function() {
					v.trigger(e);
				});
			});
		},
		clearChildViews: function(){
			if(this.options.childViews){
				// remove childViews
		           while(this.options.childViews.length > 0){
		               this.removeChildView(this.options.childViews[0]);
		           }
			}
			
		},
		addChildView: function(view){
			if(!this.options.childViews){
				this.options.childViews = [];
			}
			this.options.childViews.push(view);
			if(this.isRendered()){
				this.renderChildView(view);
			}
		},
		removeChildView : function(view) {
			view.remove();
		},
		// this method is called by the childview
		// removes the child view from options and from renderedChildViews
		onChildViewRemoved: function(view){
			if(this.renderedChildViews){
				// first try to remove rendered child view
				var self = this;
				var index = -1;
				_.each(this.renderedChildViews, function(v, i) {
					if(view == v) {
						index = i;
					}
				})
				if(index > -1) {
					this.renderedChildViews.splice(index, 1);
				}
			}
			
			if(this.options.childViews){
				// try to remove options childView
				_.each(this.options.childViews, function(v, i) {
					if(view == v) {
						index = i;
					}
				})
				if(index > -1) {
					this.options.childViews.splice(index, 1);
				}
			}
			
		},
		renderInnerHTML : function(html) {
			if(_.isFunction(this.options.htmlRenderer)) {
				html = this.options.htmlRenderer(html);
			}
			this.$el.html(html);
		},
		renderHeight : function(height) {
			this.$el.height(height);
			// this.resize();
		},
		renderWidth : function(width) {
			this.$el.width(width);
			// this.resize();
		},
		getHeight : function() {
			return this.$el.height();
		},
		getWidth : function() {
			return this.$el.width();
		},
		// sets selectable property
		renderSelectable : function(selectable) {
			if(selectable === true) {
				var self = this;
				this.$el.bind('click.selected', function() {
					self.set({
						selected : !self.isSelected()
					});
				});
			} else if(selectable === false) {
				this.$el.unbind('click.select');
				this.set({
					selected : false
				});
			}

		},
		// returns true if the view is selected
		isSelected : function() {
			return !_.isUndefined(this.options.selected) && this.options.selected === true;
		},
		// set view selected, adds "selected" className to element
		renderSelected : function(selected) {
			if(this.options.selectable !== true)
				return;
			//console.log([selected])
			if(selected === true) {
				this.$el.addClass('selected');

			} else if(selected === false) {
				this.$el.removeClass('selected');
			}
		},
		// return true, if a given option is set
		hasOption : function(attr) {
			return !_.isUndefined(this.options[attr]) && this.options[attr] != null;
		},
		set : function(obj, silent) {
			if(_.isObject(obj)) {
				var self = this;
				_.each(obj, function(value, attr) {
					self.setOption(attr, value, silent);
				});
			}
		},
		setOption : function(attr, value, silent) {
			var oldValue;
			// set the option attr
			if(attr == "className" || attr == "model" || attr == "collection") {
				oldValue = this[attr];
				this[attr] = value;
			} else {
				oldValue = this.options[attr];
				this.options[attr] = value;
			}
			
			// after try to render
			this._renderOption(attr, value, oldValue);

			if(!silent) {
				// then trigger the change
				this.trigger('change:' + attr, this, value);
			}

		},
		// try to render the attr value pair
		_renderOption : function(attr, value, oldValue) {
			if(!this.isRendered())
				return;
			attr = attr[0].toUpperCase() + attr.substr(1);
			var method = "render" + attr;
			
			if(_.isFunction(this[method])) {
				this[method](value,oldValue);
			}
		},
		// gets option value
		get : function(attr) {
			return this.options[attr];
		},
		// has option set?
		has : function(attr) {
			return !_.isUndefined(this.options[attr])
		},
		//
		remove : function() {
			// remove bindings!
			var self = this;
			_.each(this.bindings, function(binding) {
				binding.removeByTarget(self);
			});
			
           // call the parent, that the view was removed
           if(this.parent){
           		this.parent.childViewRemoved(this);
           }
           
		   if(this.isRendered()) {
				// remove element from dom
				this.$el.remove();
	
				// delete $el
				delete this.$el;
			}
		},
		// returns true, if the element is rendered
		isRendered : function() {
			return !_.isUndefined(this.$el);
		},
		// returns true if a container is set
		hasContainer : function() {
			return !_.isUndefined(this.options.container);
		},
		// returns the attribute binding
		getBinding : function(attr) {
			return this.bindings[attr];
		},
		focus : function() {
			this.$el.focus();
		}
	});
})();

(function() {

	UI.ListView = UI.View.extend({
		defaultOptions : {
			// the default key for the item id
			itemIdKey : "cid",
			// the default item to view function
			selectable : false,
			multiSelect : false,
			needsSelection : false
		},
		tagName : 'ul',
		renderedItems : [],
		// list of all items / models
		// collection
		// list of items
		// list of childviews
		itemToView : null,
		// render the content of this view
		renderContent : function() {
			var self = this;

			this.renderedItems = [];

			if(this.collection) {
				this.renderCollection(this.collection);
			} else if(this.options.items) {
				this.renderItems(this.options.items);
			}
		},
		
		// create a DOM Element for the list item
		createListElement : function(item) {
			var listItems = this.$el.children('li');
			var li = $(document.createElement('li'));
			if(listItems.length == 0) {
				li.addClass('first');
			}
			listItems.last().removeClass('last');
			li.addClass('last');

			this.$el.append(li);

			return li;
		},	
		// remove item from view
		removeItem : function(item) {
           var view = this.getViewByItem(item);
			if(view != null) {
				view.remove();
				var i = this.getIndexOfItem(item);
               	if(i > -1){
                   this.renderedItems.splice(i,1);
               	}
               	this.$el.children().last().addClass('last');
           }
           this.options.items.splice(i,1);


		},
		getViewByItem : function(item) {
			var index = this.getIndexOfItem(item);
			if(index > -1) {
				return this.renderedChildViews[index];
			} else {
				return null;
			}
		},
		// binds events on collection and sets collection items to 
		renderCollection : function(collection, oldCollection){
			var self = this;
			if(oldCollection){
				// remove old events
				oldCollection.unbind('add',this.addItem,this);
				oldCollection.unbind('remove',this.removeItem,this);
				oldCollection.unbind('reset',this.renderCollection,this);
			};
			// bind events for new collection
			collection.bind('add', this.addItem, this);
			collection.bind('remove',this.removeItem, this);
			collection.bind('reset', this.renderCollection, this);
		
			this.set({items: collection.models});
		},
		// renders an array of items to the view
		renderItems : function(items) {
			this.clearRenderedItems();
			var self = this;
			var listItemView;
			_.each(items, function(item,i) {			
				self.renderItem(item,i);
			});
		},
		addItem: function(item){
			if(!this.options.items){
				this.options.items = [];
			}
			this.options.items.push(item);
			if(this.isRendered()){
				this.renderItem(item,this.options.items,this.options.items.length-1);
			}
		},
		// item to the view
		renderItem : function(item,i) {
			if(!_.isFunction(this.options.itemToView)) {
				throw "No item to view function defined"
			}
			var listItemView = this.options.itemToView(item);
			
			listItemView.options.container = this.createListElement();
			this.addChildView(listItemView);
			this.renderedItems.push(item);
			
			if(this.options.needsSelection === true && this.renderedItems.length === this.options.items.length) {
				if(this.getSelectedViews().length == 0 && this.renderedChildViews.length > 0) {
					var v = this.renderedChildViews[0];
					v.set({
						selected : true
					});
				}
			}
		},
		renderChildView : function(view){
			view.bind('change:selected',this.checkSelection,this);
			UI.View.prototype.renderChildView.call(this,view);
			
		},
		clearRenderedItems : function() {
			while(this.renderedItems.length > 0){
				this.removeRenderedItem(this.renderedItems[0]);
			};
		},
		// returns the number of list items
		getSize : function() {
			return _.size(this.renderedItems);
		},
		// selects the view of the given item
		selectItem : function(item) {
			var view = this.getViewByItem(item);
			view.set({selected: true});
		},
		// selects a view and deselect other views if multiSelect === false
		checkSelection : function(view) {
			if(view.isSelected()){
				// check if multiselect option is given
				var self = this;
				_.each(this.renderedChildViews, function(v, i) {
				// console.log([i, v.isSelected()]);
				if(v != view && self.options.multiSelect === false && v.isSelected()) {
					v.set({
						selected : false
					});
				}
				});
				
				this.set({
					selectedItems: this.getSelectedItems(),
					selectedViews: this.getSelectedViews()
				})
			}else{
				// check if needsSelection option is given
				if(this.getSelectedViews().length == 0){
					view.set({selected: true});
				}
			}
			
		},
		getSelectedItems : function() {
			var selectedItems = [];
			var self = this;
			_.each(this.renderedItems, function(item, i) {
				if(self.renderedChildViews[i].isSelected()) {
					selectedItems.push(item);
				};
			});
			return selectedItems;
		},
		getSelectedViews : function() {
			var selectedViews = [];
			_.each(this.renderedChildViews, function(view, i) {
				if(view.isSelected()) {
					selectedViews.push(view);
				};
			});
			return selectedViews;
		},
		getIndexOfView : function(view) {
			var index = -1;
			_.each(this.childViews, function(v, i) {
				if(v == view) {
					index = i;
				};
			});
			return index;
		},
		getIndexOfItem: function(item){
			var index = -1;
			_.each(this.renderedItems, function(it, i) {
				if(it == item) {
					index = i;
					return;
				}
			});
			return index;
		}
	});

	_.extend(UI.ListView.prototype, UI.LoadingMask);

})();

(function() {

	UI.ContainerView = UI.ListView.extend({
		tagName : 'div',
		// create a DOM Element for the list item
		createListElement : function(item) {
			return this.$el;
		}
	});

})();

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

(function() {

	UI.LinkView = UI.ButtonView.extend({
		tagName : 'a',
		defaultOptions : {
			fitLayout : false,
			label : null
		},
		renderContent : function() {
			this.renderHref(this.options.href);

			// must be called after setHref
			this.renderLinkTarget(this.options.linkTarget);
			
			if(this.options.label){
				this.renderLabel(this.options.label);
			}
			
			this.set({
				menuView : this.options.menuView
			});
		},
		renderLabel: function(label){
			if(this.renderedLabelView){
				this.renderedLabelView.remove();
			}
			this.renderedLabelView = new UI.View({
				tagName: 'span',
				innerHTML: label
			});
			this.renderChildView(this.renderedLabelView);
		},
		// sets the href attribute of the link element
		// if href is not defined, the href attribute is set to javascript: void(0);
		renderHref : function(href) {
			if(_.isUndefined(href)) {
				href = "#";
				this.$el.attr('onclick', 'return false;');
			} else {
				this.$el.removeAttr('onclick');
			}
			this.$el.attr('href', href);
		},
		// sets the target of the link, if the href attribute is set
		// if the target is undefined, it is set to _blank
		renderLinkTarget : function(target) {
			if(!this.has('href')) {
				this.$el.removeAttr('target');
				this.options.linkTarget = "";
				return;
			}

			if(_.isUndefined(target)) {
				this.$el.removeAttr('target');
			} else {
				this.$el.attr('target', target);
			}
		},
		renderMenuView : function(menuView, oldView) {
			var self = this;
			// remove old menuView
			if(oldView){
				// oldView.remove();
			}
			// render menuView, bind events
			if(menuView) {
				var self = this;
				
				menuView.set({container: this.$el.parent()});
				
				this.addChildView(menuView);
				this.$el.parent().addClass('dropdown');

				this.$el.bind('click.dropdown', function(e) {
					if(e) {
						e.stopPropagation();
						e.preventDefault();
					}
					var parent = self.$el.parent();
					parent.toggleClass('open');
				});
				$(document.body).bind('click.dropdown' + this.cid, function(e) {

					self.$el.parent().removeClass('open');
				});
			} else {
				// remove class!
				this.$el.parent().removeClass('dropdown');

				// remove events

				this.$el.unbind('click.dropdown');
				$(document.body).unbind('click.dropdown' + this.cid);

			}
		}
	});

})();

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

(function() {

	UI.SegmentedView = UI.View.extend({
		defaultOptions : {
			fitLayout : true
		},
		renderContent : function() {
		},
		renderVisibleView : function(v) {
			_.each(this.renderedChildViews, function(view) {
				if(view != v && view.isVisible()) {
					view.set({visible: false});
				}
			});
			if(!_.include(this.renderedChildViews, v)) {
				// lazy render
				this.renderChildView(v);
			} else if(this.currentView != v) {
				v.set({visible : true});
			}
			this.currentView = v;
		},
		getCurrentView: function(){
			return this.currentView;
		},
		removeRenderedChildView: function(v){
			UI.View.prototype.removeRenderedChildView.call(this,v);
			if(this.currentView == v){
				this.set({visibleView: this.renderedChildViews[this.renderedChildViews.length-1]});
			}
		}
	});

})();

(function() {
	UI.TabView = UI.View.extend({
		defaultOptions : {
			linkListView : new UI.ListView({
				className : 'tabs',
				itemToView : function(view) {
					var title = "";
					if(view.has('title'))
						title = view.get('title');
					return new UI.LinkView({
						selectable : true,
						label : title
					});
				}
			}),
			segmentedView : new UI.SegmentedView({
				fitLayout : false,
				className : 'tab-content'
			}),
			emptyView : new UI.View({}),
			tabViews : []
		},
		renderContent : function() {
			// configure linkLisView
			this.options.linkListView.set({
				multiSelect : false,
				needsSelection : true
			});
			
			// set the tabViews
			// this.setTabViews(this.options.tabViews);
			var self = this;
			
			this.options.linkListView.bind('change:selectedItems', function(views, items) {
				self.options.segmentedView.set({
					visibleView : items[0]
				});
			});
			
			// render link list view without items, if linkListView is not already rendered!
			this.renderChildView(this.options.linkListView);

			// render segmented view which displays the tabs
			this.renderChildView(this.options.segmentedView);
			
			// render the tabs
			this.renderTabViews(this.options.tabViews);
		},
		renderTabViews : function(views) {
			var self = this;
			// clean the used list and segemented views
			this.options.linkListView.clearChildViews();
			this.options.segmentedView.clearChildViews();
			
			// add each tabView
			_.each(views, function(view) {
				self.renderTabView(view);
			});
		},
		// add a tab View
		addTabView : function(view) {
			this.options.tabViews.push(view);
			if(this.isRendered()){
				this.renderTabView(view);
			}
		},
		renderTabView: function(view){
			this.options.linkListView.addItem(view);
		},
		// remove a tab view
		removeTabView : function(view) {
			// remove from linkList view
			this.options.linkListView.removeItem(view);

			// set new visible view
			this.options.segmentedView.removeChildView(view);

		}
	})
})();

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

(function() {

	UI.DateFieldView = UI.FieldView.extend({
		defaultOptions : {
			inputTemplate : 'fields/date_input',
			dateFormat : 'yyyy-MM-dd'
		},
		renderInputElement : function() {
			this.$day = this.$el.find('select.day').first();
			this.$month = this.$el.find('select.month').first();
			this.$year = this.$el.find('input.year').first();
			
			// render month names
			// this.renderDaySelection();
			this.renderMonthSelection();
			
			this.$day.attr({
				'id' : this.options.fieldId
			});
		},
		bindInputEvents : function() {
			var self = this;
			
			this.$day.bind('change', function() {
				self.onInputValueChange();				
			});
			this.$month.bind('change', function() {
				self.onInputMonthChange();
			});
			this.$year.bind('change', function() {
				self.onInputYearChange();
			});
		},
		onInputYearChange: function(){
			var year = parseInt(this.$year.val()); 
			this.onInputMonthChange();
		},
		onInputMonthChange: function(){
			var day = parseInt(this.$day.val());
			var month = parseInt(this.$month.val());
			var year = parseInt(this.$year.val()); 
			
			var days = Date.getDaysInMonth(year,month);
			this.renderDaySelection(days);
			if(day > days){
				this.$day.val(days);
			}else{
				this.$day.val(day);
			}
			
			this.onInputValueChange();
		},
		renderDaySelection: function(days){
			if(this.$day.children().length == days) return;
			this.$day.empty();
			var label = "";
			for(var i = 1; i <= days; i++){
				label = (i < 10) ? "0" + i : i;
				this.$day.append("<option value='"+i+"'>"+label+"</option>");
			}
			
		},
		renderMonthSelection: function(){
			this.$month.empty();
			var months = Date.CultureInfo.monthNames;
			var label = "";
			for(var i = 0; i < 12; i++){
				this.$month.append("<option value='"+i+"'>"+months[i]+"</option>");
			}
			
		},
		renderInputValue : function(value) {
			var date = Date.parseExact(value, this.options.dateFormat);
			if(!date) {
				throw "Couldn't parse Date. Please specify format!";
			}
			this.renderDaySelection(Date.getDaysInMonth(date.getFullYear(),date.getMonth()));
			
			this.$month.val(date.getMonth());
			this.$day.val(date.getDate());
			
			this.$year.val(date.getFullYear());
		},
		getValueForModel : function() {
			
			var v = {};
			var y = parseInt(this.$year.val()), m = parseInt(this.$month.val()), d = parseInt(this.$day.val());
			try {
				Date.validateDay(d, y, m);
			} catch(e) {
				return null;
			}
			var date = new Date(y,m,d);
			// to prevent char input in firefox
			if(date.toString() == "Invalid Date"){
				return null;
			}
			return date.toString(this.options.dateFormat);
		},
		getInputElement: function(){
			return this.$inputWrapper.find('select,input');
		}
	});

})();

(function() {

	UI.RadioboxFieldView = UI.CheckboxFieldView.extend({
		optionSelector : 'input:radio',
		defaultOptions : {
			multiSelect : false,
			optionTemplate : 'fields/radiobox_input',
			valueKey : "value",
			labelKey : 'label'
		}
	});

})();

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
