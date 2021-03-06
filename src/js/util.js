/*!
 * util
 * https://github.com/Voliware/Util
 * Licensed under the MIT license.
 */

/**
 * General utility functions
 */
class Util {
	/**
	 * Wraps a for in loop.
	 * For each object it will pass the
	 * property name and value to a callback.
	 * @param {object} data - data to loop through
	 * @param {function} cb - callback
	 */
	static each(data, cb){
		for(var i in data){
			var e = data[i];
			cb(i, e);
		}
	}
}

// helpers
if(typeof isDefined === 'undefined'){
	window.isDefined = function(x){
		return typeof x !== 'undefined';
	}
}
if(typeof isNull === 'undefined'){
	window.isNull = function(x){
		return x === null;
	}
}
if(typeof isNullOrUndefined === 'undefined'){
	window.isNullOrUndefined = function(x){
		return x === null || x === 'undefined';
	}
}
if(typeof isFunction === 'undefined'){
	window.isFunction = function(x){
		return typeof x === 'function';
	}
}
if(typeof isString === 'undefined'){
	window.isString = function(x){
		return typeof x === 'string';
	}
}
if(typeof isNumber === 'undefined'){
	window.isNumber = function(x){
		return typeof x === 'number';
	}
}
if(typeof isObject === 'undefined'){
	window.isObject = function(x){
		return x !== null && !isArray(x) && typeof x === 'object';
	}
}
if(typeof isArray === 'undefined'){
	window.isArray = function(x){
		return x !== null && Array.isArray(x);
	}
}
if(typeof getType === 'undefined') {
	//http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript
	window.getType = function (x) {
		if (x === null)
			return "[object Null]";
		return Object.prototype.toString.call(x);
	}
}
if(typeof createGuid === 'undefined'){
	window.createGuid =	function createGuid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	}
}


// array
if(typeof Array.diff === 'undefined'){
	Array.diff = function(a, b) {
		return a.filter(function(i) {
			return b.indexOf(i) < 0;
		});
	};
}
if(typeof Array.min === 'undefined'){
	Array.min = function(array){
		return Math.min.apply(Math, array)
	}
}
if(typeof Array.max === 'undefined'){
	Array.max = function(array){
		return Math.max.apply(Math, array)
	}
}
if (typeof Object.set === 'undefined') {
	Object.set = function (obj, data) {
		for (var key in data) {
			if (obj.hasOwnProperty(key)) {
				obj[key] = data[key];
			}
		}
	};
}

//https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign != 'function') {
	Object.assign = function(target) {
		'use strict';
		if (target == null) {
			throw new TypeError('Cannot convert undefined or null to object');
		}

		target = Object(target);
		for (var index = 1; index < arguments.length; index++) {
			var source = arguments[index];
			if (source != null) {
				for (var key in source) {
					if (Object.prototype.hasOwnProperty.call(source, key)) {
						target[key] = source[key];
					}
				}
			}
		}
		return target;
	};
}
/**
 * Deep copy an object (make copies of all its object properties, sub-properties, etc.)
 * An improved version of http://keithdevens.com/weblog/archive/2007/Jun/07/javascript.clone
 * that doesn't break if the constructor has required parameters
 *
 * It also borrows some code from http://stackoverflow.com/a/11621004/560114
 */
function deepCopy(src, /* INTERNAL */ _visited, _copiesVisited) {
	if(src === null || typeof(src) !== 'object'){
		return src;
	}

	//Honor native/custom clone methods
	if(typeof src.clone == 'function'){
		return src.clone(true);
	}

	//Special cases:
	//Date
	if(src instanceof Date){
		return new Date(src.getTime());
	}
	//RegExp
	if(src instanceof RegExp){
		return new RegExp(src);
	}
	//DOM Element
	if(src.nodeType && typeof src.cloneNode == 'function'){
		return src.cloneNode(true);
	}

	// Initialize the visited objects arrays if needed.
	// This is used to detect cyclic references.
	if (_visited === undefined){
		_visited = [];
		_copiesVisited = [];
	}

	// Check if this object has already been visited
	var i, len = _visited.length;
	for (i = 0; i < len; i++) {
		// If so, get the copy we already made
		if (src === _visited[i]) {
			return _copiesVisited[i];
		}
	}

	//Array
	if (Object.prototype.toString.call(src) == '[object Array]') {
		//[].slice() by itself would soft clone
		var ret = src.slice();

		//add it to the visited array
		_visited.push(src);
		_copiesVisited.push(ret);

		i = ret.length;
		while (i--) {
			ret[i] = deepCopy(ret[i], _visited, _copiesVisited);
		}
		return ret;
	}

	//If we've reached here, we have a regular object

	//make sure the returned object has the same prototype as the original
	var proto = (Object.getPrototypeOf ? Object.getPrototypeOf(src): src.__proto__);
	if (!proto) {
		proto = src.constructor.prototype; //this line would probably only be reached by very old browsers
	}
	var dest = object_create(proto);

	//add this object to the visited array
	_visited.push(src);
	_copiesVisited.push(dest);

	for (var key in src) {
		//Note: this does NOT preserve ES5 property attributes like 'writable', 'enumerable', etc.
		//For an example of how this could be modified to do so, see the singleMixin() function
		dest[key] = deepCopy(src[key], _visited, _copiesVisited);
	}
	return dest;
}

//If Object.create isn't already defined, we just do the simple shim,
//without the second argument, since that's all we need here
var object_create = Object.create;
if (typeof object_create !== 'function') {
	object_create = function(o) {
		function F() {}
		F.prototype = o;
		return new F();
	};
}