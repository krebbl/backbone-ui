(function() {

	UI.WorkspaceView = UI.View.extend({
		defaultOptions : {
			fitLayout : true,
			topViewHeight : 40,
			bottomViewHeight : 40,
			contentView : new UI.View()
		},
		renderContent : function() {
			this.contentView = (!this.options.contentView ? null : this.options.contentView);
			this.topView = (!this.options.topView ? null : this.options.topView);
			this.bottomView = (!this.options.bottomView ? null : this.options.bottomView);

			if(this.topView) {
				this.renderChildView(this.topView);
			}

			if(this.contentView) {
				this.renderChildView(this.contentView);
			}

			if(this.bottomView) {
				this.renderChildView(this.bottomView);

			}
			this.layoutElements();
		},
		layoutElements : function() {
			this.$el.css({
				'position' : 'relative'
			});

			var height;
			if(this.topView) {
				height = this.options.topViewHeight;
				this.topView.set({height:height});
			}

			var self = this;
			if(this.bottomView) {
				height = this.options.bottomViewHeight;
				this.bottomView.$el.css({
					"position" : "absolute",
					"bottom" : 0,
					"left" : 0,
					"right" : 0,
					"height" : height
				})
			}
			this.resizeContent();
		},
		calculateContentHeight : function() {
			var height = this.getHeight();
			if(this.topView) {
				height -= this.options.topViewHeight;
			}
			if(this.bottomView) {
				height -= this.options.bottomViewHeight;

			}
			return height;
		},
		resizeContent : function() {
			this.contentView.set({height: this.calculateContentHeight()});
			this.contentView.resize();
		}
	});

})();
