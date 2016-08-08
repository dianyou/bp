sap.ui.define([
	"sap/ui/core/ValueState"],
	function(ValueState) {
	"use strict";

	return {
		memberPanelHeader: function(sName, sStatus, sDate) {
			var member;
			if (!sName) {
				return "";
			}
			if (sStatus === "JOINED") {
				member = sName + " (joined at " + sDate + ")";
			} else if (sStatus === "PENDING") {
				member = sName + " (invitation sent at " + sDate + ")";
			} else if (sStatus === "EXPIRED") {
				member = sName + " (invitation expired at " + sDate + ")";
			} else {
				member = sName;
			}
			return member;
		},

		memberSelection: function(sStatus) {
			var enabled;
			if (sStatus === "JOINED" || sStatus === "PENDING") {
				enabled = false;
			} else{
				enabled = true;
			}
			return enabled;
		},

		memberIcon: function(sStatus) {
			var icon;
			if (sStatus === "JOINED") {
				icon = "sap-icon://sys-enter";
			} else if (sStatus === "PENDING") {
				icon = "sap-icon://pending";
			} else if (sStatus === "EXPIRED") {
				icon = "sap-icon://sys-minus";
			} else if (sStatus === "POTENTIAL"){
				icon = "sap-icon://goal";
			} else {
				icon = "";
			}
			return icon;
		},
		memberIconColor: function(sStatus) {
			var color;
			if (sStatus === "JOINED") {
				color = "#007833";
			} else if (sStatus === "PENDING") {
				color = "#ea9a02";
			} else if (sStatus === "EXPIRED") {
				color = "#cc1919";
			} else if (sStatus === "POTENTIAL"){
				color = "#007cc0";
			} else {
				color = "#000";
			}
			return color;
		}
	};

});