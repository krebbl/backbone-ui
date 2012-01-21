(function() {

	UI.RadioboxFieldView = UI.CheckboxFieldView.extend({
		optionSelector : 'input:radio',
		defaultOptions : {
			multiSelect : false,
			optionTemplate : 'fields/radiobox_input',
			valueKey : "value",
			labelKey : 'label'
		}
	});

})();
