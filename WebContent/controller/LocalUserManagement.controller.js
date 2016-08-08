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

	return BaseController.extend("SolBP.controller.LocalUserManagement", {
			formatter: formatter,

			remoteserver: remoteserver,

			onInit : function () {
				var oDialogViewModel,
					oLocalUserViewModel,
					oTable = this.byId("table"),
					oModel = new JSONModel();
				this._oTable = oTable;
				this.setModel(oModel);
				this._oData = {
					UserInfo: "",
					RoleList: ""
				};

				var oTab = this.byId("idTabs");
				oTab.setSelectedKey("users");

				oDialogViewModel = new JSONModel({
					title: "",
					mode: "",
					busy: false,
					data: {
						SSOID: "",
						FirstName: "",
						LastName: "",
						Email: "",						
						Sex: "",
						BP: "SAP",
						Collections: []
					}					
				});
				this.setModel(oDialogViewModel, "dialogView");

				oLocalUserViewModel = new JSONModel({
					busy: true,
					countAssigned: 0,
					editEnabled: true
				});
				this.setModel(oLocalUserViewModel, "localUserView");

				this._updataLocalUser();
				
			},	

			onSelectionChange :  function(oEvent) {
				var oModel;
				var oSelectedItems = this._oTable.getSelectedItems();
				var oSelectedItemLength = oSelectedItems.length;         		
				var oDialogViewModel = this.getModel("dialogView");
				var oLocalUserViewModel = this.getModel("localUserView");								
				if(oSelectedItemLength > 1) {
					oLocalUserViewModel.setProperty("/editEnabled", false);
				} else if (oSelectedItemLength == 1) {
					oModel = oSelectedItems[0].getBindingContext().getObject();
					oLocalUserViewModel.setProperty("/editEnabled", true);
						oDialogViewModel.setProperty("/data", {
							SSOID: oModel.SSOID,
							FirstName: oModel.FirstName,
							LastName: oModel.LastName,
							Email: oModel.Email,
							Sex: oModel.Sex,
							Collections: oModel.Collections
						});
				} else {
					return;
				}
			},

			onAdd: function () {
				var oDialogViewModel = this.getModel("dialogView");
				oDialogViewModel.setProperty("/title", "Add a Local User");
				oDialogViewModel.setProperty("/mode", "add");
				oDialogViewModel.setProperty("/Salution", 0);
				oDialogViewModel.setProperty("/data", {
						SSOID: "",
						FirstName: "",
						LastName: "",
						Email: "",						
						Sex: "",
						BP: "SAP",
						Collections: []
				});
				this._oTable.removeSelections();
				this.onOpenDialog();
			},

			onEdit: function() {
				if(this._oTable.getSelectedItem() == null) {
					sap.m.MessageToast.show("Please select a user.");
					return;
				}
				var oDialogViewModel = this.getModel("dialogView");
				oDialogViewModel.setProperty("/title", "Edit");
				oDialogViewModel.setProperty("/mode", "edit");
				this.onOpenDialog();
			},

			onSubmit: function() {
				var oModel;
				var oDialogViewModel = this.getModel("dialogView");
				var oLocalUserViewModel = this.getModel("localUserView");
				var params = oDialogViewModel.getProperty("/data");

				if(oDialogViewModel.getProperty("/mode") == "add") {
					remoteserver.createLocalUser(params).done($.proxy(function(data){						
						this._getDialog().close();		
						sap.m.MessageToast.show("create successfully");
					}, this));	
				} else {
					remoteserver.editLocalUser(params).done($.proxy(function(data){						
						this._getDialog().close();		
						sap.m.MessageToast.show("edit successfully");
					}, this));
				}
				
				this._updataLocalUser();
			},

			onRemove: function(oEvent) {
				if(this._oTable.getSelectedItem() == null) {
					sap.m.MessageToast.show("Please select one user at least.");
					return;
				}
				var oLocalUserViewModel = this.getModel("localUserView");
				var params = {
					"list" : []
				};
				var oSelectedItems = this._oTable.getSelectedItems();
				var i = oSelectedItems.length;
				oLocalUserViewModel.setProperty("/busy", true);
				while(i--) {
					params.list.push({"SSOID": oSelectedItems[i].getBindingContext().getObject().SSOID});
				}
				
				remoteserver.deleteLocalUser(params).done($.proxy(function(data){						
					sap.m.MessageToast.show("delete successfully");
				}, this));
					
				this._updataLocalUser();
			},

			_updataLocalUser: function() {
				var oModel;
				var oLocalUserViewModel = this.getModel("localUserView");
				oLocalUserViewModel.setProperty("/busy", true);
				remoteserver.getLocalUser().done($.proxy(function(data){
					this._oData.UserInfo = data.UserInfo;
					oModel = this.getModel();	
					oModel.setData(this._oData);
					oLocalUserViewModel.setProperty("/busy", false);
					oLocalUserViewModel.setProperty("/countAssigned", data.UserInfo.length);		
				}, this));
			},

			_updateRoleList: function() {
				var oModel;
				remoteserver.getRoleList().done($.proxy(function(data){
					this._oData.RoleList = data.RoleList;
					oModel = this.getModel();	
					oModel.setData(this._oData);			
				}, this));
			},

			_getDialog : function () {
				if (!this._oDialog) {
					this._oDialog = sap.ui.xmlfragment("SolBP.view.LocalUserDialog", this);
					this.getView().addDependent(this._oDialog);
				}
				return this._oDialog;
			},

			onOpenDialog : function () {
				this._updateRoleList();
				this._getDialog().open();
				// document.getElementById("salutationComboBox-inner").disabled = true				
			},

			onCloseDialog : function () {
				this._getDialog().close();
			}
		});

	}
);
