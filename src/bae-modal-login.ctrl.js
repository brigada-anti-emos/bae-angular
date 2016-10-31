angular
	.module('bae')
	.controller('modalLoginCtrl', ['$baeAuth', '$uibModalInstance', 'response',
		function($baeAuth, $uibModalInstance, response) {
			var vm = this;
			
			vm.ok = function () {
				$uibModalInstance.close();
			};

			vm.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
		}])