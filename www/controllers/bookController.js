app = angular.module('bookTradingApp', []);
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
        
        $scope.addBook = function(bookTitle) {
          console.log(bookTitle);
        
          $http.post('/api/newBook/'+bookTitle)
          .then(function(response) {
            console.log(response);
          });
        };
});
