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