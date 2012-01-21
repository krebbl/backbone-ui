(function(){var a=jQuery;if(!window.UI){window.UI={}}UI.VERSION="0.0.3";UI.lastID=1;UI.createID=function(){return UI.lastID++};UI.loc=function(b){return UI.Locale.localize(b)}})();(function(){UI.Binding=function(a){this.init(a)};UI.Binding.prototype={event:"change",callbacks:[],transform:function(b,a){return b},init:function(a){_.extend(this,a)},add:function(c,b){var a={fnc:this.createCallbackFnc(c,b),target:b};this.model.bind(this.getEventName(),a.fnc,a.target);this.callbacks.push(a)},createCallbackFnc:function(c,b){var a=this;return function(d,e){c.call(b,a.transform(e,d))}},getEventName:function(){if(this.key!=null){return this.event+":"+this.key}else{return this.event}},remove:function(b){var a=this;_.each(this.callbacks,function(c,d){if(c.fnc==b){a.callbacks.slice(d,1)}});this.model.unbind(this.getEventName(),b)},removeByTarget:function(b){var a=this;var c;_.each(this.callbacks,function(d,e){if(d.target==b){c=d;a.callbacks.slice(e,1)}});this.model.unbind(this.getEventName(),c.fnc)},getValue:function(){if(this.key!=null){if(this.event=="change"){var a=this.model.get(this.key);return this.transform(a,this.model)}}return this.transform(null,this.model)},setValue:function(b,a){if(_.isUndefined(a)){var a=true}var c={};c[this.key]=b;this.model.set(c,{silent:a})},setModel:function(b){var a=this;var c=this.model;this.model=b;_.each(this.callbacks,function(d){c.undbind("change:"+a.key,d.fnc);a.add(d.fnc,d.target);a.model.trigger("change:"+a.key)})},trigger:function(){this.model.trigger("change:"+this.key)}}})();(function(){UI.ErrorFieldRenderer=function(a,b){}})();(function(){UI.Locale=(function(a){var a={};return{init:function(b){a=b},localize:function(b){if(!_.isUndefined(a[b])){return a[b]}return b}}}())})();(function(){UI.LoadingMask={renderLoadingMask:function(a){if(_.isUndefined(a)){a="Lade Daten ..."}if(_.isUndefined(this.options.loadingMaskTemplate)){this.options.loadingMaskTemplate="loading_mask"}if(this.options.loadingMaskSelector){this.$loadingMask=this.$el.find(this.options.loadingMaskSelector)}else{this.$loadingMask=this.$el}if(!this.options.loadingMaskClasses){this.options.loadingMaskClasses="ui-tooltip-shadow ui-tooltip-dark ui-tooltip-rounded"}this.$loadingMask.qtip({content:{text:JST[this.options.loadingMaskTemplate]({text:a})},position:{my:"center",at:"center"},show:{event:false,},hide:false,style:{classes:this.options.loadingMaskClasses}})},showLoadingMask:function(){this.$loadingMask.qtip("show")},hideLoadingMask:function(){this.$loadingMask.qtip("hide")}}})();(function(){var a=jQuery;UI.View=Backbone.View.extend({bindings:{},defaultOptions:{},childViews:[],initialize:function(){this.options=_.extend({fitLayout:false,selectable:false,selected:false,templateRenderer:function(c,b){return JST[c]({view:b})}},this.defaultOptions,this.options);this.bindModelEvents();this.initCallbacks();this.initBindings()},bindModelEvents:function(){},initCallbacks:function(){var b=this;if(this.options.callbacks){_.each(this.options.callbacks,function(d,c){if(_.isFunction(d)){b.bind(c,d)}})}},initBindings:function(){var b=this;this.bindings={};_(this.options).each(function(d,e){var f=e.lastIndexOf("Binding");if(f>0){var c=e.substr(0,f);if(_.isFunction(d.add)){d.add(function(g){b.setOption(c,g)},b);b.setOption(c,d.getValue());b.bindings[c]=d}}})},render:function(){this.childViews=[];this.$el=a(this.el);this.$el.empty();if(_.isUndefined(this.options.container)){throw"No container to render!"}else{this.$container=a(this.options.container)}this.$container.append(this.$el);this.layoutElement();if(this.options.innerHTML){this.renderInnerHTML(this.options.innerHTML)}else{if(this.options.template){this.renderInnerHTML(this.options.templateRenderer(this.options.template,this))}}this.renderContent();this.renderClassName(this.className);this.renderVisible(this.options.visible);this.renderSelected(this.options.selected);this.renderSelectable(this.options.selectable);var b=this;this.$el.bind("click",function(c){b.trigger("click",c,b)});this.afterRender();this.trigger("afterRender",this)},renderClassName:function(b){this.$el.attr("class",b)},afterRender:function(){},renderTo:function(b){this.options.container=b;this.render()},layoutElement:function(){var b=this;if(this.options.fitLayout===true){this.$el.css({"float":"left",width:"100%",height:"100%",overflow:"hidden"});if(this.$container.context.nodeName=="BODY"){a(window).resize(function(c){b.resize()})}else{this.$container.resize(function(){b.resize()})}this.$el.resize(function(c){c.stopPropagation()})}else{if(this.options.height){this.$el.height(this.options.height)}if(this.options.width){this.$el.width(this.options.width)}}},resize:function(){if(this.isVisible()){this.$el.resize();this.resizeContent()}},resizeContent:function(){},isVisible:function(){return this.$el.is(":visible")},renderVisible:function(c){if(c===true){this.$el.show();this.trigger("afterShow");var b=this;b.resize()}else{if(c===false){this.trigger("beforeHide");this.$el.hide()}}},renderModel:function(b){this.render()},renderContent:function(){},renderChildView:function(c,e){if(_.isUndefined(e)){var e=this.$el}c.renderTo(e);this.childViews.push(c);var b=this;var d=["beforeHide","afterShow"];_.each(d,function(f){b.bind(f,function(){c.trigger(f)})})},removeChildView:function(b){var c=this;var d=-1;_.each(this.childViews,function(e,f){if(b==e){d=f}});if(d>-1){this.childViews.splice(d,1);b.remove()}},renderInnerHTML:function(b){if(_.isFunction(this.options.htmlRenderer)){b=this.options.htmlRenderer(b)}this.$el.html(b)},renderHeight:function(b){this.$el.height(b)},renderWidth:function(b){this.$el.width(b)},getHeight:function(){return this.$el.height()},getWidth:function(){return this.$el.width()},renderSelectable:function(c){if(c===true){var b=this;this.$el.bind("click.selected",function(){b.set({selected:!b.isSelected()})})}else{if(c===false){this.$el.unbind("click.select");this.set({selected:false})}}},isSelected:function(){return !_.isUndefined(this.options.selected)&&this.options.selected===true},renderSelected:function(b){if(this.options.selectable!==true){return}if(b===true){this.$el.addClass("selected")}else{if(b===false){this.$el.removeClass("selected")}}},hasOption:function(b){return !_.isUndefined(this.options[b])&&this.options[b]!=null},set:function(d,c){if(_.isObject(d)){var b=this;_.each(d,function(f,e){b.setOption(e,f,c)})}},setOption:function(b,e,c){var d;if(b=="className"||b=="model"||b=="collection"){d=this[b];this[b]=e}else{d=this.options[b];this.options[b]=e}this._renderOption(b,e,d);if(!c){this.trigger("change:"+b,this,e)}},_renderOption:function(b,d,c){if(!this.isRendered()){return}b=b[0].toUpperCase()+b.substr(1);var e="render"+b;if(_.isFunction(this[e])){this[e](d,c)}},get:function(b){return this.options[b]},has:function(b){return !_.isUndefined(this.options[b])},remove:function(){var b=this;_.each(this.bindings,function(c){c.removeByTarget(b)});while(this.childViews.length>0){this.removeView(this.childViews[0])}if(this.isRendered()){this.$el.remove();delete this.$el}},isRendered:function(){return !_.isUndefined(this.$el)},hasContainer:function(){return !_.isUndefined(this.options.container)},getBinding:function(b){return this.bindings[b]},focus:function(){this.$el.focus()}})})();(function(){UI.ListView=UI.View.extend({defaultOptions:{itemIdKey:"cid",selectable:false,multiSelect:false,needsSelection:false,hasLoadingMask:true},tagName:"ul",renderedItems:[],itemToView:null,renderContent:function(){var b=this;this.renderedItems=[];if(this.options.childViews){this.renderChildViews(this.options.childViews)}else{if(this.collection){this.renderCollection(this.collection)}else{if(this.options.items){this.renderItems(this.options.items)}}}if(this.options.needsSelection===true){if(this.getSelectedViews().length==0&&this.childViews.length>0){var a=this.childViews[0];a.set({selected:true})}}if(this.options.hasLoadingMask===true){this.renderLoadingMask()}},createListElement:function(){var b=this.$el.children("li");var a=$(document.createElement("li"));if(b.length==0){a.addClass("first")}b.last().removeClass("last");a.addClass("last");this.$el.append(a);return a},removeListElement:function(b){var a=$(this.$el.children().get(b));if(a.hasClass("first")){a.next().addClass("first")}else{if(a.hasClass("last")){a.prev().addClass("last")}}a.remove()},addView:function(a){var c=this.createListElement();if(_.isFunction(a.render)){this.renderChildView(a,c);var b=this;a.bind("change:selected",function(d,e){if(e===true){b.selectView(d)}else{if(e===false&&b.needsSelection===true){if(b.getSelectedViews().length==0){d.set({selected:true},true)}}}})}this.resize()},removeView:function(a){var b=this;var c=-1;_.each(this.childViews,function(e,d){if(e==a){a.remove();b.removeListElement(d);c=d}});if(c>-1){this.childViews.splice(c,1)}this.resize()},addItem:function(b){if(!_.isFunction(this.options.itemToView)){throw"No item to view function defined"}var a=this.options.itemToView(b);this.addView(a);this.renderedItems.push(b)},removeItem:function(c){var a=this.getViewByItem(c);if(a!=null){var b=this.getIndexOfView(a);this.removeView(a);if(b>-1){this.renderedItems.splice(b,1)}}},getViewByItem:function(b){var a=this.getIndexOfItem(b);if(a>-1){return this.childViews[a]}else{return null}},renderCollection:function(b,c){this.clearItems();var a=this;if(c){c.unbind("add",this.addItem,this);c.unbind("remove",this.removeItem,this);c.unbind("reset",this.renderCollection,this)}b.bind("add",this.addItem,this);b.bind("remove",this.removeItem,this);b.bind("reset",this.renderCollection,this);b.each(function(d){a.addItem(d)})},renderChildViews:function(b){var a=this;_.each(b,function(c){a.addView(c)})},renderItems:function(b){this.clearItems();var a=this;_.each(b,function(c){a.addItem(c)})},clearItems:function(){var a=this;while(this.renderedItems.length>0){this.removeItem(this.renderedItems[0])}},getSize:function(){return _.size(this.renderedItems)},selectItem:function(b){var a=this.getViewByItem(b);this.selectView(a)},selectView:function(a){var b=this;_.each(this.childViews,function(c,d){if(c!=a&&b.options.multiSelect!==true&&c.isSelected()){c.set({selected:false})}});this.set({selectedViews:this.getSelectedViews(),selectedItems:this.getSelectedItems()})},getSelectedItems:function(){var b=[];var a=this;_.each(this.renderedItems,function(d,c){if(a.childViews[c].isSelected()){b.push(d)}});return b},getSelectedViews:function(){var a=[];_.each(this.childViews,function(b,c){if(b.isSelected()){a.push(b)}});return a},getIndexOfView:function(a){var b=-1;_.each(this.childViews,function(c,d){if(c==a){b=d}});return b},getIndexOfItem:function(b){var a=-1;_.each(this.renderedItems,function(d,c){if(d==b){a=c;return}});return a}});_.extend(UI.ListView.prototype,UI.LoadingMask)})();(function(){UI.FieldView=UI.View.extend({tagName:"div",renderContent:function(){},bindModelEvents:function(){if(this.model&&this.options.field){var a=this;this.model.bind("change:"+this.options.field,this.onModelValueChange,a);this.model.bind("error",this.onModelError,a)}},renderContent:function(){this.options=_.extend({},{enable:true,silentChange:false,unsetOnDisable:false,errorRenderer:UI.FieldErrorRenderer,fieldTemplate:"field"},this.options);this.$el.html(JST[this.options.fieldTemplate]({view:this}));if(_.isUndefined(this.options.fieldId)){this.options.fieldId="field-"+UI.createID()}if(_.isUndefined(this.options.name)){this.options.name=this.options.fieldId}this.fieldID=this;this.$el.find("label").first().attr("for",this.options.fieldId);this.renderLabel(this.options.label);this.$inputWrapper=this.$el.find("div.input").first();if(this.options.inputTemplate){this.$inputWrapper.html(JST[this.options.inputTemplate]({view:this}))}this.renderInputElement();this.bindInputEvents();var a=this.options.value;if(this.model&&this.options.field){a=this.model.get(this.options.field)}this.renderValue(a);if(this.options.errors){this.renderError(this.options.error)}this.renderEnable(this.options.enable)},onInputValueChange:function(){var b=this.bindings.value;var c=this.getValueForModel();if(b){b.setValue(c,this.options.silentChange)}else{if(this.model&&this.options.field){if(c!=null){var a={};a[this.options.field]=c;this.model.set(a,{silent:this.options.silentChange})}else{if(this.options.unsetOnDisable===true){this.model.unset(this.options.field)}}}}this.options.value=c;this.trigger("valueChanged",this,c)},onModelValueChange:function(){this.set({value:this.model.get(this.options.field)})},renderValue:function(a){this.renderInputValue(a)},renderError:function(a){if(_.isUndefined(a)||a==null){this.$el.removeClass("has-error");this.$el.find(".error").first().html("")}else{this.$el.addClass("has-error");if(_.isArray(a)){a=a[0]}this.options.errorRenderer(this,a)}},onModelError:function(c,b){console.log("ERROR");if(!_.isUndefined(b)){var a=b[this.options.field];this.set({error:a})}},renderLabel:function(a){if(_.isUndefined(a)){a=""}this.$el.find("label").first().html(a)},renderEnable:function(a){if(!_.isFunction(this.getInputElement)){return}if(a===false){this.$el.addClass("disabled");this.getInputElement().attr("disabled","disabled");this.onInputValueChange();this.trigger("disable",this)}else{if(a===true){this.$el.removeClass("disabled");this.getInputElement().removeAttr("disabled");this.onInputValueChange();this.trigger("enable",this)}}},getValueForModel:function(){},renderInputElement:function(){},bindInputEvents:function(){},renderInputValue:function(a){}});UI.FieldErrorRenderer=function(a,b){a.$el.find(".error").html(b)}})();(function(){UI.ButtonView=UI.View.extend({tagName:"button",defaultOptions:{fitLayout:false,template:"button",label:"",selectable:true,labelSelector:"span.label"},renderContent:function(){if(this.hasIcon()){this.$el.addClass("has-icon")}else{this.$el.removeClass("has-icon")}},renderLabel:function(a){this.$el.find(this.options.labelSelector).first().html(a)},getLabel:function(){return this.options.label},hasLabel:function(){return this.hasOption("label")},hasIcon:function(){return this.hasOption("iconClass")},getIconClass:function(){return this.options.iconClass},renderIconClass:function(a){this.render()},renderEnable:function(a){if(a===true){this.$el.removeAttr("disabled")}else{if(a===false){this.$el.attr("disabled","disabled")}}}})})();(function(){UI.ContainerView=UI.ListView.extend({tagName:"div",createListElement:function(){return this.$el}})})();(function(){UI.DialogView=UI.View.extend({defaultOptions:{title:"",template:"dialog",modal:false,closable:true,closeOnEscape:true,draggable:true,headerSelector:".dialog-header",titleSelector:".dialog-header h3",footerSelector:".dialog-footer",contentSelector:".dialog-content",closeSelector:".dialog-header .close",modalClass:"modal-backdrop"},render:function(){this.childViews=[];this.$el=$(this.el);if(_.isUndefined(this.options.container)){this.$container=$(document.body)}else{this.$container=$(this.options.container)}this.$el.css({display:"none",top:"20%",position:"fixed","z-index":10002});if(this.options.modal===true){if(this.$container.has("."+this.options.modalClass).length==0){this.$modal=$(document.createElement("div")).css({display:"none",position:"fixed",left:0,right:0,top:0,bottom:0,background:"black",opacity:0.5,"z-index":10001}).addClass(this.options.modalClass);this.$container.append(this.$modal)}else{this.$modal=this.$container.find("."+this.options.modalClass).first()}}this.$container.append(this.$el);this.layoutElement();this.renderInnerHTML(JST[this.options.template]({view:this}));this.renderClassName(this.className);this.renderVisible(this.options.visible);if(this.options.contentView){this.renderChildView(this.options.contentView,this.$el.find(this.options.contentSelector))}if(this.options.footerView){this.renderChildView(this.options.footerView,this.$el.find(this.options.footerSelector))}if(this.options.draggable==true){this.$el.draggable({containment:this.$container})}this.renderTitle(this.options.title);this.renderClosable(this.options.closable);var b=0;if(_.isUndefined(this.options.container)){b=$(document).width()}else{b=(this.$container.width())}this.$el.css({left:(b/2)-(this.$el.width()/2)})},renderTitle:function(b){this.$el.find(this.options.titleSelector).html(b)},renderClosable:function(b){if(this.options.closable===false){this.$el.find(this.options.closeSelector).hide()}},setCloseOnEscape:function(b){this.options.closeOnEscape=b},bindEvents:function(){var b=this;if(this.options.closable===true){this.$el.find(this.options.closeSelector).click(function(){b.close()});if(this.options.closeOnEscape===true){if(!this.eventHandler){var b=this;this.eventHandler={keyUp:function(c){switch(c.which){case 27:b.close();break}b.trigger("keyUp",c,b)}}}$(document.body).keyup(this.eventHandler.keyUp)}}},renderContentView:function(b){if(this.options.contentView){this.removeChildView(this.options.contentView)}this.renderChildView(b,this.$el.find(this.options.contentSelector))},unbindEvents:function(){if(this.eventHandler){$(document.body).unbind("keyup",this.eventHandler.keyUp)}this.$el.find(this.options.closeSelector).unbind("click")},close:function(){if(!this.isRendered()){return}this.unbindEvents();if(this.$modal){this.$modal.hide()}this.$el.hide();this.trigger("close",this)},open:function(){if(!this.isRendered()){this.render()}this.bindEvents();if(this.$modal){this.$modal.show()}this.$el.show();this.$el.focus();this.trigger("open",this)},triggerEnterPressed:function(){this.trigger("enterPressed",this)}});var a=function(e,b,c,d){return new UI.DialogView({className:"alert-dialog "+b,title:e,modal:true,contentView:c,footerView:d})};UI.DialogView.confirm=function(e,c,f){var b=this;b.callback=f;if(!this.confirmDialog){this.confirmLabel=new UI.View({tagName:"p",innerHTML:c});var d=new UI.ContainerView({layout:false,childViews:[new UI.ButtonView({className:"cancel",label:"Nein",callbacks:{click:function(){b.confirmDialog.close();b.callback(false)}}}),new UI.ButtonView({className:"confirm",label:"Ja",callbacks:{click:function(){b.confirmDialog.close();b.callback(true)}}})]});this.confirmDialog=a(e,"warning",this.confirmLabel,d)}else{this.confirmLabel.set({innerHTML:c,title:e})}this.confirmDialog.open()};UI.DialogView.alert=function(e,c,f){var b=this;b.callback=f;if(!this.alertDialog){this.alertLabel=new UI.View({tagName:"p",innerHTML:c});var d=new UI.ContainerView({childViews:[new UI.ButtonView({className:"right",label:"Okay",callbacks:{click:function(){b.alertDialog.close();b.callback()}}})]});this.alertDialog=a(e,"alert",this.alertLabel,d)}else{this.alertLabel.setInnerHTML(c);this.alertDialog.setTitle(e)}this.alertDialog.open()};UI.DialogView.info=function(e,c,f){var b=this;b.callback=f;if(!this.infoDialog){this.infoLabel=new UI.View({tagName:"p",innerHTML:c});var d=new UI.ContainerView({layout:false,childViews:[new UI.ButtonView({className:"right",label:"Okay",callbacks:{click:function(){b.infoDialog.close();b.callback()}}})]});this.infoDialog=a(e,"info",this.infoLabel,d)}else{this.infoLabel.set({innerHTML:c,title:e})}this.infoDialog.open()}})();(function(){UI.FieldsetView=UI.View.extend({tagName:"fieldset",renderContent:function(){if(this.options.legend){this.$el.append($(document.createElement("legend")).html(this.options.legend))}this.renderChildView(this.options.contentView)}})})();(function(){UI.ImageView=UI.View.extend({tagName:"img",defaultOptions:{src:"blank",},renderContent:function(){this.renderSrc(this.options.src);this.renderAlt(this.options.alt)},renderSrc:function(a){this.$el.attr("src",a)},renderAlt:function(a){if(_.isUndefined(a)){this.$el.removeAttr("alt")}else{this.$el.attr("alt",a)}}})})();(function(){UI.LinkView=UI.ButtonView.extend({tagName:"a",defaultOptions:{fitLayout:false,template:"link",label:"",toggle:false,labelSelector:"span.label"},renderContent:function(){this.renderSelected(this.options.selected);this.renderHref(this.options.href);this.renderLinkTarget(this.options.linkTarget);this.set({menuView:this.options.menuView})},renderHref:function(a){if(_.isUndefined(a)){a="#";this.$el.attr("onclick","return false;")}else{this.$el.removeAttr("onclick")}this.$el.attr("href",a)},renderLinkTarget:function(a){if(!this.has("href")){this.$el.removeAttr("target");this.options.linkTarget="";return}if(_.isUndefined(a)){this.$el.removeAttr("target")}else{this.$el.attr("target",a)}},renderMenuView:function(a){var b=this;this.removeChildView(this.options.menuView);if(a){var b=this;this.renderChildView(a,this.$el.parent());this.$el.parent().addClass("dropdown");this.$el.bind("click.dropdown",function(d){if(d){d.stopPropagation();d.preventDefault()}var c=b.$el.parent();c.toggleClass("open")});$(document.body).bind("click.dropdown"+this.cid,function(c){b.$el.parent().removeClass("open")})}else{this.$el.parent().removeClass("dropdown");this.$el.unbind("click.dropdown");$(document.body).unbind("click.dropdown"+this.cid)}this.options.menuView=a}})})();(function(){UI.ModelErrorsView=UI.View.extend({defaultOptions:{template:"message_box",messageSelector:"p",errorFormatter:function(b,a){if(_.isArray(a)||_.isObject(a)){return _.size(a)+" errors"}else{if(_.isString(a)){return a}}return""}},bindModelEvents:function(){if(this.model){this.model.bind("error",this.onModelError,this)}},afterRender:function(){this.setVisible(false);this.setError(this.model.error)},onModelError:function(b,a){if(a&&(_.isString(a)||_.size(a)>0)){this.setError(a);this.setVisible(true)}else{this.setVisible(false)}},setError:function(a){this.options.error=a;if(!this.isRendered()){return}this.$el.find("p").html(this.options.errorFormatter(this.model,a))}})})();(function(){UI.ScrollView=UI.View.extend({defaultOptions:{contentView:null,minBarHeight:30},renderContent:function(){var j=this;var y=$(document.createElement("div"));this.$me=y;this.$el.append(y);var d=this.options.contentView;if(d){this.renderChildView(d,y);d.$el.resize(function(){j.calculateScrollbarHeight()})}y.css({height:this.$el.outerHeight(),overflow:"hidden"});var v,q,f,k,g="<div></div>",s=30,m=30,l=l||{},r=l.width||"auto",n=l.height||"250px",i=l.size||"7px",p=l.color||"#000",z=l.position||"right",e=l.opacity||0.4;this.$el.css({position:"relative",overflow:"hidden"});this.$rail=$(g).css({width:"15px",height:"100%",position:"absolute",top:0});this.$bar=$(g).attr({"class":"slimScrollBar ",style:"border-radius: "+i}).css({background:p,width:i,position:"absolute",top:0,opacity:e,display:"none",BorderRadius:i,MozBorderRadius:i,WebkitBorderRadius:i,zIndex:99});var a=this.$rail;var t=this.$bar;var b=(z=="right")?{right:"1px"}:{left:"1px"};this.$rail.css(b);this.$bar.css(b);this.calculateScrollbarHeight();this.$el.append(this.$bar);this.$el.append(this.$rail);this.$bar.draggable({axis:"y",containment:"parent",start:function(){f=true},stop:function(){f=false;h()},drag:function(o){u(0,$(this).position().top,false)}});y.hover(function(){v=true;c()},function(){v=false;h()});var x=function(o){if(!v){return}var o=o||window.event;var A=0;if(o.wheelDelta){A=-o.wheelDelta/120}if(o.detail){A=o.detail/3}u(0,A,true);if(o.preventDefault){o.preventDefault()}o.returnValue=false};var u=function(o,D,A){var C=D;if(A){C=t.position().top+D*m;C=Math.max(C,0);var B=y.outerHeight()-t.outerHeight();C=Math.min(C,B);t.css({top:C+"px"})}percentScroll=parseInt(t.position().top)/(y.outerHeight()-t.outerHeight());C=percentScroll*(y[0].scrollHeight-y.outerHeight());if(percentScroll==1){}if(percentScroll==0){}y.scrollTop(C);c()};var w=function(){if(window.addEventListener){this.addEventListener("DOMMouseScroll",x,false);this.addEventListener("mousewheel",x,false)}else{document.attachEvent("onmousewheel",x)}};w();var c=function(){clearTimeout(k);t.fadeIn("fast")};var h=function(){k=setTimeout(function(){if(!q&&!f){t.fadeOut("slow")}},1000)}},calculateScrollbarHeight:function(){var b=this.$me;var a=Math.max((b.outerHeight()/b[0].scrollHeight)*b.outerHeight(),this.options.minBarHeight);this.$bar.css({height:a+"px"})},resizeContent:function(){if(this.$me&&this.$bar){this.$me.css({height:this.$el.outerHeight(),overflow:"hidden"});this.calculateScrollbarHeight()}}})})();(function(){UI.SegmentedView=UI.View.extend({defaultOptions:{fitLayout:true},renderContent:function(){},renderVisibleView:function(a){_.each(this.childViews,function(b){if(b!=a&&b.isVisible()){b.set({visible:false})}});if(!_.include(this.childViews,a)){this.renderChildView(a)}else{if(this.currentView!=a){a.set({visible:true})}}this.currentView=a},getCurrentView:function(){return this.currentView}})})();(function(){Backbone.Model.prototype.toSlickItem=function(){var f={};_.extend(f,this.attributes);var b=this;for(var a in this){if(a.length>3){var e=this[a];if(_.isFunction(e)){var d=a.indexOf("get");if(d>-1){var c=a.substr(3);c=c[0].toLowerCase()+c.substr(1);f[c]=this[a]()}}}}return f};UI.SlickGridView=UI.View.extend({defaultOptions:{itemIdKey:"id",selection:new Backbone.Collection(),columns:[],loadingMaskSelector:".slick-viewport"},bindModelEvents:function(){if(this.collection){this.collection.bind("change",this.onChange,this);this.collection.bind("add",this.onAddModel,this);this.collection.bind("remove",this.onRemoveModel,this);this.collection.bind("reset",this.onCollectionReset,this);this.collection.bind("fetch",this.showLoadingMask,this);this.collection.bind("dataFetched",this.hideLoadingMask,this)}},renderContent:function(){console.log("Render Content");var e=this.options.selection;var b=this;var g=new Slick.Data.DataView();if(this.collection){this.options.items=[];this.collection.each(function(h){b.options.items.push(h.toSlickItem())})}g.setItems(this.options.items);var f=this.collection;var c={enableAsyncPostRender:true,asyncPostRenderDelay:10,forceFitColumns:true,multiSelect:true};var a=[];var d=new Slick.Grid(this.$el,g.rows,this.options.columns,c);d.onSelectedRowsChanged=function(){a=[];selectedModels=[];var m=d.getSelectedRows();for(var j=0,h=m.length;j<h;j++){var k=g.rows[m[j]];if(k){a.push(k.id);selectedModels.push(f.get(k.id))}}e.reset(selectedModels)};d.onKeyDown=function(i,h){b.trigger("keyDown",i,b.collection.get(g.rows[h][b.options.itemIdKey]));return false};d.onSort=function(h,i){sortdir=i?1:-1;sortcol=h.field;g.fastSort((h.sortFn)?h.sortFn:sortcol,i)};d.onDblClick=function(h,i){b.trigger("doubleClick",b.collection.get(g.rows[i][b.options.itemIdKey],h));return true};d.onClick=function(h,i){b.trigger("click",b.collection.get(g.rows[i][b.options.itemIdKey],h));return false};g.onRowsChanged.subscribe(function(k){d.removeRows(k);d.render();if(a.length>0){var l=[];for(var j=0;j<a.length;j++){var h=g.getRowById(a[j]);if(h!=undefined){l.push(h)}}d.setSelectedRows(l)}});d.onContextMenu=function(i,j,h){d.setSelectedRows([j]);return true};this.dataView=g;this.grid=d;this.renderLoadingMask("Lade Daten ...");this.unbind("afterShow");this.bind("afterShow",function(){b.afterShow()});this.unbind("beforeHide");this.bind("beforeHide",function(){b.beforeHide()})},resizeContent:function(){},createColumns:function(){var a=[];_.each(this.options.columns,function(b){var h=b;var d=b.field.indexOf(".");if(d>0){var j=b.field.split(".");var i=function(){var k=this;for(var l=0;l<j.length&&!_.isUndefined(k)&&k!=null;l++){k=k[j[l]]}if(!_.isUndefined(k)&&k!=null){return k.toString().toLowerCase()}return""};var e=b.field.split(".");var f=e.shift();var c=b.formatter;var g=function(m,n,k){for(var l=0;l<e.length&&!_.isUndefined(k)&&k!=null;l++){k=k[e[l]]}if(c){return c(m,n,k)}return k};h.field=f;h.formatter=g;h.sortFn=i}a.push(h)});return a},_getItemId:function(a){if(this._isModelItem(a)){return a.get(itemIdKey)}return a[itemIdKey]},_getItemData:function(a){if(this._isModelItem(a)){return a.toSlickItem()}return a},_isModelItem:function(a){return _.isFunction(a.toJSON)},onChange:function(a){this.dataView.beginUpdate();this.dataView.updateItem(a.get(this.options.itemIdKey),a.toSlickItem());this.dataView.endUpdate()},onCollectionReset:function(){var a=[];this.collection.each(function(b){a.push(b.toSlickItem())});this.dataView.beginUpdate();this.dataView.setItems(a);this.dataView.endUpdate()},onAddModel:function(a){this.dataView.beginUpdate();this.dataView.addItem(a.toSlickItem());this.dataView.endUpdate()},onRemoveModel:function(a){this.dataView.beginUpdate();this.dataView.deleteItem(a.get(this.options.itemIdKey));this.dataView.endUpdate()},addItem:function(a){this.dataView.beginUpdate();this.dataView.addItem(this._getItemData(a));this.dataView.endUpdate()},removeItem:function(a){this.dataView.beginUpdate();this.dataView.deleteItem(this._getItemId(a));this.dataView.endUpdate()},setItems:function(a){this.dataView.beginUpdate();this.dataView.setItems(a);this.dataView.endUpdate()},updateItem:function(a){this.dataView.beginUpdate();this.dataView.updateItem(this._getItemId(a),this._getItemValue(a));this.dataView.endUpdate()},getSize:function(){return this.collection.size()},getSelectedItems:function(){return this.selection.models},getSelection:function(){return this.selection},afterShow:function(){var a=this;window.setTimeout(function(){a.$el.find(".slick-viewport").scrollTop(a.scrollTop)},400)},beforeHide:function(){var a=this.$el.find(".slick-viewport").first();this.scrollTop=a.scrollTop()},focus:function(){this.$el.find(".grid-canvas").focus()}});_.extend(UI.SlickGridView.prototype,UI.LoadingMask)})();(function(){UI.SplitView=UI.View.extend({defaultOptions:{fitLayout:true,leftViewWidth:200,leftView:new UI.View({}),rightView:new UI.View({innerHTML:"Content"}),resizable:true},renderContent:function(){this.renderChildView(this.options.leftView);this.options.leftView.$el.css({height:this.$el.height(),"float":"left",width:this.options.leftViewWidth,top:"0px",left:"0px"});this.renderChildView(this.options.rightView);this.options.rightView.$el.css({height:this.$el.height(),"float":"left"});if(this.options.resizable){this.options.leftView.$el.resizable({containment:this.$el,minWidth:100,handles:"e"})}this.layoutElements()},layoutElements:function(){var a=this;this.options.leftView.$el.resize(function(b){a.resizeRightView()});this.resizeContent()},resizeContent:function(){var a=this.getHeight();this.options.leftView.set({height:a});this.options.rightView.set({height:a});this.options.leftView.resize()},resizeRightView:function(){var a=this.getWidth()-this.options.leftView.getWidth();this.options.rightView.set({width:a});this.options.rightView.resize()}})})();(function(){UI.TabView=UI.View.extend({defaultOptions:{linkListView:new UI.ListView({className:"tabs",itemToView:function(a){var b="";if(a.has("title")){b=a.get("title")}return new UI.LinkView({selectable:true,label:b})}}),segmentedView:new UI.SegmentedView({fitLayout:false,className:"tab-content"}),emptyView:new UI.View({}),tabViews:[]},renderContent:function(){this.renderedTabViews=[];this.options.linkListView.set({multiSelect:false,needsSelection:true,items:this.options.tabViews});this.renderChildView(this.options.linkListView);this.renderChildView(this.options.segmentedView);var a=this;this.options.linkListView.bind("change:selectedItems",function(b,c){a.showTabView(c[0])});if(this.options.tabViews.length>0){this.showTabView(this.options.tabViews[0])}},showTabView:function(a){if(this.options.linkListView.getSelectedItems()[0]!=a){this.options.linkListView.selectItem(a)}this.options.segmentedView.set({visibleView:a})},setTabViews:function(a){var b=this;_.each(this.renderedTabViews,function(c){b.removeTabView(c)});_.each(a,function(c){b.addTabView(c)});this.options.tabViews=a},addTabView:function(a){this.options.linkListView.addItem(a);this.renderedTabViews.push(a)},removeTabView:function(a){var c=-1;_.each(this.renderedTabViews,function(d,e){if(d==a){c=e}});if(c==-1){return}this.options.linkListView.removeItem(a);this.renderedTabViews.slice(c,1);if(a==this.options.segmentedView.getCurrentView()){var b;if(this.renderedTabViews.length>0){if(c>=this.renderedTabViews.length){c=this.renderedTabViews.length-1}b=this.renderedTabViews[c]}else{b=this.options.emptyView}this.options.segmentedView.setVisibleView(b)}}})})();(function(){UI.WorkspaceView=UI.View.extend({defaultOptions:{fitLayout:true,topViewHeight:40,bottomViewHeight:40,contentView:new UI.View()},renderContent:function(){this.contentView=(!this.options.contentView?null:this.options.contentView);this.topView=(!this.options.topView?null:this.options.topView);this.bottomView=(!this.options.bottomView?null:this.options.bottomView);if(this.topView){this.renderChildView(this.topView)}if(this.contentView){this.renderChildView(this.contentView)}if(this.bottomView){this.renderChildView(this.bottomView)}this.layoutElements()},layoutElements:function(){this.$el.css({position:"relative"});var a;if(this.topView){a=this.options.topViewHeight;this.topView.set({height:a})}var b=this;if(this.bottomView){a=this.options.bottomViewHeight;this.bottomView.$el.css({position:"absolute",bottom:0,left:0,right:0,height:a})}this.resizeContent()},calculateContentHeight:function(){var a=this.getHeight();if(this.topView){a-=this.options.topViewHeight}if(this.bottomView){a-=this.options.bottomViewHeight}return a},resizeContent:function(){this.contentView.set({height:this.calculateContentHeight()});this.contentView.resize()}})})();(function(){UI.CheckboxFieldView=UI.FieldView.extend({optionSelector:"input:checkbox",selectionAttribute:"checked",defaultOptions:{multiSelect:true,optionTemplate:"fields/checkbox_input",valueKey:"value",labelKey:"label"},getValueForModel:function(){var b={};var d;var e=this.getOptionElements();var c=e.size();var a=this;d=[];e.each(function(g){if($(this).attr(a.selectionAttribute)){var f=a.options.items[g][a.options.valueKey];if(a.options.multiSelect){d.push(f)}else{d=f}}else{if(c==1){d=(f==a.options.items[g][a.options.valueKey])}}});return d},renderInputElement:function(){this.renderItems(this.options.items)},bindInputEvents:function(){var a=this;this.getInputElement().bind("change",function(){a.onInputValueChange()})},renderInputValue:function(b){var a=this;this.getOptionElements().each(function(d){var f=$(this);var c=false;var e=a.options.items[d][a.options.valueKey];if(a.options.multiSelect===true&&_.isArray(b)){c=_.contains(b,e)}else{c=(e==b)}if(c===true){f.attr(a.selectionAttribute,a.selectionAttribute)}else{if(f.attr(a.selectionAttribute)){f.removeAttr(a.selectionAttribute)}}})},renderItems:function(b){if(this.isRendered()){this.getOptionElements().remove();var a=this;_.each(this.options.items,function(d){a.renderItem(d)});var c=this.getInputElement();c.attr("name",this.options.name);this.$input=c}this.options.items=b},renderItem:function(a){this.$inputWrapper.append(JST[this.options.optionTemplate]({label:a[this.options.labelKey],value:a[this.options.valueKey],item:a}))},getInputElement:function(){return this.$inputWrapper.find(this.optionSelector)},getOptionElements:function(){return this.$inputWrapper.find(this.optionSelector)}})})();(function(){UI.DateFieldView=UI.FieldView.extend({defaultOptions:{inputTemplate:"fields/date_input",dateFormat:"yyyy-MM-dd"},renderInputElement:function(){this.$day=this.$el.find("select.day").first();this.$month=this.$el.find("select.month").first();this.$year=this.$el.find("input.year").first();this.renderMonthSelection();this.$day.attr({id:this.options.fieldId})},bindInputEvents:function(){var a=this;this.$day.bind("change",function(){a.onInputValueChange()});this.$month.bind("change",function(){a.onInputMonthChange()});this.$year.bind("change",function(){a.onInputYearChange()})},onInputYearChange:function(){var a=parseInt(this.$year.val());this.onInputMonthChange()},onInputMonthChange:function(){var a=parseInt(this.$day.val());var c=parseInt(this.$month.val());var b=parseInt(this.$year.val());var d=Date.getDaysInMonth(b,c);this.renderDaySelection(d);if(a>d){this.$day.val(d)}else{this.$day.val(a)}this.onInputValueChange()},renderDaySelection:function(c){if(this.$day.children().length==c){return}this.$day.empty();var a="";for(var b=1;b<=c;b++){a=(b<10)?"0"+b:b;this.$day.append("<option value='"+b+"'>"+a+"</option>")}},renderMonthSelection:function(){this.$month.empty();var a=Date.CultureInfo.monthNames;var b="";for(var c=0;c<12;c++){this.$month.append("<option value='"+c+"'>"+a[c]+"</option>")}},renderInputValue:function(b){var a=Date.parseExact(b,this.options.dateFormat);if(!a){throw"Couldn't parse Date. Please specify format!"}this.renderDaySelection(Date.getDaysInMonth(a.getFullYear(),a.getMonth()));this.$month.val(a.getMonth());this.$day.val(a.getDate());this.$year.val(a.getFullYear())},getValueForModel:function(){var b={};var h=parseInt(this.$year.val()),a=parseInt(this.$month.val()),g=parseInt(this.$day.val());try{Date.validateDay(g,h,a)}catch(f){return null}var c=new Date(h,a,g);if(c.toString()=="Invalid Date"){return null}return c.toString(this.options.dateFormat)},getInputElement:function(){return this.$inputWrapper.find("select,input")}})})();(function(){UI.RadioboxFieldView=UI.CheckboxFieldView.extend({optionSelector:"input:radio",defaultOptions:{multiSelect:false,optionTemplate:"fields/radiobox_input",valueKey:"value",labelKey:"label"}})})();(function(){UI.SelectFieldView=UI.CheckboxFieldView.extend({optionSelector:"option",selectionAttribute:"selected",defaultOptions:{inputTemplate:"fields/select_input",multiSelect:false,valueKey:"value",labelKey:"label"},renderInputElement:function(){this.$select=this.$el.find("select").first();this.$select.attr({id:this.options.fieldId,name:this.options.name});if(this.options.multiSelect===true){this.$select.attr("multiple","multiple")}this.renderItems(this.options.items)},renderItem:function(a){this.$select.append("<option value='"+a[this.options.valueKey]+"'>"+UI.loc(a[this.options.labelKey])+"</option>")},bindInputEvents:function(){var a=this;this.$select.bind("change",function(){a.onInputValueChange()})},getInputElement:function(){return this.$select},getOptionElements:function(){return this.$select.find("option")}})})();(function(){UI.TextFieldView=UI.FieldView.extend({defaultOptions:{inputTemplate:"fields/text_input",type:"text",placeholder:""},getValueForModel:function(){if(this.$input.attr("disabled")){return null}return this.$input.val()},renderInputElement:function(){this.$input=this.$el.find("input").first();this.$input.attr({id:this.options.fieldId,name:this.options.name,placeholder:this.options.placeholder})},bindInputEvents:function(){var a=this;this.$input.bind("change",function(){a.onInputValueChange()})},renderInputValue:function(a){this.$el.find("input").first().val(a)},getType:function(){return this.options.type},getInputElement:function(){return this.$input}})})();(function(){UI.TextareaFieldView=UI.FieldView.extend({defaultOptions:{inputTemplate:"fields/textarea_input",rows:3},getValueForModel:function(){if(this.$textarea.attr("disabled")){return null}return this.$textarea.html()},renderInputElement:function(){this.$textarea=this.$el.find("textarea").first();this.$textarea.attr({id:this.options.fieldId,name:this.options.name})},bindInputEvents:function(){var a=this;this.$textarea.bind("change",function(){a.onInputValueChange()})},renderInputValue:function(a){this.$textarea.html(a)},getType:function(){return this.options.type},getInputElement:function(){return this.$textarea},getRows:function(){return this.options.rows}})})();