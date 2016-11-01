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