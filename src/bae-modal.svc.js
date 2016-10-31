angular
	.module('bae')
	.provider('$baeModal', [function() {

		this.$get = ['$rootScope', '$baeMap', '$bae',
			function($rootScope, $baeMap, $bae) {

				function baeModal() {
					var self = this;

					function showModal(modal) {
						
					}

					function openIfAny() {
						var modal = self.stack.top();
						if(!modal) {
							return;
						}

						showModal(modal);
					}

					self.stack = $baeMap.createNew();

					self.add = function(modal) {
						var id = $bae.generateId();
						self.stack.add(id, modal);
					};

					self.close = function(key) {
						self.stack.remove(key);
						openIfAny();
					};
				}

				return new baeModal();
			}];
	}]);