app = angular.module('bookTradingApp', ['ngRoute']);
app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'templates/allBooks.html',
        controller: 'bookController'
      })
      .when('/signup', {
        templateUrl: 'templates/signup.html'
      })
      .when('/login', {
        templateUrl: 'templates/login.html'
      })      
      .when('/myBooks', {
        templateUrl: 'templates/myBooks.html',
        controller: 'bookController'
      })
      .when('/profile', {
        templateUrl: 'templates/profile.html'
      })      
      .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
}]);
app.factory('Authentication', function($http, $window) {
    var saveToken = function (token) {
      $window.localStorage['mean-token'] = token;
    };

    var getToken = function () {
      return $window.localStorage['mean-token'];
    };

    var logout = function() {
      $window.localStorage.removeItem('mean-token');
    };

    var isLoggedIn = function() {
      var token = getToken();
      var payload;
    
      if(token){
        payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
    
        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    var currentUser = function() {
      if(isLoggedIn()){
        var token = getToken();
        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        return {
          email : payload.email
        };
      }
    }; 

    var register = function(user) {
      return $http.post('/api/signup', user);
    };
    
    var authenticate = function(user) {
      return $http.post('/api/login', user);
    };    
    
    return {
      saveToken : saveToken,
      getToken : getToken,
      logout : logout,
      isLoggedIn: isLoggedIn,
      currentUser: currentUser,
      register: register,
      authenticate: authenticate
    };
});

app.controller('bookController', function($scope, $http, $location, Authentication) {
        
        $scope.setStatus = function() {
          $scope.isLoggedIn = Authentication.isLoggedIn();
          $scope.currentUser = Authentication.currentUser();            
        };
        
        $scope.$on('Authentication.saveToken', function(event, parameters) {
           console.log(parameters.key);  // contains the key that changed
           console.log(parameters.newvalue);  // contains the new value
        });
        
        $scope.initSite = function() {
          $scope.setStatus();
          $scope.users = [];
          $scope.getBooks();
        };

        $scope.addBook = function(userName) {
          $http.post('/api/newBook/'+$scope.bookTitle+'/'+userName)
          .then(function(response) {
            console.log(response);
            $scope.bookTitle = "";
            if(response.data.addedBy) {
              $scope.books.push(response.data);
            }
          });
        };
        
        $scope.getBooks = function() {
          $http.get('/api/books')
          .then(function(response) {
            $scope.books = response.data;
          });
        };

        $scope.requestBook = function(book, index, user) {
          console.log(book);
          console.log(user);
          $http.post('/api/requestBook/'+book._id+'/'+user.email)
          .then(function(response) {
            $scope.books[index] = response.data;
            console.log(response.data);
          });
        };

        $scope.acceptTrade = function(book,index) {
          console.log(book);
          $http.post('/api/acceptTrade/'+book._id)
          .then(function(response) {
            console.log(response.data);
            $scope.books[index] = response.data;
          });
        };
        
        $scope.signUp = function(user) {
          console.log(user);
          console.log("Testytest");
          Authentication.register(user)    
          .error(function(err){
            alert(err);
          })
          .then(function(response){
            var data = response.data;
            console.log(data);
            if(typeof data === "string" && data.indexOf('already') > -1) {
              alert(data.message);
            }
            else {
              alert(data.message);
              Authentication.saveToken(data.token);
              $location.path('/');
              $scope.setStatus();
            }
          });
        };

        $scope.logIn = function(user) {
          Authentication.authenticate(user)    
          .error(function(err){
            alert(err.message);
          })
          .then(function(response){
            var data = response.data;
            alert(data.message);
            Authentication.saveToken(data.token);
            $location.path('/');
            $scope.setStatus();
          });
        };
        
        $scope.logOut = function() {
          Authentication.logout();
          $location.path('/');
          $scope.setStatus();
        };
        
        $scope.loadProfile = function () {
          $http.get('/api/profile/'+ $scope.currentUser.email)
          .then(function(response) {
            $scope.user = response.data;
          });
        };
        
        $scope.getUsersInfo = function (email, index) {
          $http.get('/api/profile/'+ email)
          .then(function(response) {
            $scope.users[index] = response.data;
          });
        };
        
        $scope.saveProfile = function () {
          $http.post('/api/profile/'+$scope.currentUser.email, $scope.user)
          .then(function(response) {
            $scope.user = response.data;
          });
        };        
});
