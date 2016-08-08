sap.ui.define([
	'jquery.sap.global',
	"SolBP/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/Filter',
	"sap/ui/core/routing/History",
	"SolBP/model/formatter",
	"SolBP/service/remoteserver"
], function(jQuery, BaseController, JSONModel,Filter, History, formatter, remoteserver) {
	"use strict";

	return BaseController.extend("SolBP.controller.Invitation", {
			formatter: formatter,

			onInit : function () {
				var oList = this.byId("list"),
					oModel = new JSONModel(),
					oViewModel = new JSONModel({busy : true}),
					oCheckModel = new JSONModel({selected: ""});

				this._oList = oList;

				this._inviteParams = {
					members: [],
					period: ''
				};	

				this.setModel(oModel);	

				this.setModel(oViewModel, "invitationView");

				oCheckModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);	
				this.setModel(oCheckModel, "checkView");

				remoteserver.getMembers().done($.proxy(function(data){
					oModel = this.getModel();	
					oModel.setData(data);		
					var oViewModel = this.getModel("invitationView");
					oViewModel.setProperty("/busy", false);		
				}, this));	
								
			},		

			onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash();

				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					// this.getRouter().navTo("management", {}, true);
					this.getRouter().getTargets().display("management", {}, true);
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

			onInvitePress: function() {
				/*var period = {
					"12 hours": "12",
					"24 hours": "24",
					"1 week": "168",
					"No limit": "-1"
				};
				var periodkey = this.byId('periodList').getSelectedItem().mAggregations.content[0].getProperty("text");
				this._inviteParams.period = period[periodkey];*/
				if(this._inviteParams.members.length == 0) {
					sap.m.MessageToast.show("Please select at least one member.");
				} else {
					var oViewModel = this.getModel("invitationView");
					oViewModel.setProperty("/busy", true);		
	
					remoteserver.sendInvitation(this._inviteParams).done($.proxy(function(data){					
						var msg = "";
						if(data.EmailSentFailed.length > 0) {
							msg += "Invitation email sent to " + data.EmailSentFailed.join() + " is failed.";
						}	
						if(data.Invited.length > 0)	{
							msg += "Invitation email sent to " + data.Invited.join() + " is successful.";
						}		
						if(data.Joined.length > 0) {
							msg += data.Joined.join() + " has joined bucket members.";
						}	
						if(data.NotValidEmail.length > 0) {
							msg += "Email not valid: " + data.NotValidEmail.join();
						}	
						if(data.Pending.length > 0) {
							msg += "Invitation email to " + data.Pending.join() + "has sent already.";
						}	
						sap.m.MessageToast.show(msg);			
					}, this)).done($.proxy(function(data){
						remoteserver.getMembers().done($.proxy(function(data){
							this.getModel().setData(data);
							this.getModel("checkView").setData({selected: false});
							this.getModel("checkView").setData({selected: ""});
							this._inviteParams.members = [];
							oViewModel.setProperty("/busy", false);				
						}, this));
					}, this));
				}
				
			},

			onCancelPress: function() {
				this.getModel("checkView").setData({selected: false});
				this.getModel("checkView").setData({selected: ""});
				this._inviteParams.members = [];
			},

			onMemberSelect: function(oEvt) { 
				var selected = oEvt.getSource().getSelected();
				var name = oEvt.getSource().getName();
				if(selected === true) {
					this._inviteParams.members.push(name);
				} else {
					var index = this._inviteParams.members.indexOf(name);
					if(index > -1){
						this._inviteParams.members.splice(index, 1);
					}
				}				
			}

		});

	}
);
