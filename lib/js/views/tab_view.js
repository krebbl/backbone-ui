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
