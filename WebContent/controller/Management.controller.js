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

	return BaseController.extend("SolBP.controller.Management", {
			formatter: formatter,

			remoteserver: remoteserver,

			onInit : function () {
				var oViewModel = new JSONModel({busy : true}),
					oList = this.byId("list");
				this.setModel(oViewModel, "managementView");
				this._oList = oList;

				remoteserver.getMembers().done($.proxy(function(data){
					var oModel = new JSONModel(data);	
					this.setModel(oModel);				
					var oBinding = this._oList.getBinding("items");
					var oFilter = new Filter("status", "EQ", "joined");
					oBinding.filter([oFilter]);	
					
					oViewModel = this.getModel("managementView");
					oViewModel.setProperty("/busy", false);
				}, this));				
					
									
			},

			onInvitePress: function(){
				// this.getRouter().navTo("invitation");
				this.getRouter().getTargets().display("invitation", {
					fromTarget : "management"
				});
			},

			handleIconTabBarSelect: function (oEvent) {
				var oBinding = this._oList.getBinding("items"),
					sKey = oEvent.getParameter("key"),
					oFilter;
				if (sKey === "joined") {
					oFilter = new Filter("status", "EQ", "joined");
					oBinding.filter([oFilter]);
				} else if (sKey === "pending") {
					oFilter = new Filter("status", "EQ", "pending");
					oBinding.filter([oFilter]);
				} else if (sKey === "expired") {
					oFilter = new Filter("status", "EQ", "expired");
					oBinding.filter([oFilter]);
				} else {
					oBinding.filter([]);
				}
			},

			onSearch : function (oEvt) {
				// add filter for search
				var aFilters = [];
				var sQuery = oEvt.getSource().getValue();
				if (sQuery && sQuery.length > 0) {
					var filter = new Filter("name", sap.ui.model.FilterOperator.Contains, sQuery);
					aFilters.push(filter);
				}

				// update list binding				
				var binding = this._oList.getBinding("items");
				binding.filter(aFilters, "Application");
			},
			
		});

	}
);
