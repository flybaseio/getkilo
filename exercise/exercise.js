angular.module('ExerciseCtrl', ['ngRoute', 'flybaseResourceHttp', 'loginMcFly'])
/* Controllers */
.controller('ExerciseListCtrl', function($scope, $rootScope, $timeout, $location, $route, exercises,login,Exercise,me) {
	if( !login.isLoggedIn() ){
		console.log("bye");
//		$location.path('/login');
	}
	$scope.exercises = exercises;
	var exercisesCopy = angular.copy( $scope.exercises );
	var Ref = Exercise.flybase();
})
.controller('ExerciseViewCtrl', function($scope, $location, exercise,Login) {
	var login = new Login();
	if( !login.isLoggedIn() ){
		console.log("bye");
		$location.path('/login');
	}
	$scope.exercise = exercise;
})
.controller('ExerciseFormCtrl', function($scope, $location, $window, exercise,Login,me) {
	var login = new Login();
	if( !login.isLoggedIn() ){
		console.log("bye");
		$location.path('/login');
	}
	$scope.token = login._getToken();

	var exerciseCopy = angular.copy(exercise);


	$scope.today = moment().format("YYYY-MM-DD"); 

	$scope.todayverbose = moment($scope.today).format("dddd, MMMM Do YYYY");
	$scope.todayshort = moment($scope.today).format("ddd, MMM Do");

	$scope.daybefore = moment($scope.today).subtract(1, 'day').format("YYYY-MM-DD");
	$scope.dayafter = moment($scope.today).add(1, 'day').format("YYYY-MM-DD");

	$scope.exercise = exercise;
	$scope.exercise.date = new Date( moment($scope.exercise.date).add(1, 'day').format("YYYY-MM-DD") );

	$scope.save = function(){
		$scope.exercise.userId = $scope.token;
		$scope.exercise.date = moment( $scope.exercise.date ).format("YYYY-MM-DD"); 

		$scope.exercise.$saveOrUpdate().then(function(returnData){
			$location.path('/view/' + $scope.food.date );
		}, function(error) {
			throw new Error('Sth went wrong...');
		});
	};

	$scope.remove = function() {
		$scope.exercise.$remove(function() {
			$location.path('/exercise');
		}, function() {
			throw new Error('Sth went wrong...');
		});
	};

	$scope.hasChanges = function(){
		return !angular.equals($scope.exercise, exerciseCopy);
	};
})
.config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {
	$routeProvider.when('/exercise', {
		templateUrl: 'exercise/list.html?a=1',
		controller: 'ExerciseListCtrl',
		resolve:{
			exercises:function(Exercise, Login){
				var login = new Login();
				if( login.isLoggedIn() ){
					var token = login._getToken();
					return Exercise.query({"userId":token});
				}else{
					return Exercise.all();
				}
			},
			login:function( Login ){
				return new Login();
			},
			me:function(User, Login){
				var login = new Login();
				if( login.isLoggedIn() ){
					var token = login._getToken();
					var u = User.getById(token);
					return u;
				}
			}
		}
	}).when('/exercise/edit/:id', {
		templateUrl: 'exercise/form.html?a=1',
		controller: 'ExerciseFormCtrl',
		resolve:{
			exercise:function(Exercise, $route){
				var p = Exercise.getById($route.current.params.id);
				return p;
			},
			login:function( Login ){
				return new Login();
			},
			me:function(User, Login){
				var login = new Login();
				if( login.isLoggedIn() ){
					var token = login._getToken();
					var u = User.getById(token);
					return u;
				}
			}
		}
	}).when('/exercise/view/:id', {
		templateUrl: 'exercise/view.html?a=1',
		controller: 'ExerciseViewCtrl',
		resolve:{
			exercise:function(Exercise, $route){
				var p = Exercise.getById($route.current.params.id);
				return p;
			} 
		}
	}).when('/exercise/new', {
		templateUrl: 'exercise/form.html?a=1',
		controller:'ExerciseFormCtrl', 
		resolve:{
			exercise:function(Exercise){
				return new Exercise();
			},
			login:function( Login ){
				return new Login();
			},
			me:function(User, Login){
				var login = new Login();
				if( login.isLoggedIn() ){
					var token = login._getToken();
					var u = User.getById(token);
					return u;
				}
			}
		}
	});	
}]);