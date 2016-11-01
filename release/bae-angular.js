angular
	.module('bae', []);
angular
	.module('bae')
	.provider('$baeApi', [function() {

		return {
			$get: ['$log', '$http', '$bae', '$q',
				function($log, $http, $bae, $q) {

					return {

						register: function(email, displayName, password, data) {
							var req = {
								email: email,
								password: password,
								displayName: displayName
							};
							if(angular.isArray(data)) {
								angular.forEach(data, function(param) {
									req[param[0]] = req[param[1]];
								});
							}
							return $bae.http('POST', '/api/register', req);
						},
						login: function(email, password) {
							return $bae.http('POST', '/api/login', {
								email: email,
								password: password
							});
						}
					};
				}]
		}
	}]);
/**
 * Authenticate Service
 */
angular
	.module('bae')	
	.provider('$baeAuth', [function() {
		var _providers = null;

		var _viewsPublic = null;

		this.setProviders = function(providers) {
			_providers = providers;
		};

		this.addPublicViews = function(views) {
			_viewsPublic = views;
		}

		this.$get = ['$log', '$http', '$bae', '$q', '$cookies', '$uibModal', '$state',
			function($log, $http, $bae, $q, $cookies, $uibModal, $state) {

				if(!_providers) {
					_providers = ['basic'];
				}

				function AuthService() {
					var self = this;

					function tryGetAuthorization() {
						var token = $cookies.get('token');
						if(token) {
							self.apiToken = token;
							self.isAuthenticated = true;
						}
					}

					self.isAuthenticated = false;
					self.identity = null;
					self.providers = _providers;
					self.apiToken = null;
					self.publicViews = _viewsPublic;

					tryGetAuthorization();
					
					self.loginModal = function(toName, toParams) {
						var modalInstance = $uibModal.open({
							templateUrl: 'templates/modal-login-protected.html',
							controller: 'modalLoginCtrl',
							controllerAs: 'vm',
							resolve: {
								response: function () {
									return null;
								}
							}
					    });

					    modalInstance.then(function(res) {
					    	$state.go(toName, toParams);
					    })
				
					};

					self.register = function(firstName, lastName, displayName, email, password, data) {
						var req = {
							email: email,
							password: password,
							displayName: displayName
						};

						if(angular.isArray(data)) {
							angular.forEach(data, function(param) {
								req[param[0]] = req[param[1]];
							});
						}
						
						return $bae.http('POST', '/api/register', req);
					};
					self.login = function(email, password) {
						
						var defer = $q.defer();

						$bae.http('POST', '/api/login', {
							email: email,
							password: password
						})
						.then(function(res) {
							if(!res.data || !angular.isObject(res.data.data.user)) {
								$log.error('Authentication was sucefull but response has an error.');
								defer.reject(res);
							}
							$http.defaults.headers.common.Authorization = res.data.data.token;
							self.isAuthenticated = true;
							self.identity = res.data.data.user;
							self.apiToken = res.data.data.token;
							defer.resolve(res.data);
						}, function(res) {
							defer.reject(res);
						});

						return defer.promise;
					};
				}

				return new AuthService();
			}];

		return this;

	}]);
/*
<bae-form uri="/api/website" method="post">
	<bae-form-group type="text" key="name" label="Website Name"></bae-form-group>
	<bae-form-group type="text" key="name" label="Website Name"></bae-form-group>
	<bae-form-group type="text" key="name" label="Website Name"></bae-form-group>
	<bae-form-group type="select">
		<bae-form-option>Yes</bae-form-option>
		<bae-form-option>No</bae-form-option>
	</bae-form-group>
</bae-form>
<bae-list uri="/api/website">
<bae-list-column>
 */
angular
	.module('bae')
	.directive('baeList', ['$log', '$bae',
		function($log, $bae) {
			return {
				link: function(scope, elem, attrs) {
					if(angular.isArray(scope.data)) {
						return;
					}

				},
				scope: {
					'uri': '&',
					'data': '&'
				}
			}
		}])
	.directive('baeForm', ['$log', '$bae', 
		function($log, $bae){

			return {
				link: function(scope, elem, attrs) {
					scope.formModel = {};

					if(!angular.isString(scope.formStyle)) {
						scope.formStyle = $bae.defaultStyle();
					}

					if(attrs.baeForm === 'undefined') {
						$log.error('Form created without any URL defined');
					}

				},
				scope: {
					'formStyle': '&',
					'submit': '&',
					'formModel': '&',
					'onError': '&',
				}
			}
	}])
	.directive('baeFormGroup', ['$log','$compile', 
		function($log, $compile) {
			return {	
				scope: {
					'type': '&',
					'default': '&'
				},
				require: '^ngModel, ^baeFormCtrl',
				link: function(scope, elem, attr, baeFormCtrl) {
					$templateRequest("template.html").then(function(html){
				      var template = angular.element(html);
				      element.append(template);
				      $compile(template)(scope);
				   });
					var tpl = '<div class="bae-form__group">';
					switch(scope.type) {
						case 'text':
						tpl = tpl + '<input type="text" ng-model="ng-asd" />';
					}
					
				}
			
			}
	}])
	.directive('baeSubmit', [function(){

		return {
			replace: false,
			require: '^parentCtrl',
			link: function(scope, elem, attrs, parentCtrl) {
				elem.on('click', function(){
					parentCtrl.submit();
				});
			},
		}
	}]);;
angular
	.module('bae')
	.directive('baeGoBack', ['$bae','$rootScope', 
		function ($bae, $rootScope) {
			return {
			    restrict: 'A',
			    link: function (scope, element, attrs) {
			        element.on('click', function () {
			            $rootScope.goBack();
			        });
			    }
			}
	}]);
angular
	.module('bae')
	.directive('baeLoginEmail', [function(){
		return {
			restrict: 'EAC',
			require: 'baeLogin'
		}
	}]);
angular
	.module('bae')
	.directive('baeLoginPassword', [function(){
		return {
			restrict: 'EAC',
			require: '^baeLoginCtrl'
		}
	}]);
angular
	.module('bae')
	.directive('baeLoginSubmit', [function(){
		return {
			restrict: 'EAC',
			require: '^baeLogin',
			link: function(scope, elem, attrs, baeLogin) {
				elem.on('click', function() {
					baeLogin.login();
				});
			}
		}
	}]);
angular
	.module('bae')
	.directive('baeLogin', ['$baeAuth', '$rootScope', '$log', '$uibModal', '$state',
		function($baeAuth, $rootScope, $log, $uibModal, $state) {
			return {
				templateUrl: 'templates/bae-login.html',
				controllerAs: 'vm',
				controller: function($scope) {
					var vm = this;

					vm.login = function() {
						$scope.doLogin()
							.then(function(res) {
								if(angular.isDefined($scope.baeLoginRedirect)) {
									$log.info('Redirecting after login')
								} else if(angular.isDefined($scope.baeLoginBack)) {
									$log.info('Go back after login');
									$rootScope.goBack();
								} else {
									$state.go('home');
								}
							}, function(res) {
								var modalInstance = $uibModal.open({
									templateUrl: 'templates/modal-default.html',
									controller: 'modalDefaultCtrl',
									controllerAs: 'vm',
									resolve: {
										response: function () {
											return res.data;
										}
									}
							    });
								$log.info('Invalid Authentication');
							});;
					}
			},
			link: function(scope, elem, attrs) {

				scope.doLogin = function() {
					var email = angular.element(elem[0].querySelector('[bae-login-email]')).val();
					var password = angular.element(elem[0].querySelector('[bae-login-password]')).val();
					return $baeAuth.login(email, password);
				}
			},
			scope: {
				'baeLoginBack': '=',
				'baeLoginRedirect': '='
			}
		}
	}]);
angular
	.module('bae')
	.controller('modalLoginCtrl', ['$baeAuth', '$uibModalInstance', 'response',
		function($baeAuth, $uibModalInstance, response) {
			var vm = this;
			
			vm.ok = function () {
				$uibModalInstance.close();
			};

			vm.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
		}])
angular
	.module('bae')
	.provider('$baeModal', [function() {

		this.$get = ['$rootScope', '$baeMap', '$bae',
			function($rootScope, $baeMap, $bae) {

				function baeModal() {
					var self = this;

					function showModal(modal) {
						
					}

					function openIfAny() {
						var modal = self.stack.top();
						if(!modal) {
							return;
						}

						showModal(modal);
					}

					self.stack = $baeMap.createNew();

					self.add = function(modal) {
						var id = $bae.generateId();
						self.stack.add(id, modal);
					};

					self.close = function(key) {
						self.stack.remove(key);
						openIfAny();
					};
				}

				return new baeModal();
			}];
	}]);
angular
	.module('bae')
	.directive('baeRoadmap', ['$rootScope', '$bae',
		function($rootScope, $bae) {
			return {
				link: function(scope, elem, attrs) {
					scope.releases = $bae.getDefault('releases');
				},
				templateUrl: 'templates/bae-roadmap.html'
			}
		}])
	.directive('baeRoadmapRelease', ['$rootScope', '$bae',
		function($rootScope, $bae) {
			return {
				link: function(scope, elem, attrs) {
					
				},
				scope: {
					'release': '='
				},
				templateUrl: 'templates/bae-roadmap-release.html'
			}
		}])

angular
	.module('bae')
	.directive('baeWebsiteEdit', ['$baeApi', function($baeApi){

		return {
			templateUrl: 'templates/bae-website-edit.html',
			link: function(scope, elem, attrs) {
				
				scope.save = function(){
					
				}
			},
		}
	}]);
angular
	.module('bae')
	.provider('$bae', [function(){	
		var _defaults = {
			'scrollOffset': 60,
			'clientId': '',
			'clientToken': '',
			'baseUri' => 'localhost',
			'releases': {
				'release':  { 
					'name': 'Stable', 
					'codename': 'stable', 
					'description': 'The release of Bae called "stable" is always the official released version of Bae.',
					'versions': {
						'2.2': {
							'codename': 'thug',
							'version': '1.2.5'
						}
					},
				},
				'testing': { 
					'name': 'Testing',
					'codename': 'testing',
					'description': 'Bae testing is the current development state of the next stable Bae. It is also made under the code name of the next stable release, i.e. thug (as of 2016-03-10)',
					'versions': {
						'3.0': {
							'codename': 'OG',
							'version': '3.5.2'
						}
					}
				}
			}
		};

		function defaultStyle(type) {
			return 'bae-' + type + '.default';
		}

		return {
			config: function(configs) {
				angular.forEach(function(config) {
					_defaults[$config[0]] = $config[1];
				});
			},
			templatesDir: function() {
				return '/templates';
			},
			$get: ['$log', '$q', '$http',
				function($log, $q, $http) {
					var doHttp = function(method, url, params) {
						var deferred = $q.defer();
						var req = {
							method: method,
							url: _defaults['baseUri'] + url
						};

						switch(method) {
							case 'GET':
								req.params = params;
								break;
							case 'POST':
								req.data = params;
						}
						$http(req)
						.then(function(res) {
							$log.debug(method + ': ' + url);
							deferred.resolve(res);
						}, function(res) {
							$log.error(method + ': ' + url);
							deferred.reject(res);
						});

						return deferred.promise;
					};

					function generateId() {
						var text = "";
					    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

					    for( var i=0; i < 5; i++ )
					        text += possible.charAt(Math.floor(Math.random() * possible.length));

					    return text;
					}	

					return {
						configs: function() {
							return _defaults;
						},
						getDefault: function($key) {
							return _defaults[$key];
						},
						http: doHttp,
						defaultStyle: defaultStyle,
						generateId: generateId
					}
				}]
		}
	}]);
angular
  .module('bae')
  .factory('$baeMap', function() {
      return {
        createNew: function() {
          var stack = [];

          return {
            add: function(key, value) {
              stack.push({
                key: key,
                value: value
              });
            },
            get: function(key) {
              for (var i = 0; i < stack.length; i++) {
                if (key === stack[i].key) {
                  return stack[i];
                }
              }
            },
            keys: function() {
              var keys = [];
              for (var i = 0; i < stack.length; i++) {
                keys.push(stack[i].key);
              }
              return keys;
            },
            top: function() {
              return stack[stack.length - 1];
            },
            remove: function(key) {
              var idx = -1;
              for (var i = 0; i < stack.length; i++) {
                if (key === stack[i].key) {
                  idx = i;
                  break;
                }
              }
              return stack.splice(idx, 1)[0];
            },
            removeTop: function() {
              return stack.pop();
            },
            length: function() {
              return stack.length;
            }
          };
        }
      };
    });
angular
	.module('bae')
	.directive('scrollTo', ['$bae', function ($bae) {
		return {
		    restrict: 'A',
		    link: function (scope, element, attrs) {
		        element.on('click', function () {

		            var target = $(attrs.scrollTo);
		            if (target.length > 0) {

		                $('html, body').animate({
		                    scrollTop: target.offset().top - $bae.getDefault('scrollOffset')
		                });
		            }
		        });
		        if(!attrs.href) {
		     		element.attr('href', '');
		        }
		    }
		}
	}]);