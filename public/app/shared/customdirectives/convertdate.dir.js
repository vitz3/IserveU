(function() {
	
	'use strict';

	angular
		.module('iserveu')
		.directive('convertDate', convertDate);

	function convertDate($filter) {

		return {
			require: "ngModel",
			link: function(scope, element, attrs, ngModelController) {

				ngModelController.$parsers.push(function(data) {
					return new Date(data);
				})


      			ngModelController.$formatters.push(function(data) {
      				if(data == "0000-00-00") {
      					return;
      				}
      				else if(data == null){
      					console.log('foo');
      					return;
      				}
      				else {
						return new Date(data);
      				}
			    });
			}
		}
	}

}());

