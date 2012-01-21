(function() {
	UI.LoadingMask = {
		renderLoadingMask : function(text) {
			if(_.isUndefined(text)) {
				text = "Lade Daten ...";
			}
			if(_.isUndefined(this.options.loadingMaskTemplate)) {
				this.options.loadingMaskTemplate = "loading_mask";
			};
			
			if(this.options.loadingMaskSelector){
				this.$loadingMask = this.$el.find(this.options.loadingMaskSelector);
			}else{
				this.$loadingMask = this.$el;
			}
			
			if(!this.options.loadingMaskClasses){
				this.options.loadingMaskClasses = 'ui-tooltip-shadow ui-tooltip-dark ui-tooltip-rounded';
			}
			
			this.$loadingMask.qtip({
				content : {
					text : JST[this.options.loadingMaskTemplate]({
						text : text
					})
				},
				position : {
					my : 'center', // Use the corner...
					at : 'center' // ...and opposite corner
				},
				show : {
					event : false, // Don't specify a show event...
				},
				hide : false, // Don't specify a hide event either!
				style : {
					classes : this.options.loadingMaskClasses
				}
			});
		},
		showLoadingMask : function() {
			this.$loadingMask.qtip('show');
		},
		hideLoadingMask : function() {
			this.$loadingMask.qtip('hide');
		}
	}
})();
