
bg.generators = [];
bg.generatorsById = {};
bg.RegisterGenerator = function(generator)
{
	var id = generator.id;
	if(generator.version==1)
	{
		if(generator.name == null)
		{
			console.error("Failed to register generator without a name");
			return false;
		}
		id = bg.GUIDFromStr(generator.name);
	}
	else if(generator.version == 2)
	{
		id = bg.GUIDFromStr(generator.id);
	}
	else
	{
		if(generator.id == null)
		{
			console.error("Failed to register generator without an id");
			return false;
		}
	}

	if(bg.generatorsById[id] != null)
	{
		console.error("Already have a generator registered with id " + id);
		return false;
	}

	if(Array.isArray(generator.inputs) == false )
	{
		console.error("Generator " + generator.name + " inputs are not an array");
		return false;
	}

	for(var i=0; i<generator.inputs.length; ++i)
	{
		var input_field = generator.inputs[i];
		if(input_field.id == null)
		{
			input_field.id = bg.GUIDFromStr(input_field.name);
		}
	}

	generator.id = id;
	bg.generators.push(generator);
	bg.generatorsById[id] = generator;
	return true;
}

//id should normally be null so it makes a new one
bg.CreateEmptyGenerator = function(id)
{
	if(id == null)
	{
		id = bg.CreateGUID();
	}
	var generator = {
		id:id,
		name:"",
		description:"",
		version:3,
		category:[],
		inputs:[
			//system:{		type:"data",		dataType:galaxyDataDef	}
		],
		outputs:[
			//data:{ type:"data", dataType:galaxyDataDef }
		],
		script:function(inputs, outputs){
			outputs.data = inputs;
		}
	};
	bg.RegisterGenerator(generator);
	return generator;
}

bg.GetGeneratorFullName = function(generator)
{
	var name = generator.name;
	if(generator.category != null)
	{
		name = generator.category.join(" / ") + " / " + name;
	}
	
	return name;
}

bg.GetGeneratorById = function(id)
{
	return bg.generatorsById[id];
}

bg.GetGeneratorInputByName = function(generator, name)
{
	for(var i=0; i<generator.inputs.length; ++i)
	{
		var input_field = generator.inputs[i];
		if(input_field.name == name)
		{
			return input_field;
		}
	}
	return null;
}

bg.CreateWeightingDataDef = function(dataDefIn)
{
	var weightDataDefOut = {
		version:1,
		name:dataDefIn.name + " Weight",
		fields:[]
	};
	
	for(var i=0; i<dataDefIn.fields.length; ++i)
	{
		var fieldDef = dataDefIn.fields[i];
		//currently ignore everything other than a normalised value.
		if(fieldDef.type == "norm")
		{
			weightDataDefOut.fields.push(
				{
					name:fieldDef.name,
					type:"weight",
					min:-1,
					max:1
				}
			);
		}
	}
	return weightDataDefOut;
}

bg.CreateEmptyOveriddenTables = function(fields, overidden)
{
	for(var i=0; i<fields.length; ++i)
	{
		var fieldDef = fields[i];
		var fieldName = fieldDef.name;
		if(fieldDef.type == "data")
		{
			overidden[fieldName] = this.CreateEmptyOveriddenTables(fieldDef.dataType.fields, {} );
		}
	}
	return overidden;
}

bg.BuildDataFields = function(fieldsIn, seed, inputs, autoGenerate, overidden)
{
	if(seed == undefined)
	{
		seed = 1;
	}
	
	if(autoGenerate == undefined)
	{
		autoGenerate = true;
	}
	
	var builtData = {};
	var fieldName = ""; //Required because this func is recursive and JS is weird with scope.
	var fieldDef = "";
	builtData.seed = seed;

	//Keep track of which fields were actually overriden
	if(overidden == undefined)
	{
		overidden = this.CreateEmptyOveriddenTables(fieldsIn, {});
		builtData._overidden = overidden;
	}
	//builtData._def = fieldsIn;
	
	for(var i=0; i<fieldsIn.length; ++i)
	{
		var fieldDef = fieldsIn[i];
		var fieldName = fieldDef.name;
		var fieldValue = null;
		
		if(fieldDef.value != undefined)
		{
			//If a value has already been generated/set, then use it
			fieldValue = fieldDef.value;
		}
		else if(autoGenerate)
		{
			if(inputs != undefined && inputs[fieldName] != undefined)
			{
				fieldValue = inputs[fieldName];
				if(fieldDef.type == "data")
				{
					var paramSeed = bg.SeedFromString(fieldName) + seed;
					fieldValue = bg.BuildDataFields(fieldDef.dataType.fields, paramSeed, fieldValue, fieldDef.autoGenerate, overidden[fieldName]);
				}
				else
				{
					overidden[fieldName] = true;
				}
			}
			else if(fieldDef.default != undefined)
			{
				fieldValue = fieldDef.default; //If there's a default value, use it. Otherwise this is undefined.
			}
			else if(fieldDef.script != undefined)
			{
				fieldValue = fieldDef.script(builtData);
			}

			else
			{
				//We need to generate the param value. Use the name as part of the seed
				var paramSeed = bg.SeedFromString(fieldName) + seed;
				fieldValue = bg.GenerateFieldValue(fieldDef, paramSeed);
			}
		}
		
		//#TODO: Check fieldValue is set.
		if(fieldValue != undefined)
		{
			builtData[fieldName] = fieldValue;
		}
	}
	
	return builtData;
}

//Treat the passed in generator and it's data as const.
bg.RunGenerator = function(generator, seed, inputs)
{
	if(generator.version != 1)
	{
		//Unknown generator version
		return;
	}
	
	if(seed == undefined)
	{
		seed = 1;
	}
	
	//#TODO: Build a graph
	
	//Make values for all inputs
	var builtInputs = bg.BuildDataFields(generator.inputs, seed, inputs);
	
	console.log("Built '" + generator.name + "' Inputs:");
	console.log(JSON.stringify(builtInputs, null, '\t'));
	
	Math.seedrandom(seed);
	var outputs = {};
	try
	{
		generator.script(builtInputs, outputs);
	}
	catch(err)
	{
		//outputs.error = err.message;
		outputs.error = err.stack;
	}
	
	//#TODO: Check outputs - each named output must exist.
	
	console.log("Generator '" + generator.name + "' Outputs:");
	console.log(JSON.stringify(outputs, null, '\t'));
	
	return { builtInputs:builtInputs, outputs:outputs };
}

bg.SetIfNotOverriden = function(overidden, override_val, generated_val)
{
	return overidden ? override_val : generated_val;
}

bg.SaveGeneratorToJSON = function(generator)
{
	var data = {
		id:generator.id,
		version:generator.version,
		name:generator.name,
		category:generator.category,
		inputs:generator.inputs,
		outputs:generator.outputs,
		//script - TODO
	}

	var data_json = JSON.stringify(data, null, 4);
	return data_json;
}