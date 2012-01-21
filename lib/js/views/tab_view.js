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
			this.renderedTabViews = [];

			// configure linkLisView
			this.options.linkListView.set({
				multiSelect : false,
				needsSelection : true,
				items : this.options.tabViews
			});

			// render link list view without items, if linkListView is not already rendered!
			this.renderChildView(this.options.linkListView);

			// render segmented view which displays the tabs
			this.renderChildView(this.options.segmentedView);

			// set the tabViews
			// this.setTabViews(this.options.tabViews);
			var self = this;
			this.options.linkListView.bind('change:selectedItems', function(views, items) {
				self.showTabView(items[0]);
			});
			if(this.options.tabViews.length > 0) {
				this.showTabView(this.options.tabViews[0]);
			}
		},
		showTabView : function(view) {
			// be sure that the link is activated
			if(this.options.linkListView.getSelectedItems()[0] != view) {
				this.options.linkListView.selectItem(view);
			}
			this.options.segmentedView.set({
				visibleView : view
			});
		},
		setTabViews : function(views) {
			var self = this;

			_.each(this.renderedTabViews, function(view) {
				self.removeTabView(view);
			});

			_.each(views, function(view) {
				self.addTabView(view);
			});

			this.options.tabViews = views;
		},
		// add a tab View
		addTabView : function(view) {
			this.options.linkListView.addItem(view);
			this.renderedTabViews.push(view);
		},
		// remove a tab view
		removeTabView : function(view) {
			var index = -1;
			// find index of view
			_.each(this.renderedTabViews, function(v, i) {
				if(v == view) {
					index = i;
				}
			});
			if(index == -1)
				return;

			// remove from linkList view
			this.options.linkListView.removeItem(view);

			// remove from tabViews array
			this.renderedTabViews.slice(index, 1);

			// set new visible view
			if(view == this.options.segmentedView.getCurrentView()) {
				var v;
				if(this.renderedTabViews.length > 0) {
					if(index >= this.renderedTabViews.length)
						index = this.renderedTabViews.length - 1;
					v = this.renderedTabViews[index];
				} else {
					v = this.options.emptyView;
				}
				this.options.segmentedView.setVisibleView(v);
			}

		}
	})
})();
