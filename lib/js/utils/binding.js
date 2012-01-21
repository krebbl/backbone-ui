(function(){
	UI.Binding = function(opt){
		this.init(opt);
	};
	
	UI.Binding.prototype = {
		event: 'change',
		callbacks: [],
		transform: function(val,model){
			return val;
		},
		init: function(opt){
			_.extend(this,opt);
		},
		// adds a callback to the model event 
		add: function(fnc, target){
			var cb = {
				fnc: this.createCallbackFnc(fnc,target),
				target: target
			}
			this.model.bind(this.getEventName(),cb.fnc,cb.target);
			
			this.callbacks.push(cb);
		},
		createCallbackFnc: function(fnc,target){
			var self = this;
			return function(model,value){
				fnc.call(target,self.transform(value,model));
			}
		},
		getEventName: function(){
			if(this.key != null){
				return this.event + ":" + this.key;
			}else{
				return this.event;
			}
		},
		// removes the callback
		remove: function(fnc){
			var self = this;
			_.each(this.callbacks, function(cb,i){
				if(cb.fnc == fnc){
					self.callbacks.slice(i,1);
				}
			});
			this.model.unbind(this.getEventName(),fnc);
		},
		removeByTarget: function(target){
			var self = this;
			var callback;
			_.each(this.callbacks, function(cb,i){
				if(cb.target == target){
					callback = cb;
					self.callbacks.slice(i,1);
				}
			});
			this.model.unbind(this.getEventName(),callback.fnc);
		},
		getValue: function(){
			if(this.key != null) {
				if(this.event == "change"){
					var val = this.model.get(this.key);
					return this.transform(val,this.model);
				}
			}
			return this.transform(null,this.model);
		},
		setValue: function(v,silent){
			if(_.isUndefined(silent)){
				var silent = true;
			}
			var s = {};
			s[this.key] = v;
			this.model.set(s,{silent: silent});
		},
		setModel : function(model){
			var self = this;
			var oldModel = this.model;
			this.model = model;
			_.each(this.callbacks,function(cb){
				oldModel.unbind('change:'+self.key,cb.fnc);
				self.add(cb.fnc,cb.target);
				self.model.trigger('change:'+self.key);
			});
		},
		trigger: function(){
			this.model.trigger('change:'+this.key);
		}
	}
})();
