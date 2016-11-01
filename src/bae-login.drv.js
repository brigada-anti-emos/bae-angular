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