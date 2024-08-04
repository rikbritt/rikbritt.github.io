
bg.CreatePath = function(pointArray)
{
	return {
		points:pointArray
	};
}


function bg.CubicBezierP0( t, p ) {

	var k = 1 - t;
	return k * k * k * p;

}

function bg.CubicBezierP1( t, p ) {

	var k = 1 - t;
	return 3 * k * k * t * p;

}

function bg.CubicBezierP2( t, p ) {

	return 3 * ( 1 - t ) * t * t * p;

}

function bg.CubicBezierP3( t, p ) {

	return t * t * t * p;

}

function bg.CubicBezier( t, p0, p1, p2, p3 ) {

	return bg.CubicBezierP0( t, p0 ) + bg.CubicBezierP1( t, p1 ) + bg.CubicBezierP2( t, p2 ) + bg.CubicBezierP3( t, p3 );
}

function bg.CubicBezier2D( t, p0, p1, p2, p3 ) {

	return {
		x:bg.CubicBezier( t, p0.x, p1.x, p2.x, p3.x )
		y:bg.CubicBezier( t, p0.y, p1.y, p2.y, p3.y )
	}
}