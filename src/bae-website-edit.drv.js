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