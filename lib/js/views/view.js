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
