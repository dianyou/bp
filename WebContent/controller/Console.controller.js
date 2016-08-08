sap.ui.define([
	'jquery.sap.global',
	"SolBP/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/Filter',
	"sap/ui/core/routing/History",
	"SolBP/model/formatter",
	"SolBP/service/remoteserver"
], function(jQuery, BaseController, JSONModel, Filter, History, formatter, remoteserver) {
	"use strict";

	return BaseController.extend("SolBP.controller.Console", {
			formatter: formatter,

			remoteserver: remoteserver,

			onInit : function () {
				var param = window.location.href.split("?");
				if(param.length == 2){
					var paramV = param[1].split("=")[1];
					var paramObj = {name: paramV};
					remoteserver.sendFeedback(paramObj).done($.proxy(function(data){
						console.log("feedback sent.");
					}, this));
				}
			},			
			
			press : function(evt) {
				sap.m.MessageToast.show("Tile is pressed.");
			}
		});

	}
);
