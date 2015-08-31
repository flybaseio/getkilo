angular.module('MainCtrl', ['ngRoute'])
.controller('MainController', function($scope,$timeout,$location,foods,exercises,Food,Exercise,login,me) {
	$scope.currentUser = me;
	
	$scope.today = moment().format("YYYY-MM-DD"); 

	$scope.todayverbose = moment($scope.today).format("dddd, MMMM Do YYYY");
	$scope.todayshort = moment($scope.today).format("ddd, MMM Do");

	$scope.daybefore = moment($scope.today).subtract(1, 'day').format("YYYY-MM-DD");
	$scope.dayafter = moment($scope.today).add(1, 'day').format("YYYY-MM-DD");
	
	if( !login.isLoggedIn() ){
		console.log("bye");
		$location.path('/login');
	}
	$scope.token = login._getToken();
	
	$scope.foods = foods;
	$scope.exercises = exercises;

	$scope.activity = [];
	$scope.cUsed = 0;
	for( var i in $scope.foods ){
		var food = $scope.foods[ i ];
		$scope.cUsed += food.calories;
		$scope.activity.push({
			type:"Food",
			name:food.name,
			calories:food.calories,
			time:food.time,
			date:food.date
		});
	}
	$scope.cBurned = 0;
	for( var i in $scope.exercises ){
		var exercise = $scope.exercises[ i ];
		$scope.cBurned += exercise.calories;
		$scope.activity.push({
			type:"Exercise",
			name:exercise.name,
			calories:"-"+exercise.calories,
			time:exercise.time,
			date:exercise.date
		});
	}
	$scope.cLeft = (2000 - $scope.cUsed) + $scope.cBurned;
	$scope.tagline = 'To the moon and back!';	

	var Ref = Food.flybase();

})
.controller('ViewController', function($scope,$timeout,$location,$route,foods,exercises,Food,Exercise,login,me) {
	$scope.currentUser = me;

	$scope.today = $route.current.params.date;	

	$scope.todayverbose = moment($scope.today).format("dddd, MMMM Do YYYY");
	$scope.todayshort = moment($scope.today).format("ddd, MMM Do");

	$scope.daybefore = moment($scope.today).subtract(1, 'day').format("YYYY-MM-DD");
	$scope.dayafter = moment($scope.today).add(1, 'day').format("YYYY-MM-DD");
	
	if( !login.isLoggedIn() ){
		console.log("bye");
		$location.path('/login');
	}
	$scope.token = login._getToken();
	
	$scope.foods = foods;
	$scope.exercises = exercises;

	$scope.activity = [];
	$scope.cUsed = 0;
	for( var i in $scope.foods ){
		var food = $scope.foods[ i ];
		$scope.cUsed += food.calories;
		$scope.activity.push({
			type:"Food",
			name:food.name,
			calories:food.calories,
			time:food.time,
			date:food.date
		});
	}
	$scope.cBurned = 0;
	for( var i in $scope.exercises ){
		var exercise = $scope.exercises[ i ];
		$scope.cBurned += exercise.calories;
		$scope.activity.push({
			type:"Exercise",
			name:exercise.name,
			calories:"-"+exercise.calories,
			time:exercise.time,
			date:exercise.date
		});
	}

	$scope.cLeft = (2000 - $scope.cUsed) + $scope.cBurned;

	$scope.tagline = 'To the moon and back!';	

	var Ref = Food.flybase();

})
.controller('SingleCtrl', function($scope, $location, food) {
	$scope.food = food;
}).config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {
	$routeProvider.when('/dashboard', {
		templateUrl: 'home/home.html',
		controller: 'MainController',
		resolve:{
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
			},
			foods:function(Food, Login){
				var today = moment().format("YYYY-MM-DD"); 
				var login = new Login();
				if( login.isLoggedIn() ){
					var token = login._getToken();
					return Food.query({"$and":[{"userId":token},{"date":today}]});
				}else{
					return Food.all();
				}
			},
			exercises:function(Exercise, Login){
				date = new Date();
				var today = date.getFullYear() + '-' + ( date.getMonth()+1 ).pad() + '-' + ( date.getDate() ).pad();
				var login = new Login();
				if( login.isLoggedIn() ){
					var token = login._getToken();
					return Exercise.query({"$and":[{"userId":token},{"date":today}]});
				}else{
					return Exercise.all();
				}
			},
		}
	}).when('/view/:date', {
		templateUrl: 'home/home.html',
		controller: 'ViewController',
		resolve:{
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
			},
			foods:function(Food, Login, $route){
				var today = $route.current.params.date;
				var login = new Login();
				if( login.isLoggedIn() ){
					var token = login._getToken();
					return Food.query({"$and":[{"userId":token},{"date":today}]});
				}else{
					return Food.all();
				}
			},
			exercises:function(Exercise, Login, $route){
				var today = $route.current.params.date;
				var login = new Login();
				if( login.isLoggedIn() ){
					var token = login._getToken();
					return Exercise.query({"$and":[{"userId":token},{"date":today}]});
				}else{
					return Exercise.all();
				}
			},
		}
	}).when('/more', {
		templateUrl: 'home/more.html?a=1'
	}).when('/privacy', {
		templateUrl: 'home/privacy.html?a=1'
	});
/*
	.when('/food/:id', {
		templateUrl: 'home/food.html?a=1',
		controller: 'SingleCtrl',
		resolve:{
			food:function(Food, $route){
				var p = Food.getById($route.current.params.id);
				return p;
			} 
		}
	});	
*/
//	$locationProvider.html5Mode(true);
}]);