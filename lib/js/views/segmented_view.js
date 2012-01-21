(function() {

	UI.SegmentedView = UI.View.extend({
		defaultOptions : {
			fitLayout : true
		},
		renderContent : function() {
		},
		renderVisibleView : function(v) {
			_.each(this.childViews, function(view) {
				if(view != v && view.isVisible()) {
					view.set({visible: false});
				}
			});
			if(!_.include(this.childViews, v)) {
				// lazy render
				this.renderChildView(v);
			} else if(this.currentView != v) {
				v.set({visible : true});
			}
			this.currentView = v;
		},
		getCurrentView: function(){
			return this.currentView;
		}
	});

})();
