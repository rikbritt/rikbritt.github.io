
var floorGenerator = {
	version:1,
	name:"Floor Generator",
	category:["Buildings","Floor"],
	inputs:{
		width:{	type:"distance",	units:"m",	min:1.0, max:10 },
		depth:{	type:"distance",	units:"m",	min:1.0, max:10 }
	},
	outputs:{
		model:{			type:"model"	}
	},
	script:function(inputs, outputs){
		outputs.model = bg.CreateNode();
		
		var tileStride = 16;
		
		//Just stretch the tiles for now.
		var tileSizeX = inputs.width / tileStride;
		var tileSizeZ = inputs.depth / tileStride;
		var tileSizeY = 0.01;
		
		var tileStartX = (tileStride * -0.5) * tileSizeX + (tileSizeX*0.5);
		var tileStartZ = (tileStride * -0.5) * tileSizeZ + (tileSizeZ*0.5);
		for(var x=0; x<tileStride; ++x)
		{
			for(var z=0; z<tileStride; ++z)
			{
				var tilePosition = bg.CreateTranslation(tileStartX + (x * tileSizeX),0,tileStartZ + (z * tileSizeZ));
				var tileModel = bg.CreateFlooredBoxModel(outputs.model, tileSizeX, tileSizeY, tileSizeZ, tilePosition);
				
				//Make chequered pattern
				if((x + z) % 2 == 0)
				{
					tileModel.colour = 0xffffff;
				}
				else
				{
					tileModel.colour = 0x222222;
				}
			}
		}
		
		//var floor = CreateFlooredBoxModel(outputs.model, inputs.width, 0.1, inputs.depth, CreateTranslation(0,0,0));
		//floor.colour = 0x440000;
	}
}
bg.RegisterGenerator(floorGenerator);