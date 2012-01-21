// This is the annotated source code for
// [backboneUI],
//

/** @license VisualSearch.js 0.2.0
 *  (c) 2011 Marcus Krejpowicz, krebbl@gmail.com
 *  BackboneUI may be freely distributed under the MIT license.
 */

(function() {

	var $ = jQuery;
	// Handle namespaced jQuery

	// Setting up BackboneUI globals. These will eventually be made instance-based.
	if(!window.UI)
		window.UI = {};

	// Sets the version for BackboneUI to be used programatically elsewhere.
	UI.VERSION = '0.1.0';

	UI.lastID = 1;

	// create a unique ID for elements
	UI.createID = function() {
		return UI.lastID++;
	}
	// localize helper
	UI.loc = function(str) {
		return UI.Locale.localize(str);
	}
})();
