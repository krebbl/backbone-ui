(function() {

	UI.DateFieldView = UI.FieldView.extend({
		defaultOptions : {
			inputTemplate : 'fields/date_input',
			dateFormat : 'yyyy-MM-dd'
		},
		renderInputElement : function() {
			this.$day = this.$el.find('select.day').first();
			this.$month = this.$el.find('select.month').first();
			this.$year = this.$el.find('input.year').first();
			
			// render month names
			// this.renderDaySelection();
			this.renderMonthSelection();
			
			this.$day.attr({
				'id' : this.options.fieldId
			});
		},
		bindInputEvents : function() {
			var self = this;
			
			this.$day.bind('change', function() {
				self.onInputValueChange();				
			});
			this.$month.bind('change', function() {
				self.onInputMonthChange();
			});
			this.$year.bind('change', function() {
				self.onInputYearChange();
			});
		},
		onInputYearChange: function(){
			var year = parseInt(this.$year.val()); 
			this.onInputMonthChange();
		},
		onInputMonthChange: function(){
			var day = parseInt(this.$day.val());
			var month = parseInt(this.$month.val());
			var year = parseInt(this.$year.val()); 
			
			var days = Date.getDaysInMonth(year,month);
			this.renderDaySelection(days);
			if(day > days){
				this.$day.val(days);
			}else{
				this.$day.val(day);
			}
			
			this.onInputValueChange();
		},
		renderDaySelection: function(days){
			if(this.$day.children().length == days) return;
			this.$day.empty();
			var label = "";
			for(var i = 1; i <= days; i++){
				label = (i < 10) ? "0" + i : i;
				this.$day.append("<option value='"+i+"'>"+label+"</option>");
			}
			
		},
		renderMonthSelection: function(){
			this.$month.empty();
			var months = Date.CultureInfo.monthNames;
			var label = "";
			for(var i = 0; i < 12; i++){
				this.$month.append("<option value='"+i+"'>"+months[i]+"</option>");
			}
			
		},
		renderInputValue : function(value) {
			var date = Date.parseExact(value, this.options.dateFormat);
			if(!date) {
				throw "Couldn't parse Date. Please specify format!";
			}
			this.renderDaySelection(Date.getDaysInMonth(date.getFullYear(),date.getMonth()));
			
			this.$month.val(date.getMonth());
			this.$day.val(date.getDate());
			
			this.$year.val(date.getFullYear());
		},
		getValueForModel : function() {
			
			var v = {};
			var y = parseInt(this.$year.val()), m = parseInt(this.$month.val()), d = parseInt(this.$day.val());
			try {
				Date.validateDay(d, y, m);
			} catch(e) {
				return null;
			}
			var date = new Date(y,m,d);
			// to prevent char input in firefox
			if(date.toString() == "Invalid Date"){
				return null;
			}
			return date.toString(this.options.dateFormat);
		},
		getInputElement: function(){
			return this.$inputWrapper.find('select,input');
		}
	});

})();
