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