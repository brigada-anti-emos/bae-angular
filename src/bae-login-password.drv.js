angular
	.module('bae')
	.directive('baeLoginPassword', [function(){
		return {
			restrict: 'EAC',
			require: '^baeLoginCtrl'
		}
	}]);