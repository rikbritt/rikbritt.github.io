
var geodesicSphereGenerator = {
	version:1,
	name:"Geodesic Sphere",
	category:["Geometry"],
	inputs:[
		{ name:"radius",		type:"distance",	units:"m",	min:1.0, 	max:50 },
		{ name:"subDivisions",	type:"int",					min:0,		max:4}
	],
	outputs:[
		{ name:"model",			type:"model"	}
	],
	script:function(inputs, outputs){
		outputs.model = bg.CreateNode();
		
		var X = 0.525731112119133606;
		var Z = 0.850650808352039932;
		var N = 0.0;
 
		var vertices =
		[
		  bg.CreateTranslation(-X,N,Z),
		  bg.CreateTranslation(X,N,Z),
		  bg.CreateTranslation(-X,N,-Z),
		  bg.CreateTranslation(X,N,-Z),
		  bg.CreateTranslation(N,Z,X),
		  bg.CreateTranslation(N,Z,-X),
		  bg.CreateTranslation(N,-Z,X),
		  bg.CreateTranslation(N,-Z,-X),
		  bg.CreateTranslation(Z,X,N),
		  bg.CreateTranslation(-Z,X, N),
		  bg.CreateTranslation(Z,-X,N),
		  bg.CreateTranslation(-Z,-X, N)
		];
		
		var triangles=
		[
		  [0,4,1],[0,9,4],[9,5,4],[4,5,8],[4,8,1],
		  [8,10,1],[8,3,10],[5,3,8],[5,2,3],[2,7,3],
		  [7,10,3],[7,6,10],[7,11,6],[11,0,6],[0,1,6],
		  [6,1,10],[9,0,11],[9,11,2],[9,2,5],[7,2,11]
		];

		//Really dumb. Generates multiple verts in same position etc.
		for(var s=0; s<inputs.subDivisions; ++s)
		{
			var newTriangles = [];
			var newVertices = [];
			for(var t=0; t<triangles.length; ++t)
			{
				var tri = triangles[t];
				//              tri[0] 0
				//              /\
				//             /  \
				//        1  a/____\c 2
				//		     /\    /\
				//		    /  \  /  \
				// tri[1]  /____\/____\ tri[2]
				//      3        b 4    5
				
				var newVertA = bg.GetTranslationBetweenPositions(vertices[tri[0]],vertices[tri[1]]);
				var newVertB = bg.GetTranslationBetweenPositions(vertices[tri[1]],vertices[tri[2]]);
				var newVertC = bg.GetTranslationBetweenPositions(vertices[tri[2]],vertices[tri[0]]);
				//newVertA.normalize();
				//newVertB.normalize();
				//newVertC.normalize();
				
				var vOffset = newVertices.length;
				newVertices.push(vertices[tri[0]]);
				newVertices.push(newVertA);
				newVertices.push(newVertC);
				newVertices.push(vertices[tri[1]]);
				newVertices.push(newVertB);
				newVertices.push(vertices[tri[2]]);
				
				newTriangles.push([0+vOffset, 2+vOffset, 1+vOffset]);
				newTriangles.push([1+vOffset, 4+vOffset, 3+vOffset]);
				newTriangles.push([1+vOffset, 2+vOffset, 4+vOffset]);
				newTriangles.push([2+vOffset, 5+vOffset, 4+vOffset]);
			}
			
			triangles = newTriangles;
			vertices = newVertices;
		}
		for(var i=0; i<vertices.length; ++i)
		{
			vertices[i].normalize();
			bg.CreateDebugPoint(outputs.model, vertices[i]);
		}
		
		//bg.CreateDebugPoint(outputs.model, bg.CreateTranslation(0,0,0));
		//bg.CreateDebugPoint(outputs.model, bg.CreateTranslation(-1,0,0));
	}
}
bg.RegisterGenerator(geodesicSphereGenerator);