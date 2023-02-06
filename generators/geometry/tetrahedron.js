
var tetrahedronGenerator = {
	version:1,
	name:"Tetrahedron",
	category:["Geometry"],
	inputs:[
		{ name:"edgeLength",	type:"distance", units:"m",	min:0.01,	max:4},
		{ name:"subDivisions",	type:"int",					min:0,		max:4}
	],
	outputs:{
		model:{			type:"model"	}
	},
	script:function(inputs, outputs){
		outputs.model = bg.CreateNode();
		
		bg.CreateDebugPoint(outputs.model, bg.CreateTranslation( Math.sqrt(8.0/9.0), 0, -1.0/3.0 ) );
		bg.CreateDebugPoint(outputs.model, bg.CreateTranslation( -Math.sqrt(2.0/9.0), Math.sqrt(2.0/3.0), -1.0/3.0 ) );
		bg.CreateDebugPoint(outputs.model, bg.CreateTranslation( -Math.sqrt(2.0/9.0), -Math.sqrt(2.0/3.0), -1.0/3.0 ) );
		bg.CreateDebugPoint(outputs.model, bg.CreateTranslation( 0, 0, 1 ) );
		
		bg.CreateLineModelBetweenPoints(outputs.model, outputs.model.children[0].position, outputs.model.children[1].position );
		bg.CreateLineModelBetweenPoints(outputs.model, outputs.model.children[0].position, outputs.model.children[2].position );
		bg.CreateLineModelBetweenPoints(outputs.model, outputs.model.children[0].position, outputs.model.children[3].position );
		bg.CreateLineModelBetweenPoints(outputs.model, outputs.model.children[1].position, outputs.model.children[2].position );
		bg.CreateLineModelBetweenPoints(outputs.model, outputs.model.children[1].position, outputs.model.children[3].position );
		bg.CreateLineModelBetweenPoints(outputs.model, outputs.model.children[2].position, outputs.model.children[3].position );
	}
}
bg.RegisterGenerator(tetrahedronGenerator);