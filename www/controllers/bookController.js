app = angular.module('bookTradingApp', ['ngRoute']);
app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'templates/browse.html',
        controller: 'bookController'
      })
      .when('/add', {
        templateUrl: 'templates/add.html',
        controller: 'bookController'
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
}]);
app.controller('bookController', function($scope, $http) {

        var socket = io.connect();

        socket.on('message', function (msg) {
          console.log(msg);
        });

        $scope.send = function send() {
          console.log('Sending message:', $scope.text);
          socket.emit('message', $scope.text);
          $scope.text = '';
        };
        
        $scope.addBook = function(bookTitle,userName) {
          $http.post('/api/newBook/'+bookTitle+'/'+userName)
          .then(function(response) {
            console.log(response);
          });
        };
        
        $scope.getBooks = function() {
          $http.get('/api/books')
          .then(function(response) {
            $scope.books = response.data;
          })
        }
});
