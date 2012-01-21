(function() {

	UI.ListView = UI.View.extend({
		defaultOptions : {
			// the default key for the item id
			itemIdKey : "cid",
			// the default item to view function
			selectable : false,
			multiSelect : false,
			needsSelection : false,
			hasLoadingMask : true
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

			if(this.options.childViews) {
				this.renderChildViews(this.options.childViews);
			} else if(this.collection) {
				this.renderCollection(this.collection);
			} else if(this.options.items) {
				this.renderItems(this.options.items);
			}

			if(this.options.needsSelection === true) {
				if(this.getSelectedViews().length == 0 && this.childViews.length > 0) {
					var v = this.childViews[0];
					v.set({
						selected : true
					});

					// this.selectView(v);
				}
			}

			if(this.options.hasLoadingMask === true) {
				this.renderLoadingMask();
			}
		},
		// create a DOM Element for the list item
		createListElement : function() {
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
		// removes the DOM element from the list
		removeListElement : function(index) {
			var li = $(this.$el.children().get(index));
			if(li.hasClass('first')) {
				li.next().addClass('first');
			} else if(li.hasClass('last')) {
				li.prev().addClass('last');
			}
			li.remove();
		},
		// add a child view to the list view
		addView : function(view) {
			var target = this.createListElement();
			if(_.isFunction(view.render)) {
				this.renderChildView(view, target);

				var self = this;
				// add events
				// view.setSelectable(self.options.selectable);
				view.bind('change:selected', function(v, selected) {
					if(selected === true) {
						self.selectView(v);
					} else if(selected === false && self.needsSelection === true) {
						if(self.getSelectedViews().length == 0) {
							v.set({
								selected : true
							},true);
						}
					}
				});
			}

			this.resize();
		},
		// remove a view childview from the listview
		removeView : function(view) {
			var self = this;
           var i = -1;
           _.each(this.childViews, function(childView, index) {
				if(childView == view) {
                   // IMPORTANT: first remove inner view, then the surrounding list element
					view.remove();
					self.removeListElement(index);
                   i = index;
				}
			});
           if(i > -1){
               this.childViews.splice(i,1);
           }

           this.resize();
		},
		// item to the view
		addItem : function(item) {
			// console.log([item,this.options.itemToView]);
			if(!_.isFunction(this.options.itemToView)) {
				throw "No item to view function defined"
			}
			var view = this.options.itemToView(item);
			this.addView(view);
			this.renderedItems.push(item);
		},
		// remove item from view
		removeItem : function(item) {
           var view = this.getViewByItem(item);

			if(view != null) {
               var i = this.getIndexOfView(view);
               this.removeView(view);
               if(i > -1){
                   this.renderedItems.splice(i,1);
               }

           }


		},
		getViewByItem : function(item) {
			var index = this.getIndexOfItem(item);
			if(index > -1) {
				return this.childViews[index];
			} else {
				return null;
			}
		},
		renderCollection : function(collection, oldCollection){
			this.clearItems();
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
		
			collection.each(function(model){
				self.addItem(model);
			});
		},
		renderChildViews: function(childViews){
			var self = this;
			_.each(childViews, function(childView) {
				self.addView(childView);
			})
		},
		// renders an array of items to the view
		renderItems : function(items) {
			this.clearItems();
			var self = this;
			_.each(items, function(item) {
				self.addItem(item);
			});
		},
		clearItems : function() {
			var self = this;

			while(this.renderedItems.length > 0){
				this.removeItem(this.renderedItems[0]);
			};
		},
		// returns the number of list items
		getSize : function() {
			return _.size(this.renderedItems);
		},
		// selects the view of the given item
		selectItem : function(item) {
			var view = this.getViewByItem(item);
			this.selectView(view);
		},
		// selects a view and deselect other views if multiSelect === false
		selectView : function(view) {

			var self = this;
			_.each(this.childViews, function(v, i) {
				// console.log([i, v.isSelected()]);
				if(v != view && self.options.multiSelect !== true && v.isSelected()) {
					v.set({
						selected : false
					});
				}
			});

			this.set({
				selectedViews : this.getSelectedViews(),
				selectedItems : this.getSelectedItems()
			});
		},
		getSelectedItems : function() {
			var selectedItems = [];
			var self = this;
			_.each(this.renderedItems, function(item, i) {
				if(self.childViews[i].isSelected()) {
					selectedItems.push(item);
				};
			});
			return selectedItems;
		},
		getSelectedViews : function() {
			var selectedViews = [];
			_.each(this.childViews, function(view, i) {
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
