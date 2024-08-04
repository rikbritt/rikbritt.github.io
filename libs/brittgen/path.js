
bg.CreatePath = function(pointArray)
{
	return {
		points:pointArray
	};
}


bg.CubicBezierP0 = function( t, p ) {

	var k = 1 - t;
	return k * k * k * p;

}

bg.CubicBezierP1 = function( t, p ) {

	var k = 1 - t;
	return 3 * k * k * t * p;

}

bg.CubicBezierP2 = function( t, p ) {

	return 3 * ( 1 - t ) * t * t * p;

}

bg.CubicBezierP3 = function( t, p ) {

	return t * t * t * p;

}

bg.CubicBezier = function( t, p0, p1, p2, p3 ) {

	return bg.CubicBezierP0( t, p0 ) + bg.CubicBezierP1( t, p1 ) + bg.CubicBezierP2( t, p2 ) + bg.CubicBezierP3( t, p3 );
}

bg.CubicBezier2D = function( t, p0, p1, p2, p3 ) {
	return {
		x:bg.CubicBezier( t, p0.x, p1.x, p2.x, p3.x )
		y:bg.CubicBezier( t, p0.y, p1.y, p2.y, p3.y )
	}
}