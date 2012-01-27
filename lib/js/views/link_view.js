(function() {

	UI.LinkView = UI.ButtonView.extend({
		tagName : 'a',
		defaultOptions : {
			fitLayout : false,
			label : null
		},
		renderContent : function() {
			this.renderHref(this.options.href);

			// must be called after setHref
			this.renderLinkTarget(this.options.linkTarget);
			
			if(this.options.label){
				this.renderLabel(this.options.label);
			}
			
			this.set({
				menuView : this.options.menuView
			});
		},
		renderLabel: function(label){
			if(this.renderedLabelView){
				this.renderedLabelView.remove();
			}
			this.renderedLabelView = new UI.View({
				tagName: 'span',
				innerHTML: label
			});
			this.renderChildView(this.renderedLabelView);
		},
		// sets the href attribute of the link element
		// if href is not defined, the href attribute is set to javascript: void(0);
		renderHref : function(href) {
			if(_.isUndefined(href)) {
				href = "#";
				this.$el.attr('onclick', 'return false;');
			} else {
				this.$el.removeAttr('onclick');
			}
			this.$el.attr('href', href);
		},
		// sets the target of the link, if the href attribute is set
		// if the target is undefined, it is set to _blank
		renderLinkTarget : function(target) {
			if(!this.has('href')) {
				this.$el.removeAttr('target');
				this.options.linkTarget = "";
				return;
			}

			if(_.isUndefined(target)) {
				this.$el.removeAttr('target');
			} else {
				this.$el.attr('target', target);
			}
		},
		renderMenuView : function(menuView, oldView) {
			var self = this;
			// remove old menuView
			if(oldView){
				// oldView.remove();
			}
			// render menuView, bind events
			if(menuView) {
				var self = this;
				
				menuView.set({container: this.$el.parent()});
				
				this.addChildView(menuView);
				this.$el.parent().addClass('dropdown');

				this.$el.bind('click.dropdown', function(e) {
					if(e) {
						e.stopPropagation();
						e.preventDefault();
					}
					var parent = self.$el.parent();
					parent.toggleClass('open');
				});
				$(document.body).bind('click.dropdown' + this.cid, function(e) {

					self.$el.parent().removeClass('open');
				});
			} else {
				// remove class!
				this.$el.parent().removeClass('dropdown');

				// remove events

				this.$el.unbind('click.dropdown');
				$(document.body).unbind('click.dropdown' + this.cid);

			}
		}
	});

})();
