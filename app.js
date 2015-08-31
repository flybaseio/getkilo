'use strict';

( function (self) {
	if ( (typeof console !== 'undefined') && (typeof console.warn === 'function') ){
		var warn = window.console.warn;
		self['ಠ_ಠ'] = Function.prototype.bind.call(warn, console);
		window.console.warn = undefined;
	} else{
		self['ಠ_ಠ'] = function () {}
	}
}( typeof window !== 'undefined'? window : typeof global !== 'undefined' ? global : self ) );

// Declare app level module which depends on filters, and services
angular.module('myApp', [
	'myApp.config',
	'myApp.models',
	"UserCtrl",
	'MainCtrl', 
	'FoodCtrl', 
	'ExerciseCtrl',
	'ReportCtrl',
	'myApp.directives'
]);

String.prototype.toHex = function() {
    var buffer = forge.util.createBuffer(this.toString());
    return buffer.toHex();
}

String.prototype.toSHA1 = function() {
    var md = forge.md.sha1.create();
    md.update(this);
    return md.digest().toHex();
}

String.prototype.pad = function(){
	var n = parseInt( this );
	return (n < 10) ? ("0" + n) : n
}
Number.prototype.pad = function(){
	var n = parseInt( this );
	return (n < 10) ? ("0" + n) : n
}

function randomBackground(){
	var numLow = 1;
	var numHigh = 14;
	var adjustedHigh = (parseFloat(numHigh) - parseFloat(numLow)) + 1;
	var numRand = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
	numRand = numRand > 9 ? "" + numRand : "0" + numRand;
//	document.html.style.backgroundImage = "url('https://momentumdash.com/backgrounds/" + numRand + ".jpg')";
	$("html").css("background-image", "url('https://momentumdash.com/backgrounds/" + numRand + ".jpg')");
}
randomBackground();