(function() {

	UI.SplitView = UI.View.extend({
		defaultOptions : {
			fitLayout : true,
			leftViewWidth : 200,
			leftView : new UI.View({}),
			rightView : new UI.View({
				innerHTML: "Content"
			}),
			resizable : true
		},
		renderContent : function() {
			this.renderChildView(this.options.leftView);

			this.options.leftView.$el.css({
				"height" : this.$el.height(),
				"float" : "left",
				"width" : this.options.leftViewWidth,
				"top" : "0px",
				"left" : "0px"
			});

			this.renderChildView(this.options.rightView);

			this.options.rightView.$el.css({
				"height" : this.$el.height(),
				"float" : "left"
			});

			if(this.options.resizable) {
				this.options.leftView.$el.resizable({
					containment : this.$el,
					minWidth : 100,
					handles : 'e'
				})
			}
			
			this.layoutElements();
		},
		layoutElements : function() {
			var self = this;
			
			this.options.leftView.$el.resize(function(e) {
				self.resizeRightView();
			});
			
			this.resizeContent();
		},
		resizeContent : function() {
			var height = this.getHeight();
			this.options.leftView.set({"height": height});
			this.options.rightView.set({"height": height});
			
			this.options.leftView.resize();
		},
		resizeRightView: function(){
			var width = this.getWidth() - this.options.leftView.getWidth();
			this.options.rightView.set({"width": width});
			this.options.rightView.resize();
		}
	});

})();
