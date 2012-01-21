(function() {

	UI.ScrollView = UI.View.extend({
		defaultOptions : {
			// the default key for the item id
			contentView : null,
			minBarHeight : 30
		},
		renderContent : function() {
			var self = this;
			var me = $(document.createElement("div"));

			this.$me = me;

			this.$el.append(me);

			var contentView = this.options.contentView;
			if(contentView) {
				this.renderChildView(contentView, me);

				contentView.$el.resize(function(){
					self.calculateScrollbarHeight();
				});
			}
			me.css({
				height : this.$el.outerHeight(),
				overflow : "hidden"
			});

			var isOverPanel, isOverBar, isDragg, queueHide, divS = '<div></div>', minBarHeight = 30, wheelStep = 30, o = o || {}, cwidth = o.width || 'auto', cheight = o.height || '250px', size = o.size || '7px', color = o.color || '#000', position = o.position || 'right', opacity = o.opacity || .4;

			this.$el.css({
				position : 'relative',
				overflow : 'hidden'
			});

			this.$rail = $(divS).css({
				width : '15px',
				height : '100%',
				position : 'absolute',
				top : 0
			});

			this.$bar = $(divS).attr({
				'class' : 'slimScrollBar ',
				style : 'border-radius: ' + size
			}).css({
				background : color,
				width : size,
				position : 'absolute',
				top : 0,
				opacity : opacity,
				display : 'none',
				BorderRadius : size,
				MozBorderRadius : size,
				WebkitBorderRadius : size,
				zIndex : 99
			});

			var rail = this.$rail;
			var bar = this.$bar;

			//set position
			var posCss = (position == 'right') ? {
				right : '1px'
			} : {
				left : '1px'
			};
			this.$rail.css(posCss);
			this.$bar.css(posCss);

			//calculate scrollbar height and make sure it is not too small
			this.calculateScrollbarHeight();

			this.$el.append(this.$bar);
			this.$el.append(this.$rail);

			//make it draggable

			this.$bar.draggable({
				axis : 'y',
				containment : 'parent',
				start : function() {
					isDragg = true;
				},
				stop : function() {
					isDragg = false;
					hideBar();
				},
				drag : function(e) {
					//scroll content
					scrollContent(0, $(this).position().top, false);
				}
			});

			//show on parent mouseover
			me.hover(function() {
				isOverPanel = true;
				showBar();
			}, function() {
				isOverPanel = false;
				hideBar();
			});
			var _onWheel = function(e) {
				//use mouse wheel only when mouse is over
				if(!isOverPanel) {
					return;
				}

				var e = e || window.event;

				var delta = 0;
				if(e.wheelDelta) {
					delta = -e.wheelDelta / 120;
				}
				if(e.detail) {
					delta = e.detail / 3;
				}

				//scroll content
				scrollContent(0, delta, true);

				//stop window scroll
				if(e.preventDefault) {
					e.preventDefault();
				}
				e.returnValue = false;
			}
			var scrollContent = function(x, y, isWheel) {
				var delta = y;

				if(isWheel) {
					//move bar with mouse wheel
					delta = bar.position().top + y * wheelStep;

					//move bar, make sure it doesn't go out
					delta = Math.max(delta, 0);
					var maxTop = me.outerHeight() - bar.outerHeight();
					delta = Math.min(delta, maxTop);

					//scroll the scrollbar
					bar.css({
						top : delta + 'px'
					});
				}

				//calculate actual scroll amount
				percentScroll = parseInt(bar.position().top) / (me.outerHeight() - bar.outerHeight());
				delta = percentScroll * (me[0].scrollHeight - me.outerHeight());

				if(percentScroll == 1.0) {
					// self.trigger('scrollBottom', self);
				}
				if(percentScroll == 0.0) {
					// self.trigger('scrollTop', self);
				}

				//console.log([bar.position().top,me.outerHeight(),bar.outerHeight()]);
				//scroll content
				me.scrollTop(delta);

				//ensure bar is visible
				showBar();
			}
			var attachWheel = function() {
				if(window.addEventListener) {
					this.addEventListener('DOMMouseScroll', _onWheel, false);
					this.addEventListener('mousewheel', _onWheel, false);
				} else {
					document.attachEvent("onmousewheel", _onWheel)
				}
			}
			//attach scroll events
			attachWheel();

			var showBar = function() {
				clearTimeout(queueHide);
				bar.fadeIn('fast');
			}
			var hideBar = function() {
				queueHide = setTimeout(function() {
					if(!isOverBar && !isDragg) {
						bar.fadeOut('slow');
					}
				}, 1000);
			}
		},
		calculateScrollbarHeight : function() {
			var me = this.$me;
			var height = Math.max((me.outerHeight() / me[0].scrollHeight) * me.outerHeight(), this.options.minBarHeight);
			this.$bar.css({
				height : height + 'px'
			});
		},
		resizeContent : function() {
			if(this.$me && this.$bar) {
				this.$me.css({
					height : this.$el.outerHeight(),
					overflow : "hidden"
				});
				this.calculateScrollbarHeight();
			}
		}
	})

})();
