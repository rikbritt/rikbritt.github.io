//From https://github.com/evanshortiss/vec2d/blob/master/src/Vector2D.js


/**
 * Primary Vector2D class. Uses Array type for axis storage.
 * @class Vector2D
 * @param {Number} x The x component of this Vector2D
 * @param {Number} y The y component of this Vector2D
 */
function Vector2D(x, y) {
  if (this instanceof Vector2D === false) {
    return new Vector2D(x, y);
  }

  this._axes = [x, y];
}

var precision = [
  1,
  10,
  100,
  1000,
  10000,
  100000,
  1000000,
  10000000,
  100000000,
  1000000000,
  10000000000
];

Vector2D.prototype = {
  ctor: Vector2D,

  setAxes: function(x, y) {
    this.x = x;
    this.y = y;
    return this;
  },

  getX: function() {
    return this.x;
  },

  setX: function(x) {
    this.x = x;

    return this;
  },

  getY: function() {
    return this.y;
  },

  setY: function(y) {
    this.y = y;

    return this;
  },


  /**
   * View Vector2D as a string such as "Vec2D: (0, 4)"
   * @param   {Boolean}
   * @return  {String}
   */
  toString: function(round) {
    if (round) {
      return '(' + Math.round(this.x) +
        ', ' + Math.round(this.y) + ')';
    }
    return '(' + this.x + ', ' + this.y + ')';
  },


  /**
   * Return an array containing the Vector2D axes.
   * @return {Array}
   */
  toArray: function() {
    return new Array(this.x, this.y);
  },


  /**
   * Return an object containing the Vector2D axes.
   * @return {Object}
   */
  toObject: function() {
    return {
      x: this.x,
      y: this.y
    };
  },


  /**
   * Add the provided Vector2D to this one.
   * @param {Vector2D} vec
   */
  add: function(vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  },


  /**
   * Subtract the provided Vector2D from this one.
   * @param {Vector2D} vec
   */
  subtract: function(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  },


  /**
   * Check is the Vector2D provided equal to this one.
   * @param   {Vec2D}   vec
   * @return  {Boolean}
   */
  equals: function(vec) {
    return (vec.x == this.x && vec.y == this.y);
  },


  /**
   * Multiply this Vector2D by the provided Vector2D.
   * @param {Vector2D} vec
   */
  multiplyByVector2D: function(vec) {
    this.x *= vec.x;
    this.y *= vec.y;
    return this;
  },
  mulV: function(v) {
    return this.multiplyByVector2D(v);
  },


  /**
   * Multiply this Vector2D by the provided Vector2D.
   * @param {Vector2D} vec
   */
  divideByVector2D: function(vec) {
    this.x /= vec.x;
    this.y /= vec.y;
    return this;
  },
  divV: function(v) {
    return this.divideByVector2D(v);
  },


  /**
   * Multiply this Vector2D by the provided number
   * @param {Number} n
   */
  multiplyByScalar: function(n) {
    this.x *= n;
    this.y *= n;

    return this;
  },
  mulS: function(n) {
    return this.multiplyByScalar(n);
  },


  /**
   * Divive this Vector2D by the provided number
   * @param {Number} n
   */
  divideByScalar: function(n) {
    this.x /= n;
    this.y /= n;
    return this;
  },
  divS: function(n) {
    return this.divideByScalar(n);
  },


  /**
   * Normalise this Vector2D. Directly affects this Vector2D.
   * Use Vec2D.normalise(Vector2D) to create a normalised clone of this.
   */
  normalise: function() {
    return this.divideByScalar(this.magnitude());
  },


  /**
   * Return the magnitude (length) of this Vector2D.
   * @return  {Number}
   */
  magnitude: function() {
    var x = this.x,
      y = this.y;

    return Math.sqrt((x * x) + (y * y));
  },


  /**
   * Return the magnitude (length) of this Vector2D.
   * @return  {Number}
   */
  length: function() {
    return this.magnitude();
  },


  /**
   * Return the squred length of a Vector2D
   * @return {Number}
   */
  lengthSq: function() {
    var x = this.x,
      y = this.y;

    return (x * x) + (y * y);
  },


  /**
   * Get the dot product of this Vector2D by another.
   * @param   {Vector2D} vec
   * @return  {Number}
   */
  dot: function(vec) {
    return (vec.x * this.x) + (vec.y * this.y);
  },


  /**
   * Get the cross product of this Vector2D by another.
   * @param   {Vector2D} vec
   * @return  {Number}
   */
  cross: function(vec) {
    return ((this.x * vec.y) - (this.y * vec.x));
  },


  /**
   * Reverses this Vector2D.
   */
  reverse: function() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  },


  /**
   * Convert Vector2D to absolute values.
   * @param   {Vector2D} vec
   */
  abs: function() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);

    return this;
  },


  /**
   * Zeroes the Vector2D
   * @return  {Vector2D}
   */
  zero: function() {
    this.x = this.y = 0;
    return this;
  },


  /**
   * Distance between this Vector2D and another.
   * @param {Vector2D} v
   */
  distance: function (v) {
    var x = this.x - v.x;
    var y = this.y - v.y;

    return Math.sqrt((x * x) + (y * y));
  },


  /**
   * Rotate the vetor by provided radians.
   * @param   {Number}  rads
   * @return  {Vector2D}
   */
  rotate: function(rads) {
    var cos = Math.cos(rads),
      sin = Math.sin(rads);

    var ox = this.x,
      oy = this.y;

    this.x = ox * cos - oy * sin;
    this.y = ox * sin + oy * cos;

    return this;
  },
  
  angle: function(v) {
	return Math.atan2(v.y - this.y, v.x - this.x) * (180 / Math.PI) - 90;
  },


  /**
   * Round this Vector2D to n decimal places
   * @param {Number}  n
   */
  round: function(n) {
    // Default is two decimals
    n = n || 2;

    var p = precision[n];

    // This performs waaay better than toFixed and give Float32 the edge again.
    // http://www.dynamicguru.com/javascript/round-numbers-with-precision/
    this.x = ((0.5 + (this.x * p)) << 0) / p;
    this.y = ((0.5 + (this.y * p)) << 0) / p;

    return this;
  },


  /**
   * Create a copy of this Vector2D.
   * @return {Vector2D}
   */
  clone: function() {
    return new this.ctor(this.x, this.y);
  }
};

Object.defineProperty(Vector2D.prototype, 'x', {
  get: function () {
    return this._axes[0];
  },
  set: function (x) {
    this._axes[0] = x;
  }
});

Object.defineProperty(Vector2D.prototype, 'y', {
  get: function () {
    return this._axes[1];
  },
  set: function (y) {
    this._axes[1] = y;
  }
});