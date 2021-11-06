var solarSystemDataDef = {
	version:1,
	name:"Solar System",
	fields:{
		planets:{			type:"list", min:0, max:20	}
	}
};

var solarSystemGenerator = {
	version:1,
	name:"Solar System",
	category:"Universe",
	inputs:{
		system:{		type:"data",		dataType:solarSystemDataDef	}
	},
	outputs:{
		data:{ type:"data", dataType:solarSystemDataDef }
	},
	script:function(inputs, outputs){
		outputs.data = inputs.system;
	}
}
bg.RegisterGenerator(solarSystemGenerator);