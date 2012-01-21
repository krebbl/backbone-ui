(function() {
	UI.Locale = (function(data) {
		var data = {};

		return {
			init : function(d) {
				data = d;
			},
			localize : function(str) {
				if(!_.isUndefined(data[str])) {
					return data[str];
				}
				return str;
			}
		}

	}());
})();
