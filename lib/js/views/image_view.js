(function() {

	UI.ImageView = UI.View.extend({
		tagName : 'img',
		defaultOptions : {
			src: 'blank',
		},
		renderContent : function() {
			this.renderSrc(this.options.src);
			this.renderAlt(this.options.alt);
		},
		// sets the href attribute of the link element
		// if href is not defined, the href attribute is set to javascript: void(0);
		renderSrc : function(src) {
			this.$el.attr('src', src);
		},
		renderAlt: function(alt){
			if(_.isUndefined(alt)){
				this.$el.removeAttr('alt');
			}else{
				this.$el.attr('alt',alt);
			}
		}
	});

})();
