angular
	.module('bae')
	.directive('baeRoadmap', ['$rootScope', '$bae',
		function($rootScope, $bae) {
			return {
				link: function(scope, elem, attrs) {
					scope.releases = $bae.getDefault('releases');
				},
				templateUrl: '/templates/bae-roadmap.html'
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
				templateUrl: '/templates/bae-roadmap-release.html'
			}
		}])