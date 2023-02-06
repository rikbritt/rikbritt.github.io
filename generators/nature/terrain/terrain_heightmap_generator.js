
var terrainHeightMapGenerator = {
	version:1,
	name:"Terrain Heightmap",
	category:["Nature","Terrain"],
	inputs:[
		{ name:"width",	type:"distance",	units:"m",	min:1.0, max:50 },
		{ name:"depth",	type:"distance",	units:"m",	min:1.0, max:50 }
	],
	outputs:{
		model:{			type:"model"	}
	},
	script:function(inputs, outputs){
		outputs.model = bg.CreateNode();
		
		var segmentsWidth = Math.floor(inputs.width);
		var segmentsDepth = Math.floor(inputs.depth);
				
		var map = {
			width:segmentsWidth,
			height:segmentsDepth,
			values:[]
		};
		
		for(var i=0; i<(map.width*map.height);++i)
		{
			//map.values.push(bg.GetRandomFloatFromSeed(i+inputs.seed, 0.0, 1.0));
			map.values.push(bg.GetRandomBetween(0.0, 1.0));
		}
		
		bg.CreateHeightMapTerrainModel(outputs.model, inputs.width, 1, inputs.depth, map);
	}
}
bg.RegisterGenerator(terrainHeightMapGenerator);