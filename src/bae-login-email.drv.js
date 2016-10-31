angular
	.module('bae')
	.directive('baeLoginEmail', [function(){
		return {
			restrict: 'EAC',
			require: 'baeLogin'
		}
	}]);