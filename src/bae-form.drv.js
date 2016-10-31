/*
<bae-form uri="/api/website" method="post">
	<bae-form-group type="text" key="name" label="Website Name"></bae-form-group>
	<bae-form-group type="text" key="name" label="Website Name"></bae-form-group>
	<bae-form-group type="text" key="name" label="Website Name"></bae-form-group>
	<bae-form-group type="select">
		<bae-form-option>Yes</bae-form-option>
		<bae-form-option>No</bae-form-option>
	</bae-form-group>
</bae-form>
<bae-list uri="/api/website">
<bae-list-column>
 */
angular
	.module('bae')
	.directive('baeList', ['$log', '$bae',
		function($log, $bae) {
			return {
				link: function(scope, elem, attrs) {
					if(angular.isArray(scope.data)) {
						return;
					}

				},
				scope: {
					'uri': '&',
					'data': '&'
				}
			}
		}])
	.directive('baeForm', ['$log', '$bae', 
		function($log, $bae){

			return {
				link: function(scope, elem, attrs) {
					scope.formModel = {};

					if(!angular.isString(scope.formStyle)) {
						scope.formStyle = $bae.defaultStyle();
					}

					if(attrs.baeForm === 'undefined') {
						$log.error('Form created without any URL defined');
					}

				},
				scope: {
					'formStyle': '&',
					'submit': '&',
					'formModel': '&',
					'onError': '&',
				}
			}
	}])
	.directive('baeFormGroup', ['$log','$compile', 
		function($log, $compile) {
			return {	
				scope: {
					'type': '&',
					'default': '&'
				},
				require: '^ngModel, ^baeFormCtrl',
				link: function(scope, elem, attr, baeFormCtrl) {
					$templateRequest("template.html").then(function(html){
				      var template = angular.element(html);
				      element.append(template);
				      $compile(template)(scope);
				   });
					var tpl = '<div class="bae-form__group">';
					switch(scope.type) {
						case 'text':
						tpl = tpl + '<input type="text" ng-model="ng-asd" />';
					}
					
				}
			
			}
	}])
	.directive('baeSubmit', [function(){

		return {
			replace: false,
			require: '^parentCtrl',
			link: function(scope, elem, attrs, parentCtrl) {
				elem.on('click', function(){
					parentCtrl.submit();
				});
			},
		}
	}]);;