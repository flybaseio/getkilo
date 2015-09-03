angular.module('ReportCtrl', ['ngRoute'])
.controller('ReportController', function($scope,$timeout,$location,foods,exercises,Food,Exercise,login,me) {
	$scope.currentUser = me;
	
	if( !login.isLoggedIn() ){
		console.log("bye");
//		$location.path('/login');
	}
	$scope.token = login._getToken();

	$scope.calories = 2000;
	if( typeof me.calories !== "undefined" ){
		$scope.calories = me.calories;
	}
	
	$scope.foods = foods;
	$scope.exercises = exercises;

	$scope.average = 0;
	$scope.avgc = 0;

	$scope.activity = [];
	$scope.report = [];
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
			calories:exercise.calories,
			time:exercise.time,
			date:exercise.date
		});
	}

	$scope.dates = [];
	for( var i in $scope.activity ){
		var row = $scope.activity[ i ];
		var date = row.date;
		if( typeof $scope.report[date] === 'undefined' ){
			$scope.report[date] = {
				date:date,
				food:0,
				exercise:0,
				total:0
			};
		}
		if( row.type == "Food" ){
			$scope.report[date].food += row.calories;
		}else{
			$scope.report[date].exercise += row.calories;
		}
		$scope.report[date].total = $scope.report[date].food - $scope.report[date].exercise;
	}
	$scope.temp = $scope.report;
	$scope.report = [];
	for( var i in $scope.temp ){
		$scope.avgc++;
		$scope.average += $scope.temp[i].total;
		$scope.report.push( $scope.temp[i] );
	}
	$scope.average = $scope.average / $scope.avgc;
	
	$scope.cLeft = ($scope.calories - $scope.cUsed) + $scope.cBurned;
	$scope.tagline = 'To the moon and back!';	

	var Ref = Food.flybase();

})
.config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {
	$routeProvider.when('/report', {
		templateUrl: 'report/report.html',
		controller: 'ReportController',
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
				var login = new Login();
				if( login.isLoggedIn() ){
					var token = login._getToken();
					return Food.query({"userId":token});
				}else{
					return Food.all();
				}
			},
			exercises:function(Exercise, Login){
				var login = new Login();
				if( login.isLoggedIn() ){
					var token = login._getToken();
					return Exercise.query({"userId":token});
				}else{
					return Exercise.all();
				}
			}
		}
	});
}]);