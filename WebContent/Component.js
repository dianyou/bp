sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"SolBP/model/models"
], function(UIComponent, Device, models, LocalUserDialog) {
	"use strict";

	return UIComponent.extend("SolBP.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
		}
	});

});