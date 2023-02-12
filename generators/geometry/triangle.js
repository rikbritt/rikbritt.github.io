
var subDividedTriangleGenerator = {
	version:1,
	name:"Subdivided Triangle",
	category:["Geometry"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			//{ name:"edgeLength",	type:"distance", units:"m",	min:0.01,	max:4},
			{ name:"subDivisions",	type:"int",					min:0,		max:10}
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"model",			type:"model"	}
		],
	},
	script:function(inputs, outputs){
		outputs.model = bg.CreateNode();
		
		//         v1
		//         /\
		//        /  \
		//       /    \
		//      /      \
		//  v0 /________\ v2
		//
		var v0 = bg.CreateTranslation( -1, 0, 0 );
		var v1 = bg.CreateTranslation( 0, 1, 0 );
		var v2 = bg.CreateTranslation( 1, 0, 0 );
		
		//Array of vert arrays. Seed with top of the triangle.
		var insertedVertsByRow = [[v1]];
		
		//Sub divide the triangle, row by row.
		var percPerRow = 1.0 / (inputs.subDivisions + 1.0);
		for(var row=0; row<inputs.subDivisions + 1; ++row)
		{
			var rowPerc = (row+1.0) * percPerRow;
			var rowBottomVerts = [];
			insertedVertsByRow.push(rowBottomVerts);
			
			var numNewVertsForRowBottom = row;
			
			var rowBottomStart = bg.GetTranslationAlongLine(v1, v0, rowPerc);
			var rowBottomEnd = bg.GetTranslationAlongLine(v1, v2, rowPerc);
			
			rowBottomVerts.push(rowBottomStart);
			var percPerRowVert = 1.0 / (numNewVertsForRowBottom + 1.0);
			for(var newV=0; newV<numNewVertsForRowBottom; ++newV)
			{
				var rowAcrossPerc = (newV+1.0) * percPerRowVert;
				var newVertPos = bg.GetTranslationAlongLine(rowBottomStart, rowBottomEnd, rowAcrossPerc);
				rowBottomVerts.push(newVertPos);
			}
			rowBottomVerts.push(rowBottomEnd);
		}
		
		//Add debug points for the output verts.
		for(var outRow=0; outRow < insertedVertsByRow.length; ++outRow)
		{
			var rowVerts = insertedVertsByRow[outRow];
			for(var v=0; v<rowVerts.length; ++v)
			{
				bg.CreateDebugPoint(outputs.model, rowVerts[v]);
			}
		}
	}
}
bg.RegisterGenerator(subDividedTriangleGenerator);