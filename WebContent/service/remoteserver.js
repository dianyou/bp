sap.ui.define([
	"jquery.sap.global",
], function(jquery) {
	"use strict";
	return {
		getMembers: function(){
			return $.ajax({
				// url: "http://10.131.6.232:8089/businesspartner/rest/bplist/members",
				url: "/businesspartner/rest/bplist/members",
				type: "get",
				dataType: "JSON"
			});
		},

		sendInvitation: function(data){
			return 	$.ajax({
				url: "/businesspartner/rest/invitation/invite",
				type:"post",
				data: JSON.stringify(data),
				cache :true,
				dataType: "JSON",
				traditional: true
			});
		},

		sendFeedback: function(data){
			return 	$.ajax({
				url: "/businesspartner/rest/invitation/feedback",
				type:"post",
				data: JSON.stringify(data),
				cache :true,
				dataType: "JSON",
				traditional: true
			});
		},

		getLocalUser: function(){
			return $.ajax({
				url: "/businesspartner/rest/admin/users",
				type: "get",
				dataType: "JSON"
			});
		},

		getRoleList: function(){
			return $.ajax({
				url: "/businesspartner/rest/admin/rolelist",
				type: "get",
				dataType: "JSON"
			});
		},

		createLocalUser: function(data){
			return 	$.ajax({
				async:false,
				url: "/businesspartner/rest/admin/createuser",
				type:"post",
				data: JSON.stringify(data),
				cache :true,
				dataType: "JSON",
				traditional: true
			});
		},

		editLocalUser: function(data){
			return 	$.ajax({
				async:false,
				url: "/businesspartner/rest/admin/edituser",
				type:"post",
				data: JSON.stringify(data),
				cache :true,
				dataType: "JSON",
				traditional: true
			});
		},

		deleteLocalUser: function(data){
			return 	$.ajax({
				async:false,
				url: "/businesspartner/rest/admin/deleteuser",
				type:"post",
				data: JSON.stringify(data),
				cache :true,
				dataType: "JSON",
				traditional: true
			});
		},
	};
});