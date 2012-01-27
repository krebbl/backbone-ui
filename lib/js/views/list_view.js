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
