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