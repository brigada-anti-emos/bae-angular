angular
	.module('bae')
	.directive('scrollTo', ['$bae', function ($bae) {
		return {
		    restrict: 'A',
		    link: function (scope, element, attrs) {
		        element.on('click', function () {

		            var target = $(attrs.scrollTo);
		            if (target.length > 0) {

		                $('html, body').animate({
		                    scrollTop: target.offset().top - $bae.getDefault('scrollOffset')
		                });
		            }
		        });
		        if(!attrs.href) {
		     		element.attr('href', '');
		        }
		    }
		}
	}]);