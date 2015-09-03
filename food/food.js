angular.module('FoodCtrl', ['ngRoute', 'flybaseResourceHttp', 'loginMcFly'])
/* Controllers */
.controller('FoodListCtrl', function($scope, $rootScope, $timeout, $location, $route, foods,login,Food,me) {
	if( !login.isLoggedIn() ){
		console.log("bye");
//		$location.path('/login');
	}
	$scope.foods = foods;
	var foodsCopy = angular.copy( $scope.foods );
	var Ref = Food.flybase();
})
.controller('FoodViewCtrl', function($scope, $location, food,Login) {
	var login = new Login();
	if( !login.isLoggedIn() ){
		console.log("bye");
		$location.path('/login');
	}
	$scope.food = food;
})
.controller('FoodFormCtrl', function($scope, $location, $window, food,foodlist,Login,me) {
	var login = new Login();
	if( !login.isLoggedIn() ){
		console.log("bye");
		$location.path('/login');
	}
	$scope.token = login._getToken();
	$scope.foodlist = foodlist;

	var foodCopy = angular.copy(food);

	$scope.today = moment().format("YYYY-MM-DD"); 

	$scope.todayverbose = moment($scope.today).format("dddd, MMMM Do YYYY");
	$scope.todayshort = moment($scope.today).format("ddd, MMM Do");

	$scope.daybefore = moment($scope.today).subtract(1, 'day').format("YYYY-MM-DD");
	$scope.dayafter = moment($scope.today).add(1, 'day').format("YYYY-MM-DD");

	$scope.food = food;
	$scope.food.date = new Date( moment($scope.food.date).add(1, 'day').format("YYYY-MM-DD") );
	
	$scope.save = function(){
		$scope.food.userId = $scope.token;
		$scope.food.date = moment( $scope.food.date ).format("YYYY-MM-DD"); 

		$scope.food.$saveOrUpdate().then(function(returnData){
			$location.path('/view/' + $scope.food.date );
		}, function(error) {
			throw new Error('Sth went wrong...');
		});
	};

	$scope.remove = function() {
		if( confirm('Are you sure you want to delete this record?') ){
			$scope.food.$remove(function() {
				$location.path('/food');
			}, function() {
				throw new Error('Sth went wrong...');
			});
			$location.path('/food');
		}
	};

	$scope.hasChanges = function(){
		return !angular.equals($scope.food, foodCopy);
	};
})
.config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {
	$routeProvider.when('/food', {
		templateUrl: 'food/list.html?a=1',
		controller: 'FoodListCtrl',
		resolve:{
			foods:function(Food, Login){
				var login = new Login();
				if( login.isLoggedIn() ){
					var token = login._getToken();
					return Food.query({"userId":token});
				}else{
					return Food.all();
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
	}).when('/food/edit/:id', {
		templateUrl: 'food/form.html?a=1',
		controller: 'FoodFormCtrl',
		resolve:{
			food:function(Food, $route){
				var p = Food.getById($route.current.params.id);
				return p;
			},
			foodlist:function(Food, Login){
				var login = new Login();
				if( login.isLoggedIn() ){
					var token = login._getToken();
					return Food.query({"userId":token});
				}else{
					return Food.all();
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
	}).when('/food/view/:id', {
		templateUrl: 'food/view.html?a=1',
		controller: 'FoodViewCtrl',
		resolve:{
			food:function(Food, $route){
				var p = Food.getById($route.current.params.id);
				return p;
			} 
		}
	}).when('/food/new', {
		templateUrl: 'food/form.html?a=1',
		controller:'FoodFormCtrl', 
		resolve:{
			food:function(Food){
				return new Food();
			},
			foodlist:function(Food, Login){
				var login = new Login();
				if( login.isLoggedIn() ){
					var token = login._getToken();
					return Food.query({"userId":token});
				}else{
					return Food.all();
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
	});	
}]);