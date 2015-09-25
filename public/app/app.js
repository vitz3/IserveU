(function() {

	'use strict';

	angular
		.module('iserveu', [
			'ngResource',
			'ngMaterial',
			'ui.router',
			'ngSanitize', 
			'satellizer',
			'textAngular',
			'flow',
			'formly',
			'ngMessages'
		])
		.config(function($provide, $stateProvider, $urlRouterProvider, $httpProvider, $authProvider, formlyConfigProvider, $compileProvider) {

			// speeds up the app, the debug info are for {{}}
			$compileProvider.debugInfoEnabled(false);

			$httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

			$authProvider.loginUrl = '/authenticate';

			$httpProvider.interceptors.push(function($timeout, $q, $injector, $rootScope) {

				var $state, $http;

				$timeout(function() {
					$http = $injector.get('$http');
					$state = $injector.get('$state');
				});

				return {
					responseError: function(rejection) {
						//this is way too explicit, 400 errors return on a lot.
						if(rejection.status === 400) {
							// $rootScope.userIsLoggedIn = false;
							// localStorage.clear();
							// if(!localStorage.satellizer_token){$state.go('login');}
						}
						if(rejection.status === 401){
							// $state.go('permissionfail');
						}
						return $q.reject(rejection);
					}
				}
			});

		    // the overall default route for the app. If no matching route is found, then go here
			
			$urlRouterProvider.when('/', ['$state', '$match', function($state, $match) {
				$state.go('home');
			}])	

			$urlRouterProvider.when("/motion/:id", "/motion/:id/");

		    $urlRouterProvider.otherwise('/home');
				


		    formlyConfigProvider.disableWarnings = true;
		    formlyConfigProvider.setType({
			  name: 'input',
			  template: '<md-input-container><label>{{options.templateOptions.label}}</label><input ng-model="model[options.key]"></md-input-container>'
			});
			formlyConfigProvider.setType({
			  name: 'date',
			  template: '<md-input-container><input type="date" aria-label="{{options.templateOptions.label}}" label="{{options.templateOptions.label}}" ng-model="model[options.key]" convert-date/></md-input-container>'
			});
			formlyConfigProvider.setType({
			  name: 'md-switch',
			  template: '<md-switch ng-model="model[options.key]" ng-value="options.templateOptions.valueProp" ng-true-value="1" ng-false-value="0"/>{{options.templateOptions.label}}'
			});
			formlyConfigProvider.setType({
			  name: 'email',
			  template: '<md-input-container><label>{{options.templateOptions.label}}</label><input type="email" ng-model="model[options.key]"></md-input-container>'
			});
			formlyConfigProvider.setType({
			  name: 'password',
			  template: '<md-input-container><label>{{options.templateOptions.label}}</label><input type="password" ng-hide="true" ng-model="options.templateOptions.valueProp"/></md-input-container>'
			});
			formlyConfigProvider.setType({
			  name: 'password-edit',
			  template: '<md-button ng-click="options.templateOptions.ngClick()"><label>Change password</label></md-button>'
			});
			formlyConfigProvider.setType({
			  name: 'select',
			  template: '<md-select aria-label="select" ng-model="model[options.key]" placeholder="{{options.templateOptions.label}}"><md-option ng-repeat="item in options.templateOptions.ngRepeat" ng-value="item.id">{{item.region}}<md-tooltip>{{item.description}}</md-tooltip></md-option></md-select>'
			});
			formlyConfigProvider.setType({
			  name: 'userform',
			  templateUrl: 'app/components/user/userform.tpl.html'
			});


		    $stateProvider
		    	.state( 'home', {
		    		url: '/home',
		    		templateUrl: 'app/components/home/home.tpl.html',
		    		controller: 'HomeController as home',
		    		data: {
		    	        requireLogin: true
		    	    }
		    	})
		    	.state( 'motion', {
		    	    url: '/motion/:id',
		    	    templateUrl: 'app/components/motion/motion.tpl.html',
		    	    controller: 'MotionController as motion',
		    	    data: {
		    	        requireLogin: true
		    	    }
		    	})
		    	.state( 'motion.components', {
		    		url: '/',
		    		views: {
		    			'editmotion': {
		    				templateUrl: 'app/components/motion/edit-motion.tpl.html'
		    			},
		    			'votes': {
		    				templateUrl: 'app/components/vote/vote.tpl.html',
		    			},
		    			'comments': {
				    	    templateUrl: 'app/components/comment/comment.tpl.html',
				    	    controller: 'CommentController as vm',
		    			}
		    		}
		    	})
		    	.state( 'createmotion', {
		    	    url: '/createmotion',
		    	    templateUrl: 'app/components/motion/createmotion/createmotion.tpl.html',
		    	    controller: 'CreateMotionController as create',
		    	    data: {
		    	        requireLogin: true
		    	    }
		    	})

		    	.state( 'user', {
		    	    url: '/user/:id',
		    	    templateUrl: 'app/components/user/user.tpl.html',
		    	    controller: 'UserController as user',
		    	    data: {
		    	        requireLogin: true
		    	    }
		    	})
		    	.state( 'myprofile', {
		    	    url: '/myprofile',
		    	    templateUrl: 'app/components/user/user.tpl.html',
		    	    controller: 'UserController as user',
		    	    data: {
		    	        requireLogin: true
		    	    }
		    	}) 	
		    	.state('login', {
	                url: '/login',
	            	controller: 'loginController as login',
	            	templateUrl: 'app/shared/login/login.tpl.html',
	                data: {
	                    requireLogin: false
	                } 
	        	})
	        	.state('login.resetpassword', {
	        		url: '/:resetpassword',
	        		data: {
	        			requireLogin: false
	        		}
	        	})
	        	.state('department' , {
	        		url: '/departments/:id',
	            	controller: 'DepartmentController as department',
	            	templateUrl: 'app/components/department/department.tpl.html',
	                data: {
	                    requireLogin: true
	                } 
	        	})
	        	.state('property' , {
	        		url: '/property',
	            	controller: 'PropertyController as property',
	            	templateUrl: 'app/shared/property/propertyassessment/propertyassessment.tpl.html',
	                data: {
	                    requireLogin: true
	                } 
	        	})
	        	.state('backgroundimage', {
	                url: '/upload',
	            	controller: 'BackgroundImageController as background',
	            	templateUrl: 'app/components/backgroundimage/backgroundimage.tpl.html',
	                data: {
	                    requireLogin: true
	                } 
	        	})
	        	.state('backgroundimage.preview', {
	                url: '^/preview/:id',
	            	controller: 'PreviewImageController as preview',
	            	templateUrl: 'app/components/backgroundimage/preview_image.tpl.html',
	                data: {
	                    requireLogin: true
	                } 
	        	})
	        	.state('permissionfail' , {
	        		url: '/invalidentry',
	            	controller: 'RedirectController as redirect',
	            	templateUrl: 'app/shared/permissions/onfailure/permissionsfail.tpl.html',
	                data: {
	                    requireLogin: false
	                } 
	        	});                  

		})
		.filter('dateToDate', function() {
		  	return function(input) {
		    	input = new Date(input);
		    	return input;
	  		};
		})

		.filter('proComment', function() {
			return function(input) {
				var out = [];
				for(var i = 0; i < input.length; i++) {
					if(input[i].position == "1") {
						out.push(input[i])
					}				
				}
				return out;
			}
		})
		.filter('conComment', function() {
			return function(input) {
				var out = [];
				for(var i = 0; i < input.length; i++) {
					if(input[i].position == "0" || input[i].position == "-1") {
						out.push(input[i])
					}				
				}
				return out;
			}
		})
		.filter('object2Array', function() {
		    return function(obj) {
		    	return Object.keys(obj).map(function(key){return obj[key];});
		    }
	 	})
		.run(function($rootScope, $auth, $state, auth) {

			$rootScope.themename = 'default';

			$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {	
				if(toState.name !== 'login'){
					if(toState.name !== 'login.resetpassword'){
						$rootScope.redirectUrlName = toState.name;
						$rootScope.redirectUrlID = toParams.id;
					}
				}


				var requireLogin = toState.data.requireLogin;
				var auth = $auth.isAuthenticated();
				if(auth === false && requireLogin === true){
					event.preventDefault();
					if(fromState.name !== 'login' || toState.name !== 'login'){
						$state.go('login');
					}
				}

				var user = JSON.parse(localStorage.getItem('user'));
					if(user) {
						$rootScope.authenticatedUser = user;
						$rootScope.userIsLoggedIn = true;
					}
			    $rootScope.currentState = toState.name;	// used for sidebar directive
			    //this is slowing down app more than $watch in directives, however that flash is super annoying
			    if(toState.name == 'myprofile'){
			    	$rootScope.currentState = 'user';
			    }
			    if(toState.name== 'home'){
			    	$rootScope.currentState = 'motion';
			    }
			    if(toState.name == 'createmotion'){
			    	$rootScope.currentState = 'motion';
			    }
			    if(toState.name == 'motion.components'){
			    	$rootScope.currentState = 'motion';
			    }
			});		

		})
    .controller('AppCtrl', function($scope) {
      $scope.isOpen = false;
      $scope.demo = {
        isOpen: false,
        count: 0,
        selectedAlignment: 'md-left'
      };
    });




	// var AppController = function($scope, $mdUtil, $mdSidenav, $log) {

	// 	$scope.toggleSidebar = buildToggler('sidebar');
    	
 	//	$scope.toggleUserbar = buildToggler('user-bar');
	    
	//  function buildToggler(navID) {
	    	
	//       var debounceFn = $mdUtil.debounce(function(){
	//             $mdSidenav(navID)
	//               .toggle()
	//               .then(function () {
	//                 $log.debug("toggle " + navID + " is done");
	//               });
	//           },300);
	//       return debounceFn;
	//     }
	// };
	
	// AppController.$inject = module.controller.injectables;

	
			


}());