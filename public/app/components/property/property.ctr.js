 (function() {

	'use strict';

	angular
		.module('iserveu')
		.controller('PropertyController', PropertyController);

	function PropertyController($stateParams, $rootScope, property, user, ToastMessage, SetPermissionsService) {

		var vm = this;

 		/*********************************** Variables ************************************/ 
	    vm.selectedItem     = null;
	    vm.searchText       = null;
	    vm.searchNumber     = null;
	    vm.searchApt  	    = null;
	    vm.searchRollNumber = null;
	    vm.checkForAddress  = false;
	    vm.isMyAddress      = false;
	    vm.dataGroup		= {};
	    vm.searching		= false;

 		/*********************************** Functions ************************************/ 
	    vm.querySearch        = querySearch;
	    vm.selectedItemChange = selectedItemChange;
	    vm.checkOut 		  = checkOut;
	    vm.checkProperty 	  = checkProperty;
	    vm.assignPropertyData = assignPropertyData;

		function querySearch() {
			var data = {
				search_query_apt_number: vm.searchApt,
				search_query_address_number: vm.searchNumber,
				search_query_street_name: vm.searchText,
				search_query_roll_number: vm.searchRollNumber,
				search_query_postal_code: vm.searchPostalCode
			}
			return property.searchProperty(data).then(function(result){
				vm.property_queries = result;
				vm.searching = true;
				return result;
			});
		}

		function selectedItemChange(){
			vm.checkForAddress = true;
		}

		function checkOut(){
			vm.isMyAddress = true;
		}

		function assignPropertyData(query){
			vm.selectedItem = query;
			vm.searchText = query.street;
			vm.searchNumber = query.address;
			vm.searchApt = query.unit;
			vm.searchRollNumber = query.roll_number;
			vm.searchPostalCode = query.postal_code;
		}

		function checkProperty(){
			if(!vm.selectedItem) {
				querySearch().then(function(result){
					vm.selectedItem = result[0];
					vm.checkForAddress = true;
				});
			}
			else if(vm.isMyAddress){
				saveProperty();
			}
		}

		function saveProperty(){
			var property_data = {
				id: vm.selectedItem.id,
				postal_code: vm.searchPostalCode,
				unit: vm.searchApt,
				roll_number: vm.searchRollNumber,
				address: vm.searchNumber,
				street: vm.searchText
			}

			property.updateProperty(property_data).then(function(results){
				$rootScope.$emit('userSavedNewAddress', {id:results.id});
			})

			var user_data = {
				id: $stateParams.id,
				property_id: vm.selectedItem.id
			}

			user.updateUser(user_data).then(function(results){
				ToastMessage.simple("Your address has been updated to the system. Thank you.")
			}, function(error) {
				if(error.message = '{"date_of_birth":["validation.date"]}'){
					ToastMessage.double("Woops! You encountered an error!", "Please set your birthday before your address.", true, 1000);
				}
			})
		}


 		/*********************************** Property Manager Functions (Must abstract) ************************************/ 

		vm.users;
 		user.getUserInfo().then(function(results){
 			vm.users = results.data;
 		})

	}




})();
