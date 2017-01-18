(function() {
    angular
        .module('cenarioTest')
        .service('appAPI', ['$http', '$q', function($http, $q) {
            var urlOrigin = window.location.origin;

            this.sendQuiz = function(params) {
                return $http({
                            method: 'POST',
                            url: urlOrigin + '/send_quiz',
                            params: params
                        })
                        .then(function(response) {
                            return response.data;
                        }, function(error) {
                            return $q.reject('Ocorreu um erro inesperado durante o envio do formulário.');
                        });
            };
        }]);
}());