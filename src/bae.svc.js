angular
	.module('bae')
	.provider('$bae', [function(){	
		var _defaults = {
			'scrollOffset': 60,
			'clientId': '',
			'clientToken': '',
			'baseUri': 'http://localhost',
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

		function getUrl(url) {
			return _defaults['baseUri'] + url;
		}

		return {
			config: function(configs) {
				angular.forEach(configs, function(value, key) {
					_defaults[key] = value;
				});
			},
			templatesDir: function() {
				return 'templates';
			},
			$get: ['$log', '$q', '$http',
				function($log, $q, $http) {
					var doHttp = function(method, url, params) {
						var reqUrl = getUrl(url);
						var deferred = $q.defer();
						var req = {
							method: method,
							url: reqUrl
						};

						switch(method) {
							case 'GET':
								req.params = params;
								break;
							case 'POST':
							case 'PUT':
								req.data = params;
								break;
						}
						$http(req)
						.then(function(res) {
							$log.debug(method + ': ' + reqUrl);
							deferred.resolve(res);
						}, function(res) {
							$log.error(method + ': ' + reqUrl);
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