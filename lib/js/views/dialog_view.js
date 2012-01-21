(function() {

	UI.DialogView = UI.View.extend({
		defaultOptions : {
			title : '',
			template : 'dialog',
			modal : false,
			closable : true,
			closeOnEscape : true,
			draggable : true,
			headerSelector : '.dialog-header',
			titleSelector : '.dialog-header h3',
			footerSelector : '.dialog-footer',
			contentSelector : '.dialog-content',
			closeSelector : '.dialog-header .close',
			modalClass : 'modal-backdrop'
		},
		render : function() {
			this.childViews = [];

			this.$el = $(this.el);
			if(_.isUndefined(this.options.container)) {
				this.$container = $(document.body);
			} else {
				this.$container = $(this.options.container);
			}
			 
			
			this.$el.css({
				display: "none",
				top : '20%',	
				position : 'fixed',
				"z-index" : 10002
			});
			
			if(this.options.modal === true) {

				if(this.$container.has('.' + this.options.modalClass).length == 0) {
					this.$modal = $(document.createElement('div')).css({
						display : 'none',
						position : 'fixed',
						left : 0,
						right : 0,
						top : 0,
						bottom : 0,
						background : 'black',
						opacity : 0.5,
						"z-index" : 10001
					}).addClass(this.options.modalClass);
					this.$container.append(this.$modal);
				}else{
					this.$modal = this.$container.find('.' + this.options.modalClass).first();
				};
			}
			this.$container.append(this.$el);
			// layout the element
			this.layoutElement();
			
			// render the content
			this.renderInnerHTML(JST[this.options.template]({
				view : this
			}));
			
			this.renderClassName(this.className);
			this.renderVisible(this.options.visible);

			// render the content
			if(this.options.contentView) {
				this.renderChildView(this.options.contentView, this.$el.find(this.options.contentSelector));
			}

			// render the footer
			if(this.options.footerView) {
				this.renderChildView(this.options.footerView, this.$el.find(this.options.footerSelector));
			}

			if(this.options.draggable == true) {
				this.$el.draggable({
					containment : this.$container
				});
			}
			
			this.renderTitle(this.options.title);
			this.renderClosable(this.options.closable);
			
			// last but not least set the horizontal alignment
			var xOffset = 0;
			if(_.isUndefined(this.options.container)) {
				xOffset= $(document).width();
			} else {
				xOffset = (this.$container.width());
			}
			this.$el.css({left :  (xOffset / 2) - (this.$el.width() / 2)});
		},
		renderTitle : function(title) {
			this.$el.find(this.options.titleSelector).html(title);
		},
		renderClosable : function(closable) {
			if(this.options.closable === false) {
				this.$el.find(this.options.closeSelector).hide();
			}
		},
		setCloseOnEscape : function(closeOnEscape) {
			this.options.closeOnEscape = closeOnEscape;
		},
		bindEvents : function() {
			var self = this;
			if(this.options.closable === true) {
				this.$el.find(this.options.closeSelector).click(function() {
					self.close();
				});
				if(this.options.closeOnEscape === true) {
					if(!this.eventHandler) {
						var self = this;
						this.eventHandler = {
							keyUp : function(e) {
								switch (e.which) {
									case 27: self.close(); break;
								}
								self.trigger('keyUp', e, self);
							}
								
						}
					}
					$(document.body).keyup(this.eventHandler.keyUp);
				}
			}
		},
		renderContentView: function(view){
			// remove old
			if(this.options.contentView){
				this.removeChildView(this.options.contentView);
			}
			//  render it
			this.renderChildView(view,this.$el.find(this.options.contentSelector));
			
		},
		unbindEvents : function() {
			if(this.eventHandler) {
				$(document.body).unbind('keyup', this.eventHandler.keyUp);
			}
			this.$el.find(this.options.closeSelector).unbind('click');
		},
		close : function() {
			if(!this.isRendered()) return;
			this.unbindEvents();
			if(this.$modal){
				this.$modal.hide();
			}
			this.$el.hide();
			this.trigger('close', this);
		},
		open : function() {
			if(!this.isRendered()){
				this.render();
			}
			this.bindEvents();
			if(this.$modal){
				this.$modal.show();
			}
			this.$el.show();
			this.$el.focus();
			this.trigger('open', this);
		},
		triggerEnterPressed : function(){
			this.trigger('enterPressed',this);
		}
	});
	
	
	var createMessageBox = function(title, type, contentView, footerView){
		return new UI.DialogView({
				className : 'alert-dialog '+type,
				title : title,
				modal : true,
				contentView : contentView,
				footerView : footerView
			})
	}
	
	UI.DialogView.confirm = function(title, message, callback) {
		var self = this;
		self.callback = callback;
		if(!this.confirmDialog) {
			this.confirmLabel = new UI.View({
				tagName : 'p',
				innerHTML : message
			});
			
			var footerView = new UI.ContainerView({
					layout : false,
					childViews : [new UI.ButtonView({
						className: 'cancel',
						label : 'Nein',
						callbacks : {
							'click' : function() {
								self.confirmDialog.close();
								self.callback(false);
							}
						}
					}),new UI.ButtonView({
						className: 'confirm',
						label : 'Ja',
						callbacks : {
							'click' : function() {
								self.confirmDialog.close();
								self.callback(true);
							}
						}
					})]
				});
			
			this.confirmDialog = createMessageBox(title,"warning",this.confirmLabel, footerView)
		} else {
			this.confirmLabel.set({innerHTML: message, title: title});
		}
		this.confirmDialog.open();
	}

	UI.DialogView.alert = function(title, message, callback) {
		var self = this;
		self.callback = callback;
		if(!this.alertDialog) {
			this.alertLabel = new UI.View({
				tagName: 'p',
				innerHTML : message
			});
			
			var footerView = new UI.ContainerView({
					childViews : [new UI.ButtonView({
						className : 'right',
						label : 'Okay',
						callbacks : {
							'click' : function() {
								self.alertDialog.close();
								self.callback();
							}
						}
					})]
				});
			
			this.alertDialog = createMessageBox(title,"alert",this.alertLabel, footerView)
		} else {
			this.alertLabel.setInnerHTML(message);
			this.alertDialog.setTitle(title);
		}
		this.alertDialog.open();
	}

	UI.DialogView.info = function(title, message, callback) {
		var self = this;
		self.callback = callback;
		if(!this.infoDialog) {
			this.infoLabel = new UI.View({
				tagName: 'p',
				innerHTML : message
			});
			
			var footerView = new UI.ContainerView({
					layout : false,
					childViews : [new UI.ButtonView({
						className : 'right',
						label : 'Okay',
						callbacks : {
							'click' : function() {
								self.infoDialog.close();
								self.callback();
							}
						}
					})]
				});
			
			this.infoDialog = createMessageBox(title,"info",this.infoLabel, footerView)
		} else {
			this.infoLabel.set({innerHTML: message, title: title});
		}
		this.infoDialog.open();
	}
})();
