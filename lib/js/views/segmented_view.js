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
